import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import BodyExplorer from "../components/education/BodyExplorer";
import { AudioPlayer, VideoPlayer } from "../components/education/MediaPlayers";
import {
  CONTENT_TYPE_LABELS,
  educationContent,
  educationContentById,
  educationUiCopy,
  getContentCopy,
  getLocalizedAsset,
  getLocalized,
  JOURNEY_STAGES,
} from "../content/educationContent";
import "../styles/education.css";

const CATEGORIES = [
  { id: "start", en: "Start here", sw: "Anza hapa" },
  { id: "symptoms", en: "Symptoms", sw: "Dalili" },
  { id: "understanding", en: "Understanding endometriosis", sw: "Kuelewa endometriosis" },
  { id: "help", en: "Get help", sw: "Kupata msaada" },
  { id: "diagnosis", en: "Diagnosis", sw: "Utambuzi" },
  { id: "treatment", en: "Treatment", sw: "Matibabu" },
  { id: "living", en: "Living with endometriosis", sw: "Kuishi na endometriosis" },
];

const STARTER_IDS = ["period-pain", "endo-basics", "symptoms", "life-stages-daily-life"];

const text = (language, en, sw) => (language === "sw" ? sw : en);

function savedIds(data) {
  return Array.isArray(data.saved) ? data.saved : [];
}

function ContentCard({ item, language, copy, saved, onToggleSave, progress }) {
  const content = getContentCopy(item, language);
  const status = progress?.[item.id];

  return (
    <article className="education-card">
      <Link className="education-card-main" to={`/app/learn/content/${item.id}`}>
        <div className="education-card-art">
          <img src={getLocalizedAsset(item.thumbnail, language)} alt={item.altText[language]} loading="lazy" />
          <span className="education-type">{getLocalized(CONTENT_TYPE_LABELS[item.contentType], language)}</span>
        </div>
        <div className="education-card-copy">
          <span className="education-card-meta">
            {item.duration ? `${item.duration} ${copy.readTime}` : ""}
            {status?.completed ? ` · ${copy.completed}` : status ? ` · ${copy.contentStarted}` : ""}
          </span>
          <h3>{content.title}</h3>
          <span className="education-review-badge">{copy.draftReview}</span>
          <p>{content.description}</p>
        </div>
      </Link>
      <button
        className={`education-save${saved ? " is-saved" : ""}`}
        type="button"
        aria-pressed={saved}
        aria-label={`${saved ? copy.remove : copy.save}: ${content.title}`}
        onClick={() => onToggleSave(item.id)}
      >
        <span aria-hidden="true">{saved ? "★" : "☆"}</span>
        <span>{saved ? (language === "sw" ? "Imehifadhiwa" : "Saved") : copy.save}</span>
      </button>
    </article>
  );
}

function EducationHome({ data, setData, language, copy, onToggleSave }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");
  const saved = savedIds(data);
  const progress = data.learningProgress || {};
  const lastItem = educationContentById[data.lastLearningContent];
  const featured = STARTER_IDS.map((id) => educationContentById[id]).filter(Boolean);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return educationContent.filter((item) => {
      const content = getContentCopy(item, language);
      const matchesCategory = !category || item.category === category;
      const matchesStage = !stage || item.journeyStages.includes(stage);
      const isUnfilteredStarter = !query.trim() && !category && !stage && STARTER_IDS.includes(item.id);
      const sectionText = item.translations[language]?.sections
        ?.flatMap((section) => [section.heading, ...(section.paragraphs || []), ...(section.bullets || [])])
        .join(" ");
      const haystack = [
        content.title,
        content.description,
        content.summary,
        sectionText,
        item.tags.join(" "),
        item.category,
        item.journeyStages.join(" "),
      ].join(" ").toLocaleLowerCase();
      return !isUnfilteredStarter && matchesCategory && matchesStage && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, language, query, stage]);

  return (
    <div className="education-page">
      <header className="education-heading">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.heading}</h1>
          <p>{copy.intro}</p>
        </div>
        <LanguageSwitch data={data} setData={setData} language={language} copy={copy} />
      </header>

      {lastItem && (
        <section className="education-continue" aria-labelledby="continue-learning">
          <div>
            <span className="education-kicker">{copy.continue}</span>
            <h2 id="continue-learning">{getContentCopy(lastItem, language).title}</h2>
            <p>{getContentCopy(lastItem, language).description}</p>
          </div>
          <Link className="btn primary" to={`/app/learn/content/${lastItem.id}`}>{copy.continueReading} <span aria-hidden="true">→</span></Link>
        </section>
      )}

      {!query && !category && !stage && (
        <section className="education-section" aria-labelledby="start-here-heading">
          <div className="education-section-heading">
            <div>
              <span className="education-kicker">{copy.startHere}</span>
              <h2 id="start-here-heading">{getContentCopy(educationContentById["period-pain"], language).title}</h2>
            </div>
          </div>
          <div className="education-feature-grid">
            {featured.slice(0, 4).map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                language={language}
                copy={copy}
                saved={saved.includes(item.id)}
                onToggleSave={onToggleSave}
                progress={progress[item.id]}
              />
            ))}
          </div>
        </section>
      )}

      <section className="education-library" aria-labelledby="resource-library-heading">
        <div className="education-section-heading">
          <div>
            <span className="education-kicker">{copy.featured}</span>
            <h2 id="resource-library-heading">{query.trim() ? copy.searchResults : copy.explore}</h2>
          </div>
          <Link className="education-saved-link" to="/app/learn/saved">
            {copy.saved} <span className="education-saved-count">{saved.length}</span>
          </Link>
        </div>
        <label className="education-search">
          <span className="sr-only">{copy.searchLabel}</span>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            type="search"
          />
        </label>
        <div className="education-filters">
          <label>
            <span>{copy.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">{copy.allTopics}</option>
              {CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>{language === "sw" ? item.sw : item.en}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{language === "sw" ? "Hatua ya safari" : "Journey stage"}</span>
            <select value={stage} onChange={(event) => setStage(event.target.value)}>
              <option value="">{copy.allStages}</option>
              {JOURNEY_STAGES.map((item) => (
                <option key={item.id} value={item.id}>{getLocalized(item.label, language)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="education-content-grid">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              language={language}
              copy={copy}
              saved={saved.includes(item.id)}
              onToggleSave={onToggleSave}
              progress={progress[item.id]}
            />
          ))}
        </div>
        {filtered.length === 0 && <p className="education-empty" role="status">{copy.empty}</p>}
        <p className="education-offline-note">{copy.progressSaved}</p>
      </section>
      <SafetyNote copy={copy} />
    </div>
  );
}

function LanguageSwitch({ data, setData, language, copy }) {
  return (
    <fieldset className="education-language">
      <legend>{copy.language}</legend>
      <button
        type="button"
        aria-pressed={language === "en"}
        className={language === "en" ? "is-selected" : ""}
        onClick={() => setData({ ...data, language: "English" })}
      >
        {copy.english}
      </button>
      <button
        type="button"
        aria-pressed={language === "sw"}
        className={language === "sw" ? "is-selected" : ""}
        onClick={() => setData({ ...data, language: "Kiswahili" })}
      >
        {copy.swahili}
      </button>
    </fieldset>
  );
}

function SafetyNote({ copy }) {
  return (
    <aside className="education-safety" role="note">
      <strong>{copy.reviewNote}</strong>
      <p>{copy.clinicalReview}</p>
    </aside>
  );
}

function SavedResources({ data, setData, language, copy, onToggleSave }) {
  const saved = savedIds(data);
  const items = saved.map((id) => educationContentById[id]).filter(Boolean);

  return (
    <div className="education-page">
      <Link className="back" to="/app/learn">← {copy.back}</Link>
      <header className="education-heading education-heading-compact">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.saved}</h1>
        </div>
        <LanguageSwitch data={data} setData={setData} language={language} copy={copy} />
      </header>
      {items.length ? (
        <div className="education-content-grid">
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              language={language}
              copy={copy}
              saved
              onToggleSave={onToggleSave}
              progress={data.learningProgress?.[item.id]}
            />
          ))}
        </div>
      ) : (
        <div className="education-empty">
          <p>{copy.noSaved}</p>
          <Link className="btn primary" to="/app/learn">{copy.browse}</Link>
        </div>
      )}
      <SafetyNote copy={copy} />
    </div>
  );
}

function ContentDetail({ item, data, setData, language, copy, onToggleSave }) {
  const content = getContentCopy(item, language);
  const progress = data.learningProgress || {};
  const itemProgress = progress[item.id];
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const nextProgress = {
      ...progress,
      [item.id]: {
        ...progress[item.id],
        lastOpenedAt: new Date().toISOString(),
      },
    };
    setData((current) => ({
      ...current,
      learningProgress: nextProgress,
      lastLearningContent: item.id,
    }));
  }, [item.id]);

  const markComplete = () => {
    setData({
      ...data,
      learningProgress: {
        ...progress,
        [item.id]: { ...itemProgress, completed: true, completedAt: new Date().toISOString() },
      },
      lastLearningContent: item.id,
    });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: content.title, text: content.description, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareMessage(copy.linkCopied);
      } else {
        setShareMessage(copy.shareError);
      }
    } catch (error) {
      if (error.name !== "AbortError") setShareMessage(copy.shareError);
    }
  };

  return (
    <div className="education-page">
      <Link className="back" to="/app/learn">← {copy.back}</Link>
      <article className="education-detail">
        <header className="education-detail-heading">
          <span className="education-type">{getLocalized(CONTENT_TYPE_LABELS[item.contentType], language)}</span>
          <h1>{content.title}</h1>
          <p className="education-detail-summary">{content.summary}</p>
          <div className="education-detail-meta">
            <span>{item.duration ? `${item.duration} ${copy.readTime}` : ""}</span>
            <span>{item.isOfflineAvailable ? copy.offlineAvailable : copy.onlineOnly}</span>
            <span>{copy.contentLanguage}: {language === "sw" ? copy.swahili : copy.english}</span>
          </div>
          <p className="education-source-note">{copy.sourceLabel}: {item.source} · {copy.updatedLabel}: {item.lastUpdated}</p>
        </header>

        {item.contentType === "interactive" ? (
          <BodyExplorer language={language} copy={copy} />
        ) : item.contentType === "video" ? (
          <>
            <VideoPlayer item={item} language={language} copy={copy} />
            <h2 className="education-subheading">{copy.videoSummary}</h2>
          </>
        ) : item.thumbnail ? (
          <figure className="education-detail-figure">
            <img src={getLocalizedAsset(item.thumbnail, language)} alt={item.altText[language]} />
            <figcaption>{item.caption[language]}</figcaption>
          </figure>
        ) : null}

        {item.contentType === "audio" && (
          <AudioPlayer text={content.audioText} language={language} copy={copy} />
        )}

        {item.contentType === "story" && (
          <div className="education-story-label">{copy.fictional}</div>
        )}

        <div className="education-article">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets?.length > 0 && (
                <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              )}
            </section>
          ))}
        </div>

        {item.references.length > 0 && (
          <section className="education-references">
            <h2>{copy.sources}</h2>
            <ul>
              {item.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noreferrer">{reference.name} ↗</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="education-review">
          <strong>{copy.reviewLabel}: {copy.reviewNote}</strong>
          <p>{copy.clinicalReview}</p>
        </div>

        <div className="education-detail-actions">
          <button
            className="btn secondary"
            type="button"
            aria-pressed={savedIds(data).includes(item.id)}
            onClick={() => onToggleSave(item.id)}
          >
            {savedIds(data).includes(item.id) ? "★ " : "☆ "}{savedIds(data).includes(item.id) ? copy.remove : copy.save}
          </button>
          <button className="btn secondary" type="button" onClick={share}>{copy.share}</button>
          {!itemProgress?.completed && (
            <button className="btn primary" type="button" onClick={markComplete}>{copy.markComplete}</button>
          )}
          {itemProgress?.completed && <span className="education-completed" role="status">✓ {copy.completed}</span>}
        </div>
        {shareMessage && <p className="education-inline-status" role="status">{shareMessage}</p>}
        <p className="education-offline-note">{copy.progressSaved}</p>

        {item.relatedContent.length > 0 && (
          <section className="education-related">
            <h2>{copy.related}</h2>
            <div className="education-content-grid">
              {item.relatedContent.map((id) => educationContentById[id]).filter(Boolean).slice(0, 3).map((related) => (
                <ContentCard
                  key={related.id}
                  item={related}
                  language={language}
                  copy={copy}
                  saved={savedIds(data).includes(related.id)}
                  onToggleSave={onToggleSave}
                  progress={progress[related.id]}
                />
              ))}
            </div>
          </section>
        )}
      </article>
      <SafetyNote copy={copy} />
    </div>
  );
}

export default function EducationExperience({ data, setData }) {
  const location = useLocation();
  const language = data.language === "Kiswahili" ? "sw" : "en";
  const copy = educationUiCopy[language];
  const pathname = location.pathname.replace(/\/+$/, "");
  const suffix = pathname.replace(/^\/app\/learn\/?/, "");
  const legacyContent = {
    read: "endo-basics",
    see: "where-it-can-occur",
    watch: "nhs-video",
    listen: "endo-audio",
  };
  const isSavedPage = suffix === "saved";
  const isExplorerPage = suffix === "body-explorer";
  const contentId = suffix.startsWith("content/")
    ? suffix.slice("content/".length)
    : legacyContent[suffix];
  const item = educationContentById[contentId];

  const toggleSave = (id) => {
    const current = savedIds(data);
    const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
    setData({ ...data, saved: next });
  };

  if (isSavedPage) {
    return <SavedResources data={data} setData={setData} language={language} copy={copy} onToggleSave={toggleSave} />;
  }

  if (isExplorerPage) {
    return <Navigate to="/app/learn/content/where-it-can-occur" replace />;
  }

  if (contentId) {
    if (!item) {
      return (
        <div className="education-page education-empty">
          <p>{copy.empty}</p>
          <Link className="btn primary" to="/app/learn">{copy.back}</Link>
        </div>
      );
    }
    return (
      <ContentDetail
        key={`${item.id}-${language}`}
        item={item}
        data={data}
        setData={setData}
        language={language}
        copy={copy}
        onToggleSave={toggleSave}
      />
    );
  }

  return (
    <EducationHome
      data={data}
      setData={setData}
      language={language}
      copy={copy}
      onToggleSave={toggleSave}
    />
  );
}
