import type { FiscalContext } from "./fiscal-context";

export const FISCAL_CONTEXTS = [
  {
    id: "fund",
    name: "基金",
    amountLabel: "残高 1兆4,505億円",
    amountNote: "令和8年度末・当初予算。積立543億円、取崩8,381億円。",
    roleLabel: "年度をまたぐ備え",
    summary:
      "特定の目的や財源不足に備えて積み立て、必要な年度に取り崩す資金です。家計の貯金に近い役割があります。",
    simulatorReason:
      "基金は1年間の歳出分野ではなく、年度をまたいで持つ残高です。この画面は年間総予算を固定して9分野を配分するため、基金残高を直接動かしません。",
    changeEffect:
      "取り崩すとその年度に使える財源を増やせますが、将来への備えは減ります。積み立てると現在使える財源が減る一方、将来の余力が増えます。",
    sourceId: "enacted",
  },
  {
    id: "bond",
    name: "都債",
    amountLabel: "発行 2,226億円",
    amountNote: "令和8年度末残高は4兆2,372億円。",
    roleLabel: "将来にも負担を分ける借入",
    summary:
      "道路や公共施設など長く使うものの財源として、東京都が資金を借り入れる仕組みです。発行後は元金と利子を返済します。",
    simulatorReason:
      "都債は歳出の配分先ではなく、予算を支える財源です。この画面では返済能力や発行条件まで判定できないため、借入額を直接動かしません。",
    changeEffect:
      "発行を増やすと現在使える財源を増やせますが、将来の返済負担も増えます。減らす場合は、ほかの財源か歳出の見直しが必要です。",
    sourceId: "enacted",
  },
  {
    id: "tax",
    name: "都税",
    amountLabel: "7兆3,856億円",
    amountNote: "法人二税2兆7,126億円、固定資産税・都市計画税1兆8,541億円。",
    roleLabel: "行政サービスを支える主な収入",
    summary:
      "都民や企業などが納める税で、東京都の行政サービスを支える主要な収入です。税収は景気や企業収益、地価などにも左右されます。",
    simulatorReason:
      "都税は歳出の配分先ではなく収入です。この画面は税制変更や景気による税収変化を計算しないため、9分野のスライダーとは分けています。",
    changeEffect:
      "税収見込みが増えると使える財源は増えますが、利用者が自由に決められる数字ではありません。税率などの変更には法令や制度上の手続が必要です。",
    sourceId: "enacted",
  },
] as const satisfies readonly FiscalContext[];
