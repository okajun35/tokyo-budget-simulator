import {
  buildAdvocacyRefinementMessages,
  extractAdvocacyRefinementText,
  findAdvocacyRefinementInputRisks,
  inspectAdvocacyRefinementOutput,
  type AdvocacyRefinementInput,
} from "./advocacy-refinement.ts";

export const PARTICIPATION_REFINEMENT_MODEL = "@cf/openai/gpt-oss-120b";

export const PARTICIPATION_REFINEMENT_LIMITS = {
  concern: 240,
  requestedAction: 120,
  reason: 240,
  total: 600,
  output: 900,
  bodyBytes: 4096,
} as const;

type AiBinding = {
  run(model: string, options: {
    messages: ReturnType<typeof buildAdvocacyRefinementMessages>;
    max_tokens: number;
    temperature: number;
  }): Promise<unknown>;
};

type RateLimitBinding = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type ParticipationRefinementBindings = {
  AI?: AiBinding;
  AI_GLOBAL_RATE_LIMITER?: RateLimitBinding;
  AI_CLIENT_RATE_LIMITER?: RateLimitBinding;
};

type ApiErrorCode =
  | "invalid_request"
  | "rate_limited"
  | "unsafe_model_output"
  | "service_unavailable";

const jsonResponse = (
  payload: { refinedText: string } | { error: ApiErrorCode; message: string },
  status: number,
  headers?: HeadersInit,
) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  },
});

const invalidRequest = () => jsonResponse({
  error: "invalid_request",
  message: "入力内容を確認してください。",
}, 400);

const codePointLength = (value: string) => [...value].length;

const readLimitedBody = async (request: Request, maximumBytes: number) => {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    totalBytes += value.byteLength;
    if (totalBytes > maximumBytes) {
      await reader.cancel();
      return undefined;
    }
    text += decoder.decode(value, { stream: true });
  }
};

const isExactInput = (value: unknown): value is AdvocacyRefinementInput => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.join(",") !== "concern,reason,requestedAction") return false;

  const concern = record.concern;
  const requestedAction = record.requestedAction;
  const reason = record.reason;
  if (typeof concern !== "string" || typeof requestedAction !== "string" || typeof reason !== "string") {
    return false;
  }
  if (!concern.trim() || !requestedAction.trim() || !reason.trim()) return false;

  const lengths = {
    concern: codePointLength(concern),
    requestedAction: codePointLength(requestedAction),
    reason: codePointLength(reason),
  };
  return lengths.concern <= PARTICIPATION_REFINEMENT_LIMITS.concern &&
    lengths.requestedAction <= PARTICIPATION_REFINEMENT_LIMITS.requestedAction &&
    lengths.reason <= PARTICIPATION_REFINEMENT_LIMITS.reason &&
    lengths.concern + lengths.requestedAction + lengths.reason <= PARTICIPATION_REFINEMENT_LIMITS.total;
};

const clientRateLimitKey = async (request: Request) => {
  const connectingIp = request.headers.get("cf-connecting-ip")?.trim();
  if (!connectingIp) return "client:unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(connectingIp));
  const encoded = [...new Uint8Array(digest)]
    .slice(0, 12)
    .map(value => value.toString(16).padStart(2, "0"))
    .join("");
  return `client:${encoded}`;
};

export async function handleParticipationRefinementRequest(
  request: Request,
  bindings: ParticipationRefinementBindings,
): Promise<Response> {
  if (request.method !== "POST") return invalidRequest();
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return invalidRequest();
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return invalidRequest();

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > PARTICIPATION_REFINEMENT_LIMITS.bodyBytes) {
    return invalidRequest();
  }

  let rawBody: string;
  try {
    const limitedBody = await readLimitedBody(request, PARTICIPATION_REFINEMENT_LIMITS.bodyBytes);
    if (limitedBody === undefined) return invalidRequest();
    rawBody = limitedBody;
  } catch {
    return invalidRequest();
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return invalidRequest();
  }
  if (!isExactInput(input) || findAdvocacyRefinementInputRisks(input).length > 0) {
    return invalidRequest();
  }

  const { AI, AI_GLOBAL_RATE_LIMITER, AI_CLIENT_RATE_LIMITER } = bindings;
  if (!AI || !AI_GLOBAL_RATE_LIMITER || !AI_CLIENT_RATE_LIMITER) {
    return jsonResponse({
      error: "service_unavailable",
      message: "AI推敲を現在利用できません。原文を利用してください。",
    }, 503);
  }

  let rateLimitResults: [{ success: boolean }, { success: boolean }];
  try {
    const clientKey = await clientRateLimitKey(request);
    rateLimitResults = await Promise.all([
      AI_GLOBAL_RATE_LIMITER.limit({ key: "participation-refinement" }),
      AI_CLIENT_RATE_LIMITER.limit({ key: clientKey }),
    ]);
  } catch {
    return jsonResponse({
      error: "service_unavailable",
      message: "AI推敲を現在利用できません。原文を利用してください。",
    }, 503);
  }
  if (rateLimitResults.some(result => !result.success)) {
    return jsonResponse({
      error: "rate_limited",
      message: "短時間の利用上限に達しました。しばらく待つか、原文を利用してください。",
    }, 429, { "retry-after": "60" });
  }

  try {
    const result = await AI.run(PARTICIPATION_REFINEMENT_MODEL, {
      messages: buildAdvocacyRefinementMessages(input),
      max_tokens: 300,
      temperature: 0,
    });
    const refinedText = extractAdvocacyRefinementText(result);
    if (!refinedText || codePointLength(refinedText) > PARTICIPATION_REFINEMENT_LIMITS.output) {
      return jsonResponse({
        error: "unsafe_model_output",
        message: "AI案を安全に確認できなかったため、原文を利用してください。",
      }, 422);
    }
    const inspection = inspectAdvocacyRefinementOutput(input, refinedText);
    if (!inspection.passed) {
      return jsonResponse({
        error: "unsafe_model_output",
        message: "AI案を安全に確認できなかったため、原文を利用してください。",
      }, 422);
    }
    return jsonResponse({ refinedText }, 200);
  } catch {
    return jsonResponse({
      error: "service_unavailable",
      message: "AI推敲を現在利用できません。原文を利用してください。",
    }, 503);
  }
}
