import assert from "node:assert/strict";
import test from "node:test";

import { PARTICIPATION_ROUTES } from "./participation-routes.ts";

test("provides the seven participation routes required by the specification", () => {
  assert.deepEqual(
    PARTICIPATION_ROUTES.map((route) => route.title),
    [
      "担当局への問い合わせ・意見",
      "都民の声",
      "パブリックコメント",
      "請願",
      "陳情",
      "都議会議員・会派への要望",
      "選挙・都民提案",
    ],
  );
});

test("keeps participation routes uniquely identifiable and linked to official guidance", () => {
  const ids = PARTICIPATION_ROUTES.map((route) => route.id);

  assert.equal(new Set(ids).size, ids.length);
  for (const route of PARTICIPATION_ROUTES) {
    assert.match(route.officialGuideUrl, /^https:\/\//);
    assert.ok(route.canDo.length > 0);
    assert.ok(route.cannotGuarantee.length > 0);
  }
});
