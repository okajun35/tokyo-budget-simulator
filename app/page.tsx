"use client";

import { useMemo, useState } from "react";

type Stage = "request" | "bureau_assessment" | "governor_assessment" | "proposal" | "enacted_budget" | "evaluation" | "external_request";

type Source = {
  id: string;
  source_url: string;
  source_title: string;
  source_date: string;
  fiscal_year: 2026;
  document_stage: Stage;
  retrieved_at: string;
  fact_or_interpretation: "fact" | "interpretation";
};

const SOURCES: Source[] = [
  { id: "enacted", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8yosangaiyounituite", source_title: "令和8年度予算概要", source_date: "2026-04-24", fiscal_year: 2026, document_stage: "enacted_budget", retrieved_at: "2026-08-06T21:50:00+09:00", fact_or_interpretation: "fact" },
  { id: "csv", source_url: "https://catalog.data.metro.tokyo.lg.jp/dataset/t000004d0000000005", source_title: "TOKYO予算見える化ボード データ一覧", source_date: "2026-01-30", fiscal_year: 2026, document_stage: "enacted_budget", retrieved_at: "2026-08-06T21:48:00+09:00", fact_or_interpretation: "fact" },
  { id: "proposal", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8nendo_tokyotoyosan_an_gaiyou", source_title: "令和8年度東京都予算案の概要", source_date: "2026-01-30", fiscal_year: 2026, document_stage: "proposal", retrieved_at: "2026-08-06T21:51:00+09:00", fact_or_interpretation: "fact" },
  { id: "request", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/08yosanyokyujokyou_index/", source_title: "令和8年度予算要求", source_date: "2025-11", fiscal_year: 2026, document_stage: "request", retrieved_at: "2026-08-06T21:52:00+09:00", fact_or_interpretation: "fact" },
  { id: "bureau", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8zaimukyokusateikekka", source_title: "令和8年度一般会計予算 財務局査定結果（事項別）", source_date: "2026-01", fiscal_year: 2026, document_stage: "bureau_assessment", retrieved_at: "2026-08-06T21:53:00+09:00", fact_or_interpretation: "fact" },
  { id: "governor", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/8chijisateikekka", source_title: "令和8年度一般会計予算 知事査定結果", source_date: "2026-01-30", fiscal_year: 2026, document_stage: "governor_assessment", retrieved_at: "2026-08-06T21:53:00+09:00", fact_or_interpretation: "fact" },
  { id: "parties", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/08seitoyobo", source_title: "令和8年度都議会各会派からの要望", source_date: "2025-12", fiscal_year: 2026, document_stage: "external_request", retrieved_at: "2026-08-06T21:51:00+09:00", fact_or_interpretation: "fact" },
  { id: "groups", source_url: "https://www.zaimu.metro.tokyo.lg.jp/zaisei/yosan/r8/08dantaiyobo_index", source_title: "各種団体からの東京都予算に対するヒアリング", source_date: "2025-11", fiscal_year: 2026, document_stage: "external_request", retrieved_at: "2026-08-06T21:51:00+09:00", fact_or_interpretation: "fact" },
  { id: "evaluation", source_url: "https://catalog.data.metro.tokyo.lg.jp/dataset/t000004d2000000024", source_title: "TOKYO政策評価・事業評価・グループ連携事業評価見える化ボード", source_date: "2026", fiscal_year: 2026, document_stage: "evaluation", retrieved_at: "2026-08-06T21:49:00+09:00", fact_or_interpretation: "fact" },
];

type Budget = {
  id: string;
  name: string;
  amount: number;
  color: string;
  description: string;
  request?: { bureau: string; requested: number; previous: number; reason: string };
  bureauAssessment?: string;
  governorAssessment?: string;
};

const BASE: Budget[] = [
  { id: "welfare", name: "福祉と保健", amount: 18730, color: "#ef6a45", description: "少子高齢化対策など", request: { bureau: "福祉局＋保健医療局", requested: 18352.6, previous: 17564.8, reason: "福祉局は事業費増、保健医療局は医療提供体制等を中心に要求。目的別予算とは集計範囲が一致しません。" }, bureauAssessment: "例：シルバーパスは要求286.04億円→査定274.10億円（経費精査等）。後期高齢者医療は1,735.43億円→1,707.17億円（要求額の調整）。", governorAssessment: "例：民生・児童委員活動等は13.91億円→42.31億円、女性のがん検診受診応援事業は新規16.17億円。" },
  { id: "education", name: "教育と文化", amount: 15922, color: "#5f7fce", description: "学校教育の充実など", request: { bureau: "教育庁（代表）", requested: 11145.8, previous: 10478.0, reason: "給与関係費と事業費の増を要求。文化・私学等は別局を含むため目的別総額とは一致しません。" }, bureauAssessment: "例：学校給食運営管理は357.19億円→546.87億円、子供の学力に対する懸念の解消は141.87億円→137.40億円。", governorAssessment: "例：公立学校給食費負担軽減は477.08億円→477.66億円、給付型奨学金は13.30億円→22.09億円。" },
  { id: "industry", name: "労働と経済", amount: 7822, color: "#dfaa3a", description: "産業の活性化など", bureauAssessment: "例：金融支援は3,415.76億円→3,394.00億円、創業支援は150.08億円→145.73億円。", governorAssessment: "知事査定の事業別資料で変更事項を確認できます。" },
  { id: "environment", name: "生活環境", amount: 4813, color: "#50a47b", description: "廃棄物対策など", request: { bureau: "環境局（代表）", requested: 2635, previous: 2177, reason: "脱炭素、資源循環、生物多様性、都市環境を柱に前年度比21.1%増を要求。目的別総額とは集計範囲が一致しません。" }, bureauAssessment: "再生可能エネルギーの推進は411.40億円→317.40億円（経費精査等）。環境エネルギー政策は1,391.84億円→1,684.88億円。", governorAssessment: "浮体式洋上風力発電導入推進事業は11.11億円→27.42億円（要求額の調整）。" },
  { id: "city", name: "都市の整備", amount: 9823, color: "#45a4b7", description: "道路の整備など", bureauAssessment: "例：道路整備は267.31億円→265.33億円、公園整備は367.02億円→344.33億円。", governorAssessment: "空き家等みどり転用支援事業は0.90億円→4.00億円。" },
  { id: "safety", name: "警察と消防", amount: 10575, color: "#965eab", description: "警察・消防活動など" },
  { id: "admin", name: "企画・総務", amount: 4993, color: "#76808b", description: "行政運営など" },
  { id: "debt", name: "公債費", amount: 2799, color: "#b17860", description: "都債の元利償還など" },
  { id: "linked", name: "税連動経費等", amount: 21053, color: "#98963f", description: "区市町村への交付金など" },
];

const money = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}億円`;
const stageLabel: Record<Stage, string> = { request: "各局要求", bureau_assessment: "財務局査定", governor_assessment: "知事査定", proposal: "予算案", enacted_budget: "成立予算", evaluation: "政策・事業評価", external_request: "外部要望" };

const participation = [
  { title: "請願", to: "東京都議会議長（議会局議事部議案法制課）", target: "条例・予算・契約など都政に関わる要望", procedure: "邦文の請願書1部、件名40字以内、理由1,500字以内、住所・署名等、紹介議員の署名。持参または郵送。", flow: "文書表→所管委員会→本会議で採択／不採択。採択後、必要なものは知事等へ送付。", can: "議会の正式な審査対象にできる。", cannot: "特定の予算措置や執行を直接命令できない。", source: "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html" },
  { title: "陳情", to: "東京都議会議長（同上）", target: "都政への要望・意見", procedure: "紹介議員は不要。その他の書式・提出方法は原則として請願に準じる。", flow: "要件を満たせば原則請願に準じて扱う。一部は委員会付託せず関係議員への送付・閲覧。", can: "議員紹介なしで提出できる。", cannot: "必ず委員会審査・採択になるとは限らない。", source: "https://www.gikai.metro.tokyo.lg.jp/petition/guide.html" },
  { title: "都民の声", to: "東京都 都民の声総合窓口", target: "都政への提言・意見、相談", procedure: "公式フォーム等から内容を送る。個別制度の申請や緊急通報とは別。", flow: "窓口で受領し、内容に応じて所管部署で参考・対応。", can: "行政へ幅広く意見を届けられる。", cannot: "議会の採択手続ではなく、個別回答や予算化は保証されない。", source: "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/tominnokoe/" },
  { title: "パブリックコメント", to: "意見募集中の計画・条例案を所管する各局", target: "募集対象として公表された計画・方針・条例案など", procedure: "募集期間、対象資料、指定フォーム・メール・郵送等は各案件の要領に従う。", flow: "意見募集→所管局が検討→意見概要と都の考え方を公表する案件がある。", can: "公表された案に対して期間内に意見を出せる。", cannot: "常時任意の予算項目を変更する制度ではなく、採用・予算反映は保証されない。", source: "https://www.metro.tokyo.lg.jp/tosei/iken-sodan/jyuyokohyo" },
];

export default function Home() {
  const [values, setValues] = useState<Record<string, number>>(Object.fromEntries(BASE.map(x => [x.id, x.amount])));
  const [selected, setSelected] = useState("welfare");
  const [tab, setTab] = useState<"sim" | "participate" | "sources">("sim");
  const [openStage, setOpenStage] = useState<Stage | null>(null);
  const total = useMemo(() => Object.values(values).reduce((a, b) => a + b, 0), [values]);
  const diff = total - 96530;
  const active = BASE.find(x => x.id === selected)!;

  const setValue = (id: string, value: number) => {
    setValues(v => ({ ...v, [id]: value }));
    setSelected(id);
  };
  const reset = () => setValues(Object.fromEntries(BASE.map(x => [x.id, x.amount])));

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="東京予算ラボ トップ"><span className="brandMark">都</span><span>東京予算ラボ<small>令和8年度・一般会計</small></span></a>
      <nav aria-label="主要メニュー">
        <button className={tab === "sim" ? "active" : ""} onClick={() => setTab("sim")}>予算を組む</button>
        <button className={tab === "participate" ? "active" : ""} onClick={() => setTab("participate")}>声を届ける</button>
        <button className={tab === "sources" ? "active" : ""} onClick={() => setTab("sources")}>出典</button>
      </nav>
    </header>

    {tab === "sim" && <>
      <section className="hero" id="top">
        <div>
          <p className="eyebrow">BUDGET SIMULATOR · FY2026</p>
          <h1>9兆6,530億円を、<br/><em>あなたならどう配る？</em></h1>
          <p className="lead">東京都の成立後当初予算を出発点に、目的別の配分を動かせます。数字を変えると、要求・査定・知事判断という予算編成の背景を追えます。</p>
          <div className="heroActions"><a href="#simulator" className="primary">配分を動かす <span>↓</span></a><button onClick={() => setTab("sources")} className="textButton">データの扱いを見る</button></div>
        </div>
        <div className="heroCard" aria-label="令和8年度予算の概要">
          <span className="stamp">成立後</span>
          <p>一般会計</p><strong>9<small>兆</small>6,530<small>億円</small></strong>
          <div className="statLine"><span>一般歳出</span><b>7兆2,678億円</b></div>
          <div className="statLine"><span>都税</span><b>7兆3,856億円</b></div>
          <div className="miniChart">{BASE.map(x => <i key={x.id} style={{width: `${x.amount / 96530 * 100}%`, background: x.color}} />)}</div>
          <small className="sourceNote">成立予算概要と令和8年度CSVを照合</small>
        </div>
      </section>

      <section className="process" aria-label="予算成立までの段階">
        <p>予算は、最初から今の形ではありません。</p>
        <div>{(["request","bureau_assessment","governor_assessment","proposal","enacted_budget"] as Stage[]).map((s, i) => <button key={s} onClick={() => setOpenStage(openStage === s ? null : s)} className={openStage === s ? "selected" : ""}><span>{i + 1}</span>{stageLabel[s]}</button>)}</div>
        {openStage && <aside className="stageExplainer"><b>{stageLabel[openStage]}</b><p>{openStage === "request" ? "各局が必要と考える経費を見積もった段階。成立額とは異なります。" : openStage === "bureau_assessment" ? "財務局が各局要求を査定した段階。事項別資料は要求から1億円以上増減した事項を掲載。" : openStage === "governor_assessment" ? "財務局査定後に知事判断で変更した段階。財務局査定と別に扱います。" : openStage === "proposal" ? "知事査定等を反映し、都議会へ提出する予算案。まだ成立予算ではありません。" : "都議会の議決後の当初予算。本シミュレーターの初期値です。"}</p></aside>}
      </section>

      <section className="simulator" id="simulator">
        <div className="sectionHead"><div><p className="eyebrow">ALLOCATION</p><h2>目的別に配分する</h2><p>スライダーは基準額の70〜130%。1億円単位です。</p></div><button className="reset" onClick={reset}>↺ 初期値に戻す</button></div>
        <div className="balance" data-state={diff === 0 ? "ok" : diff > 0 ? "over" : "under"}>
          <div><span>あなたの予算総額</span><strong>{money(total)}</strong></div>
          <div className="balanceTrack"><i style={{width: `${Math.min(100, total / 96530 * 100)}%`}} /></div>
          <p>{diff === 0 ? "基準予算と一致しています" : diff > 0 ? `財源が ${money(diff)} 不足しています` : `${money(Math.abs(diff))} の余裕があります`}</p>
        </div>

        <div className="simGrid">
          <div className="sliders">
            {BASE.map(item => {
              const changed = values[item.id] !== item.amount;
              const delta = values[item.id] - item.amount;
              return <article key={item.id} className={`budgetRow ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}>
                <div className="rowTitle"><span className="colorDot" style={{background:item.color}}/><div><h3>{item.name}</h3><small>{item.description}</small></div><strong>{money(values[item.id])}</strong></div>
                <div className="sliderLine"><input aria-label={`${item.name}の予算`} type="range" min={Math.round(item.amount * .7)} max={Math.round(item.amount * 1.3)} value={values[item.id]} onChange={e => setValue(item.id, Number(e.target.value))} style={{"--accent": item.color} as React.CSSProperties}/><span className={changed ? delta > 0 ? "up" : "down" : ""}>{changed ? `${delta > 0 ? "+" : ""}${money(delta)}` : "基準"}</span></div>
              </article>
            })}
          </div>

          <aside className="contextPanel">
            <p className="panelKicker">いま見ている分野</p><h2>{active.name}</h2>
            <div className="amountCompare"><span>成立後の初期値<b>{money(active.amount)}</b></span><span>あなたの配分<b>{money(values[active.id])}</b></span></div>
            <div className="warning">目的別予算と局別要求は集計範囲が異なります。直接の差額比較ではありません。</div>
            <div className="timelineCard"><span className="stageTag request">各局要求</span>{active.request ? <><h3>{active.request.bureau}</h3><div className="requestNums"><span>R8要求<b>{money(active.request.requested)}</b></span><span>R7当初<b>{money(active.request.previous)}</b></span></div><p>{active.request.reason}</p></> : <p>このプロトタイプでは、代表局の要求総額をまだ対応付けていません。推測値は表示しません。</p>}</div>
            <div className="timelineCard"><span className="stageTag bureau">財務局査定</span><p>{active.bureauAssessment ?? "この分野の代表事例は未収録です。公式の事項別一覧で確認できます。"}</p></div>
            <div className="timelineCard"><span className="stageTag governor">知事査定</span><p>{active.governorAssessment ?? "知事査定で変更された事項だけが資料に掲載されます。該当なしを『判断なし』とは扱いません。"}</p></div>
            <div className="noForecast"><b>効果量は計算しません</b><p>予算増減と成果の因果関係が公式資料で示されない限り、「何人改善」「何％向上」といった推測はしません。</p><button onClick={() => setTab("sources")}>政策・事業評価の出典を見る →</button></div>
          </aside>
        </div>
      </section>

      <section className="fiscalFacts">
        <div className="sectionHead"><div><p className="eyebrow">FISCAL CONTEXT</p><h2>動かせない前提も見る</h2></div></div>
        <div className="factGrid"><article><span>基金残高</span><strong>1兆4,505億円</strong><p>R8年度末・当初予算。積立543億円、取崩8,381億円。</p></article><article><span>都債</span><strong>発行 2,226億円</strong><p>R8年度末残高は4兆2,372億円。</p></article><article><span>都税</span><strong>7兆3,856億円</strong><p>法人二税2兆7,126億円、固定資産税・都市計画税1兆8,541億円。</p></article></div>
        <p className="csvBadge">✓ 画面の基準値は8種類の公式CSVから機械取得。PDFからの手入力は背景説明に限定。</p>
      </section>
    </>}

    {tab === "participate" && <section className="subpage">
      <p className="eyebrow">CIVIC PARTICIPATION</p><h1>予算を動かすゲームの次に、<br/>現実の制度を知る。</h1><p className="intro">どの制度も、提出すれば予算に反映される仕組みではありません。提出先・対象・手続・処理の流れがそれぞれ違います。</p>
      <div className="participationGrid">{participation.map((p, i) => <article key={p.title}><div className="participationTitle"><span>0{i+1}</span><h2>{p.title}</h2></div><dl><dt>提出先</dt><dd>{p.to}</dd><dt>対象</dt><dd>{p.target}</dd><dt>必要な手続</dt><dd>{p.procedure}</dd><dt>処理の流れ</dt><dd>{p.flow}</dd><dt>できること</dt><dd>{p.can}</dd><dt>できないこと</dt><dd>{p.cannot}</dd></dl><div className="guarantee">予算への反映は保証されません</div><a href={p.source} target="_blank" rel="noreferrer">公式案内を開く ↗</a></article>)}</div>
    </section>}

    {tab === "sources" && <section className="subpage sourcesPage">
      <p className="eyebrow">PROVENANCE</p><h1>数字の「いつ・どの段階」を<br/>消さない。</h1><p className="intro">成立予算、予算案、各局要求、財務局査定、知事査定、外部要望を別データとして保持しています。会派・団体の要望は東京都の確定政策として扱いません。</p>
      <div className="priority"><h2>採用優先順位</h2><ol><li>成立後の予算概要・予算説明書</li><li>令和8年度CSV</li><li>予算案</li><li>知事査定</li><li>財務局査定</li><li>各局要求</li><li>会派・団体要望</li></ol></div>
      <div className="sourceList">{SOURCES.map(s => <article key={s.id}><div><span className={`stageTag ${s.document_stage}`}>{stageLabel[s.document_stage]}</span><h3>{s.source_title}</h3><a href={s.source_url} target="_blank" rel="noreferrer">一次資料を開く ↗</a></div><dl><dt>source_date</dt><dd>{s.source_date}</dd><dt>fiscal_year</dt><dd>{s.fiscal_year}</dd><dt>document_stage</dt><dd>{s.document_stage}</dd><dt>retrieved_at</dt><dd>{s.retrieved_at}</dd><dt>fact_or_interpretation</dt><dd>{s.fact_or_interpretation}</dd></dl></article>)}</div>
      <div className="dataCoverage"><h2>使用したCSV</h2><p>一般会計 歳入歳出予算／一般歳出 目的別内訳／一般会計歳出予算 性質別内訳／一般会計 歳入内訳／都税内訳／基金の残高推移／基金の積立・取崩状況／都債発行額と都債残高の推移</p></div>
    </section>}

    <footer><div className="brand"><span className="brandMark">都</span><span>東京予算ラボ<small>非公式プロトタイプ</small></span></div><p>東京都の公式サービスではありません。金額単位未満の端数により合計が一致しない場合があります。</p><a href="https://odhackathon.metro.tokyo.lg.jp/issues/c10/clusters/" target="_blank" rel="noreferrer">都知事杯ODH テーマ ↗</a></footer>
  </main>;
}
