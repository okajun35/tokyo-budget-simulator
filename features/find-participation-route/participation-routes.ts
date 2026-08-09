import type { ParticipationRoute } from "./participation-route";

export const PARTICIPATION_ROUTES = [
  {
    id: "petition",
    title: "請願",
    recipient: "東京都議会議長（議会局議事部議案法制課）",
    target: "条例・予算・契約など都政に関わる要望",
    procedure:
      "邦文の請願書1部、件名40字以内、理由1,500字以内、住所・署名等、紹介議員の署名。持参または郵送。",
    flow: "文書表→所管委員会→本会議で採択／不採択。採択後、必要なものは知事等へ送付。",
    canDo: "議会の正式な審査対象にできる。",
    cannotGuarantee: "特定の予算措置や執行を直接命令できない。",
    officialGuideUrl:
      "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
  },
  {
    id: "written-request",
    title: "陳情",
    recipient: "東京都議会議長（同上）",
    target: "都政への要望・意見",
    procedure:
      "紹介議員は不要。その他の書式・提出方法は原則として請願に準じる。",
    flow: "要件を満たせば原則請願に準じて扱う。一部は委員会付託せず関係議員への送付・閲覧。",
    canDo: "議員紹介なしで提出できる。",
    cannotGuarantee: "必ず委員会審査・採択になるとは限らない。",
    officialGuideUrl:
      "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
  },
  {
    id: "resident-voice",
    title: "都民の声",
    recipient: "東京都 都民の声総合窓口",
    target: "都政への提言・意見、相談",
    procedure:
      "公式フォーム等から内容を送る。個別制度の申請や緊急通報とは別。",
    flow: "窓口で受領し、内容に応じて所管部署で参考・対応。",
    canDo: "行政へ幅広く意見を届けられる。",
    cannotGuarantee:
      "議会の採択手続ではなく、個別回答や予算化は保証されない。",
    officialGuideUrl:
      "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/",
  },
  {
    id: "public-comment",
    title: "パブリックコメント",
    recipient: "意見募集中の計画・条例案を所管する各局",
    target: "募集対象として公表された計画・方針・条例案など",
    procedure:
      "募集期間、対象資料、指定フォーム・メール・郵送等は各案件の要領に従う。",
    flow: "意見募集→所管局が検討→意見概要と都の考え方を公表する案件がある。",
    canDo: "公表された案に対して期間内に意見を出せる。",
    cannotGuarantee:
      "常時任意の予算項目を変更する制度ではなく、採用・予算反映は保証されない。",
    officialGuideUrl:
      "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/jyuyokohyo",
  },
] as const satisfies readonly ParticipationRoute[];
