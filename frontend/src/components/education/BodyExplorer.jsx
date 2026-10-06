import { useState } from "react";
import { getLocalized, getLocalizedAsset } from "../../content/educationContent";

const areas = [
  {
    id: "pelvis",
    label: { en: "Pelvis", sw: "Nyonga" },
    explanation: {
      en: "Endometriosis is often discussed in relation to the pelvis. Pelvic pain can also have many other causes.",
      sw: "Endometriosis huzungumziwa mara nyingi kuhusiana na nyonga. Maumivu ya nyonga yanaweza pia kuwa na sababu nyingine nyingi.",
    },
  },
  {
    id: "uterus",
    label: { en: "Uterus", sw: "Mji wa mimba" },
    explanation: {
      en: "The uterus is a nearby structure. Endometriosis describes tissue similar to the uterine lining found outside the uterus.",
      sw: "Mji wa mimba ni sehemu iliyo karibu. Endometriosis hueleza tishu zinazofanana na utando wake wa ndani zinazopatikana nje ya mji wa mimba.",
    },
  },
  {
    id: "ovaries",
    label: { en: "Ovaries", sw: "Ovari" },
    explanation: {
      en: "Endometriosis can involve the ovaries. A drawing cannot show whether a person has endometriosis in this area.",
      sw: "Endometriosis inaweza kuhusisha ovari. Mchoro hauwezi kuonyesha kama mtu ana endometriosis katika eneo hili.",
    },
  },
  {
    id: "bowel",
    label: { en: "Bowel", sw: "Utumbo" },
    explanation: {
      en: "Some people report bowel symptoms. These can have different causes and should be discussed with a qualified professional if they concern you.",
      sw: "Baadhi ya watu huripoti dalili za utumbo. Dalili hizi zinaweza kuwa na sababu tofauti; zungumza na mtaalamu aliyehitimu ikiwa zinakutia wasiwasi.",
    },
  },
  {
    id: "bladder",
    label: { en: "Bladder", sw: "Kibofu" },
    explanation: {
      en: "Some people report urinary symptoms. This does not identify the cause; a healthcare professional can help assess them.",
      sw: "Baadhi ya watu huripoti dalili za mkojo. Hii haibaini chanzo; mtaalamu wa afya anaweza kusaidia kuzitathmini.",
    },
  },
  {
    id: "other",
    label: { en: "Other areas", sw: "Maeneo mengine" },
    explanation: {
      en: "Endometriosis may also affect other areas. The simplified picture shows only a few examples and is not a complete anatomical map.",
      sw: "Endometriosis inaweza pia kuathiri maeneo mengine. Mchoro rahisi unaonyesha mifano michache tu na si ramani kamili ya mwili.",
    },
  },
];

export default function BodyExplorer({ language, copy }) {
  const [selectedId, setSelectedId] = useState(areas[0].id);
  const selected = areas.find((area) => area.id === selectedId) || areas[0];

  return (
    <section className="body-explorer" aria-labelledby="body-explorer-heading">
      <h2 id="body-explorer-heading">{copy.bodyHeading}</h2>
      <p>{copy.bodyIntro}</p>
      <figure className="body-explorer-figure">
        <img
          src={getLocalizedAsset("/assets/anatomy.svg", language)}
          alt={getLocalized(
            {
              en: "Simplified diagram of pelvic anatomy and some example nearby areas.",
              sw: "Mchoro rahisi wa nyonga na baadhi ya maeneo ya karibu kama mifano.",
            },
            language,
          )}
          loading="lazy"
        />
        <figcaption>{copy.bodyDisclaimer}</figcaption>
      </figure>
      <div className="body-explorer-controls">
        <h3>{copy.areaLabel}</h3>
        <div className="education-area-list" role="group" aria-label={copy.areaLabel}>
          {areas.map((area) => (
            <button
              className={`education-area-button${selected.id === area.id ? " is-selected" : ""}`}
              key={area.id}
              type="button"
              aria-pressed={selected.id === area.id}
              onClick={() => setSelectedId(area.id)}
            >
              {getLocalized(area.label, language)}
            </button>
          ))}
        </div>
        <div className="education-area-detail" aria-live="polite">
          <h3>{copy.areaDetails}: {getLocalized(selected.label, language)}</h3>
          <p>{getLocalized(selected.explanation, language)}</p>
        </div>
      </div>
    </section>
  );
}
