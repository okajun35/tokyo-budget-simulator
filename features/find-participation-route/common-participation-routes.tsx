import { COMMON_PARTICIPATION_OPTIONS } from "./common-participation-options";
import { CONTACT_ACTION_LABELS } from "./participation-topic";

export function CommonParticipationRoutes() {
  return <section className="participationCommon" aria-labelledby="other-routes-heading">
    <div className="participationSectionHeading">
      <p className="eyebrow">OTHER OFFICIAL ROUTES</p>
      <h2 id="other-routes-heading">ほかの方法</h2>
      <p>担当局の窓口とは役割が異なる、東京都・東京都議会の共通制度です。</p>
    </div>
    <div className="participationCommonGrid">
      {COMMON_PARTICIPATION_OPTIONS.map(option => <article key={option.id} data-common-route={option.id}>
        <h3>{option.title}</h3>
        <p>{option.description}</p>
        {"availabilityNote" in option && <p className="participationRouteNote">{option.availabilityNote}</p>}
        <div className="participationOfficialLinks">
          {option.links.map(link => <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
            {link.label}<small>{CONTACT_ACTION_LABELS[link.kind]}（外部リンク）↗</small>
          </a>)}
        </div>
      </article>)}
    </div>
  </section>;
}
