import type { ParticipationRoute } from "./participation-route";

export const PARTICIPATION_ROUTES = [
  {
    id: "bureau-inquiry",
    title: "担当局への問い合わせ・意見",
    recipient: "事業を担当する東京都の各局・各局都民の声窓口",
    target: "担当局が所管する事業への問い合わせ、提言、意見、要望",
    procedure:
      "分野の主な所管を確認し、各局が案内する電話・フォーム等を利用します。緊急通報や個別の申請手続とは別です。",
    flow: "各局窓口で受領し、内容に応じて担当部署へ伝達・案内されます。",
    canDo: "関心のある事業を担当する局へ直接伝えられます。",
    cannotGuarantee:
      "担当局への連絡だけで、事業変更、個別回答、予算化が決まるわけではありません。",
    officialGuideUrl:
      "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/sodan/koe",
  },
  {
    id: "resident-voice",
    title: "都民の声",
    recipient: "東京都 都民の声総合窓口",
    target: "都政への提言・意見、要望、相談",
    procedure:
      "公式フォーム、手紙、ファクス等から内容を送ります。個別制度の申請や緊急通報とは別です。",
    flow: "総合窓口で受領し、内容に応じて関係各局等へ伝達され、都政運営の参考として扱われます。",
    canDo: "担当局が分からない場合も、行政へ幅広く意見を届けられます。",
    cannotGuarantee:
      "議会の採択手続ではなく、個別回答や予算化は保証されません。",
    officialGuideUrl:
      "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/",
  },
  {
    id: "public-comment",
    title: "パブリックコメント",
    recipient: "意見募集中の計画・条例案を所管する各局",
    target: "募集対象として公表された計画・方針・条例案など",
    procedure:
      "募集期間、対象資料、指定フォーム・メール・郵送等は各案件の要領に従います。",
    flow: "意見募集後、所管局が検討し、案件に応じて意見概要と都の考え方を公表します。",
    canDo: "公表された案に対して、募集期間内に意見を出せます。",
    cannotGuarantee:
      "常時任意の予算項目を変更する制度ではなく、採用・予算反映は保証されません。",
    officialGuideUrl:
      "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/jyuyokohyo",
  },
  {
    id: "petition",
    title: "請願",
    recipient: "東京都議会議長（議会局議事部議案法制課）",
    target: "条例・予算・契約など都政に関わる要望",
    procedure:
      "邦文の請願書1部、件名40字以内、理由1,500字以内、住所・署名等、紹介議員の署名が必要です。持参または郵送します。",
    flow: "文書表の作成後、所管委員会と本会議で採択・不採択を判断し、採択後に必要なものは知事等へ送付されます。",
    canDo: "議員の紹介を得て、議会の正式な審査対象にできます。",
    cannotGuarantee: "特定の予算措置や執行を直接命令できません。",
    officialGuideUrl:
      "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
  },
  {
    id: "written-request",
    title: "陳情",
    recipient: "東京都議会議長（議会局議事部議案法制課）",
    target: "都政への要望・意見",
    procedure:
      "紹介議員は不要です。その他の書式・提出方法は原則として請願に準じます。",
    flow: "要件を満たせば原則請願に準じて扱われます。一部は委員会へ付託せず、関係議員への送付・閲覧となります。",
    canDo: "議員紹介なしで議会へ文書を提出できます。",
    cannotGuarantee: "必ず委員会審査や採択の対象になるとは限りません。",
    officialGuideUrl:
      "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html",
  },
  {
    id: "assembly-member-request",
    title: "都議会議員・会派への要望",
    recipient: "選挙区の東京都議会議員または東京都議会の各会派",
    target: "都政、条例、予算、事業に関する意見・要望",
    procedure:
      "公式の議員名簿・会派連絡先を確認し、各議員・会派が案内する方法で連絡します。",
    flow: "議員・会派が内容を受け取り、質問、政策検討、請願の紹介などに用いるかをそれぞれ判断します。",
    canDo: "議会で審議・採決する立場の議員や会派へ意見を伝えられます。",
    cannotGuarantee:
      "質問、政策化、請願紹介、予算修正として取り上げられることは保証されません。",
    officialGuideUrl:
      "https://www.gikai.metro.tokyo.lg.jp/about/contact.html",
  },
  {
    id: "election-citizen-proposal",
    title: "選挙・都民提案",
    recipient: "選挙では候補者・政党等、都民提案では東京都財務局",
    target: "選挙による代表者の選択、または募集要件に合う東京都の事業案",
    procedure:
      "選挙は選挙管理委員会の案内に従って投票します。都民提案は年度ごとの対象者・募集期間・応募要件を確認して提案します。",
    flow: "選挙は投票・開票を経て代表者を選びます。都民提案は提案受付、審査、都民投票等を経て予算案への反映候補を選びます。",
    canDo: "代表者を選択し、募集期間中は具体的な事業案を提案できます。",
    cannotGuarantee:
      "投票だけで個別予算を指示できず、都民提案も応募・選定・最終的な予算成立を保証する制度ではありません。",
    officialGuideUrl:
      "https://www.zaimu.metro.tokyo.lg.jp/zaisei/zaisei/zigyou_teian/2026tomin_teian",
    relatedOfficialGuide: {
      label: "東京都選挙管理委員会",
      url: "https://www.senkyo.metro.tokyo.lg.jp/",
    },
  },
] as const satisfies readonly ParticipationRoute[];
