export const JOURNEY_STAGES = [
  { id: "noticing", label: { en: "Something doesn't feel normal", sw: "Kuna jambo haliko sawa" } },
  { id: "wondering", label: { en: "Could this be endometriosis?", sw: "Je, inaweza kuwa endometriosis?" } },
  { id: "understanding", label: { en: "Understand endometriosis", sw: "Kuelewa endometriosis" } },
  { id: "experience", label: { en: "Understand my experience", sw: "Kuelewa ninachopitia" } },
  { id: "help", label: { en: "Get help", sw: "Kupata msaada" } },
  { id: "diagnosis", label: { en: "Diagnosis", sw: "Utambuzi" } },
  { id: "treatment", label: { en: "Treatment", sw: "Matibabu" } },
  { id: "living", label: { en: "Living with endometriosis", sw: "Kuishi na endometriosis" } },
];

export const CONTENT_TYPE_LABELS = {
  article: { en: "Article", sw: "Makala" },
  illustration: { en: "Illustration", sw: "Mchoro" },
  infographic: { en: "Infographic", sw: "Infografia" },
  video: { en: "Video", sw: "Video" },
  audio: { en: "Audio lesson", sw: "Somo la sauti" },
  interactive: { en: "Interactive guide", sw: "Mwongozo shirikishi" },
  story: { en: "Fictional learning story", sw: "Hadithi ya kujifunzia ya kubuni" },
  resource: { en: "Resource", sw: "Nyenzo" },
  faq: { en: "Quick answers", sw: "Majibu mafupi" },
  "quick-explainer": { en: "Quick explainer", sw: "Maelezo mafupi" },
};

const references = [
  {
    name: "NHS: Endometriosis",
    url: "https://www.nhs.uk/conditions/endometriosis/",
  },
  {
    name: "ESHRE: Endometriosis guideline",
    url: "https://www.eshre.eu/Guideline/Endometriosis",
  },
];

export const educationContent = [
  {
    id: "endo-basics",
    slug: "what-is-endometriosis",
    contentType: "article",
    category: "start",
    journeyStages: ["wondering", "understanding"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: {
      en: "Simple educational illustration of pelvic anatomy, marked as not to scale.",
      sw: "Mchoro rahisi wa elimu kuhusu sehemu za nyonga; hauonyeshi vipimo halisi.",
    },
    caption: {
      en: "A simplified illustration for learning, not a diagnostic image.",
      sw: "Mchoro rahisi wa kujifunzia, si picha ya utambuzi.",
    },
    duration: 3,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["period-pain", "symptoms", "where-it-can-occur", "diagnosis-basics"],
    tags: ["endometriosis", "basics", "pelvis"],
    translations: {
      en: {
        title: "What is endometriosis?",
        description: "A calm, plain-language introduction to a condition that can affect people in different ways.",
        summary: "Endometriosis is a condition in which tissue similar to the lining of the womb is found elsewhere in the body. Experiences vary.",
        sections: [
          {
            heading: "What happens?",
            paragraphs: [
              "Endometriosis is a condition where tissue similar to the lining of the womb is found in other parts of the body. It is most often described in the pelvis, and it can affect people differently.",
              "The condition is not the same as ordinary menstrual cramps. Pain and other symptoms can have many causes, so learning about endometriosis cannot tell you what is causing your own experience.",
            ],
          },
          {
            heading: "What might someone notice?",
            bullets: [
              "Painful periods that interfere with everyday activities",
              "Pelvic pain that may happen at different times in the cycle",
              "Pain during or after sex",
              "Bowel or bladder symptoms, or fatigue",
            ],
          },
          {
            heading: "What can I do with this information?",
            paragraphs: [
              "If symptoms keep affecting your life, you can write down what happens and talk with a qualified healthcare professional. They can discuss possible causes and next steps with you.",
            ],
          },
        ],
      },
      sw: {
        title: "Endometriosis ni nini?",
        description: "Utangulizi rahisi kuhusu hali inayoweza kuwa tofauti kwa kila mtu.",
        summary: "Endometriosis ni hali ambapo tishu zinazofanana na utando wa ndani wa mji wa mimba hupatikana sehemu nyingine za mwili. Watu hupitia hali hii kwa njia tofauti.",
        sections: [
          {
            heading: "Nini hutokea?",
            paragraphs: [
              "Endometriosis ni hali ambapo tishu zinazofanana na utando wa ndani wa mji wa mimba hupatikana sehemu nyingine za mwili. Mara nyingi huzungumziwa katika eneo la nyonga, na huathiri watu kwa njia tofauti.",
              "Hali hii si sawa na maumivu ya kawaida ya hedhi. Maumivu na dalili nyingine zinaweza kusababishwa na mambo mengi, kwa hiyo kujifunza kuhusu endometriosis hakuwezi kukuambia chanzo cha unachopitia.",
            ],
          },
          {
            heading: "Mtu anaweza kugundua nini?",
            bullets: [
              "Maumivu ya hedhi yanayoathiri shughuli za kila siku",
              "Maumivu ya nyonga yanayoweza kutokea nyakati tofauti za mzunguko",
              "Maumivu wakati au baada ya kujamiiana",
              "Dalili za utumbo au kibofu, au uchovu",
            ],
          },
          {
            heading: "Ninaweza kufanya nini na taarifa hii?",
            paragraphs: [
              "Ikiwa dalili zinaendelea kuathiri maisha yako, unaweza kuandika kinachotokea na kuzungumza na mtaalamu wa afya aliyehitimu. Mnaweza kujadili sababu zinazowezekana na hatua zinazofuata.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "period-pain",
    slug: "could-period-pain-be-more-than-cramps",
    contentType: "quick-explainer",
    category: "start",
    journeyStages: ["noticing", "wondering"],
    language: ["en", "sw"],
    thumbnail: "/assets/pain-map.svg",
    altText: {
      en: "An illustration showing a person describing pelvic pain.",
      sw: "Mchoro unaoonyesha mtu akieleza maumivu ya nyonga.",
    },
    caption: { en: "Pain that disrupts daily life deserves attention.", sw: "Maumivu yanayovuruga maisha ya kila siku yanastahili kuangaliwa." },
    duration: 2,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["endo-basics", "symptoms", "appointment-preparation"],
    tags: ["period pain", "cramps", "when to seek help"],
    translations: {
      en: {
        title: "Could period pain be more than cramps?",
        description: "A quick guide to noticing when pain is interfering with everyday life.",
        summary: "Period discomfort is common, but pain that repeatedly stops you from doing usual activities is worth discussing with a healthcare professional.",
        sections: [
          {
            heading: "Notice the effect, not just the number",
            paragraphs: [
              "Think about whether pain makes you miss school or work, stay in bed, lose sleep, or stop activities you normally do. Notice whether it is getting worse or also happens outside your period.",
              "There is no single symptom that proves endometriosis. Several other conditions can cause similar experiences.",
            ],
          },
          {
            heading: "A possible next step",
            paragraphs: [
              "If the pain keeps affecting your day-to-day life, consider talking with a qualified healthcare professional. A short record of when pain happens and how it affects you may help explain your concerns.",
            ],
          },
        ],
      },
      sw: {
        title: "Je, maumivu ya hedhi yanaweza kuwa zaidi ya tumbo kuuma?",
        description: "Mwongozo mfupi wa kutambua maumivu yanapoathiri maisha ya kila siku.",
        summary: "Usumbufu wa hedhi ni wa kawaida, lakini maumivu yanayokuzuia mara kwa mara kufanya shughuli zako yanafaa kujadiliwa na mtaalamu wa afya.",
        sections: [
          {
            heading: "Angalia athari, si kiwango pekee",
            paragraphs: [
              "Fikiria kama maumivu yanakufanya ukose shule au kazi, ulale kitandani, ukose usingizi, au uache shughuli zako za kawaida. Angalia pia kama yanaongezeka au hutokea nje ya siku za hedhi.",
              "Hakuna dalili moja inayothibitisha endometriosis. Hali nyingine kadhaa zinaweza kusababisha mambo yanayofanana.",
            ],
          },
          {
            heading: "Hatua inayoweza kufuata",
            paragraphs: [
              "Ikiwa maumivu yanaendelea kuathiri shughuli zako za kila siku, fikiria kuzungumza na mtaalamu wa afya aliyehitimu. Rekodi fupi ya muda wa maumivu na jinsi yanavyokuathiri inaweza kusaidia kueleza wasiwasi wako.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "symptoms",
    slug: "symptoms-that-can-occur",
    contentType: "article",
    category: "symptoms",
    journeyStages: ["wondering", "understanding", "experience"],
    language: ["en", "sw"],
    thumbnail: "/assets/pain-map.svg",
    altText: {
      en: "A simplified body outline highlighting the pelvic area as one way to describe pain.",
      sw: "Mchoro rahisi wa mwili unaoonyesha eneo la nyonga kama mojawapo ya sehemu za kueleza maumivu.",
    },
    caption: {
      en: "Symptoms vary; this illustration does not show where a person has endometriosis.",
      sw: "Dalili hutofautiana; mchoro huu hauonyeshi mtu ana endometriosis wapi.",
    },
    duration: 3,
    isFeatured: false,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["period-pain", "where-it-can-occur", "diagnosis-basics"],
    tags: ["pain", "fatigue", "bowel", "bladder"],
    translations: {
      en: {
        title: "Symptoms that can occur with endometriosis",
        description: "Learn about experiences people may report, without using a symptom list to self-diagnose.",
        summary: "People report different symptoms. Similar symptoms can also be caused by other health conditions.",
        sections: [
          {
            heading: "Experiences people may report",
            bullets: [
              "Painful periods or pelvic pain",
              "Pain during or after sex",
              "Pain with bowel movements or urination",
              "Heavy bleeding, fatigue, or digestive symptoms",
            ],
          },
          {
            heading: "Every person's experience is different",
            paragraphs: [
              "Some people have several symptoms and others have few. Symptoms may change over time. The pattern can be useful to describe, but it cannot confirm a diagnosis on its own.",
              "A healthcare professional can help consider endometriosis and other possible causes. You deserve to have symptoms that affect your life taken seriously.",
            ],
          },
        ],
      },
      sw: {
        title: "Dalili zinazoweza kutokea kwa endometriosis",
        description: "Jifunze kuhusu mambo ambayo watu wanaweza kupitia, bila kutumia orodha ya dalili kujitambua.",
        summary: "Watu huripoti dalili tofauti. Dalili zinazofanana zinaweza pia kusababishwa na hali nyingine za kiafya.",
        sections: [
          {
            heading: "Mambo ambayo watu wanaweza kupitia",
            bullets: [
              "Maumivu ya hedhi au maumivu ya nyonga",
              "Maumivu wakati au baada ya kujamiiana",
              "Maumivu wakati wa haja kubwa au kukojoa",
              "Kutokwa na damu nyingi, uchovu, au dalili za mmeng'enyo wa chakula",
            ],
          },
          {
            heading: "Kila mtu hupitia hali kwa njia tofauti",
            paragraphs: [
              "Wengine huwa na dalili nyingi na wengine chache. Dalili zinaweza kubadilika kadri muda unavyopita. Mabadiliko ya dalili yanaweza kusaidia kueleza hali yako, lakini hayawezi kuthibitisha utambuzi peke yake.",
              "Mtaalamu wa afya anaweza kusaidia kuchunguza endometriosis na sababu nyingine zinazowezekana. Dalili zinazoathiri maisha yako zinastahili kuchukuliwa kwa uzito.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "where-it-can-occur",
    slug: "where-endometriosis-can-occur",
    contentType: "interactive",
    category: "understanding",
    journeyStages: ["understanding", "experience"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: {
      en: "A simplified pelvic anatomy illustration with example areas labelled.",
      sw: "Mchoro rahisi wa sehemu za nyonga wenye majina ya maeneo kama mifano.",
    },
    caption: {
      en: "Select a label to learn about areas that may be involved. This is not a map of your body.",
      sw: "Chagua jina ili kujifunza kuhusu maeneo yanayoweza kuhusika. Huu si ramani ya mwili wako.",
    },
    duration: 4,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia simplified educational illustration",
    references,
    relatedContent: ["endo-basics", "symptoms", "diagnosis-basics"],
    tags: ["pelvis", "bowel", "bladder", "ovaries", "uterus"],
    translations: {
      en: {
        title: "Where can endometriosis occur?",
        description: "Explore a simplified, educational guide to areas that can be involved.",
        summary: "Endometriosis can affect areas in and around the pelvis. The illustration is not to scale and cannot identify disease in an individual.",
        sections: [
          {
            heading: "An educational body explorer",
            paragraphs: [
              "Choose an area below to read a short explanation. The labels describe places endometriosis may involve; they do not show where it is in your body.",
              "This simplified illustration is not to scale. It leaves out many structures and should not be used to diagnose or locate disease.",
            ],
          },
        ],
      },
      sw: {
        title: "Endometriosis inaweza kutokea wapi?",
        description: "Chunguza mwongozo rahisi wa elimu kuhusu maeneo yanayoweza kuhusika.",
        summary: "Endometriosis inaweza kuathiri maeneo ndani na karibu na nyonga. Mchoro huu hauonyeshi vipimo halisi wala kutambua ugonjwa kwa mtu binafsi.",
        sections: [
          {
            heading: "Mwongozo shirikishi wa sehemu za mwili",
            paragraphs: [
              "Chagua eneo hapa chini ili kusoma maelezo mafupi. Majina yanaeleza sehemu ambazo zinaweza kuhusika; hayaonyeshi ilipo katika mwili wako.",
              "Mchoro huu ni rahisi na hauonyeshi vipimo halisi. Hauonyeshi sehemu zote na haupaswi kutumiwa kutambua au kubaini mahali pa ugonjwa.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "diagnosis-basics",
    slug: "understanding-diagnosis",
    contentType: "article",
    category: "diagnosis",
    journeyStages: ["help", "diagnosis"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: { en: "Illustration used alongside an introduction to diagnosis.", sw: "Mchoro unaotumika pamoja na utangulizi wa utambuzi." },
    caption: { en: "Diagnosis is a conversation and assessment with a qualified professional.", sw: "Utambuzi huhusisha mazungumzo na tathmini ya mtaalamu aliyehitimu." },
    duration: 4,
    isFeatured: false,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["appointment-preparation", "symptoms", "treatment-options"],
    tags: ["diagnosis", "ultrasound", "appointment", "laparoscopy"],
    translations: {
      en: {
        title: "Understanding the diagnosis journey",
        description: "What a healthcare professional may discuss when exploring ongoing pelvic symptoms.",
        summary: "Assessment can include a conversation about symptoms and medical history. The next steps depend on the individual.",
        sections: [
          {
            heading: "What might be discussed?",
            bullets: [
              "When symptoms began and how they affect daily activities",
              "Your period history, pain, and other experiences",
              "Whether an examination or imaging is appropriate",
              "Possible next steps and when to follow up",
            ],
          },
          {
            heading: "Tests have limits",
            paragraphs: [
              "A healthcare professional can explain what a test can and cannot show. One result may not answer every question, so ask what it means for your situation and what to do next.",
              "Diagnosis pathways vary. Ask a qualified professional to explain the options, benefits, limits, and risks that apply to you.",
            ],
          },
        ],
      },
      sw: {
        title: "Kuelewa safari ya utambuzi",
        description: "Mambo ambayo mtaalamu wa afya anaweza kujadili anapochunguza dalili za nyonga zinazoendelea.",
        summary: "Tathmini inaweza kuhusisha mazungumzo kuhusu dalili na historia ya afya. Hatua zinazofuata hutegemea mtu binafsi.",
        sections: [
          {
            heading: "Ni mambo gani yanaweza kujadiliwa?",
            bullets: [
              "Dalili zilianza lini na zinavyoathiri shughuli za kila siku",
              "Historia ya hedhi, maumivu na mambo mengine unayopitia",
              "Kama uchunguzi wa mwili au picha za ndani unafaa",
              "Hatua zinazoweza kufuata na muda wa kurudi kwa ufuatiliaji",
            ],
          },
          {
            heading: "Vipimo vina mipaka",
            paragraphs: [
              "Mtaalamu wa afya anaweza kueleza kipimo kinaweza na hakiwezi kuonyesha nini. Jibu moja huenda lisijibu maswali yote, kwa hiyo uliza linamaanisha nini kwako na ufanye nini baadaye.",
              "Njia za utambuzi hutofautiana. Muombe mtaalamu aliyehitimu akueleze chaguo, faida, mipaka na hatari zinazokuhusu.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "appointment-preparation",
    slug: "questions-for-an-appointment",
    contentType: "resource",
    category: "help",
    journeyStages: ["help", "diagnosis"],
    language: ["en", "sw"],
    thumbnail: "/assets/pain-map.svg",
    altText: { en: "Illustration accompanying a list of appointment questions.", sw: "Mchoro unaoambatana na orodha ya maswali ya miadi." },
    caption: { en: "Choose only the questions that feel useful to you.", sw: "Chagua maswali yanayokufaa tu." },
    duration: 3,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia appointment-preparation resource",
    references,
    relatedContent: ["period-pain", "diagnosis-basics", "treatment-options"],
    tags: ["appointment", "questions", "help", "doctor"],
    translations: {
      en: {
        title: "Questions to take to an appointment",
        description: "A flexible list to help you explain your experience and understand possible next steps.",
        summary: "You can choose a few questions, bring notes, and ask for an explanation in words that make sense to you.",
        sections: [
          {
            heading: "Questions you might ask",
            bullets: [
              "What could be causing these symptoms?",
              "Are there other conditions that could explain them?",
              "Would any examination or test be useful for me?",
              "What should I do if symptoms continue or change?",
              "When should I come back, and who can I contact with questions?",
            ],
          },
          {
            heading: "Your notes are yours",
            paragraphs: [
              "You do not need to answer every question or share anything you are uncomfortable sharing. A symptom record can help you remember dates and daily-life impact.",
              "If something is unclear, it is reasonable to ask for clarification. This guide supports a conversation; it does not replace care.",
            ],
          },
        ],
      },
      sw: {
        title: "Maswali ya kwenda nayo kwenye miadi",
        description: "Orodha inayoweza kubadilishwa ili ikusaidie kueleza unachopitia na kuelewa hatua zinazoweza kufuata.",
        summary: "Unaweza kuchagua maswali machache, kuleta kumbukumbu zako na kuomba maelezo kwa lugha unayoelewa.",
        sections: [
          {
            heading: "Maswali unayoweza kuuliza",
            bullets: [
              "Ni nini kinachoweza kusababisha dalili hizi?",
              "Je, kuna hali nyingine zinazoweza kueleza dalili hizi?",
              "Je, uchunguzi au kipimo chochote kinaweza kunifaa?",
              "Nifanye nini ikiwa dalili zitaendelea au kubadilika?",
              "Nirudi lini, na ninaweza kuwasiliana na nani nikiwa na maswali?",
            ],
          },
          {
            heading: "Kumbukumbu zako ni zako",
            paragraphs: [
              "Huhitaji kujibu kila swali au kushiriki jambo lolote usilojisikia vizuri kushiriki. Rekodi ya dalili inaweza kukusaidia kukumbuka tarehe na athari kwa maisha ya kila siku.",
              "Ikiwa jambo halieleweki, ni sawa kuomba ufafanuzi. Mwongozo huu husaidia mazungumzo; hauchukui nafasi ya huduma ya afya.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "treatment-options",
    slug: "understanding-treatment-options",
    contentType: "infographic",
    category: "treatment",
    journeyStages: ["treatment", "living"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: { en: "Text-based overview of topics that may come up in treatment discussions.", sw: "Muhtasari wa maandishi wa mada zinazoweza kujadiliwa kuhusu matibabu." },
    caption: { en: "Options depend on the person and should be discussed with a qualified professional.", sw: "Chaguo hutegemea mtu na zinapaswa kujadiliwa na mtaalamu aliyehitimu." },
    duration: 3,
    isFeatured: false,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["diagnosis-basics", "appointment-preparation", "living-well"],
    tags: ["treatment", "pain management", "hormones", "surgery"],
    translations: {
      en: {
        title: "Understanding treatment discussions",
        description: "A text-first overview of topics that may be discussed with a healthcare professional.",
        summary: "Care is individual. Options may include pain support, hormonal medicines, surgery, or other approaches.",
        sections: [
          {
            heading: "Topics that may come up",
            bullets: [
              "Ways to manage pain and support daily activities",
              "Hormonal medicines and their possible effects",
              "Surgery, when it may be considered, and its limits",
              "Follow-up and support for emotional wellbeing or other needs",
            ],
          },
          {
            heading: "Make it a shared conversation",
            paragraphs: [
              "Different options have different possible benefits, risks, and effects. What is appropriate can depend on symptoms, preferences, other health needs, and personal goals.",
              "This overview is not treatment advice. Ask a qualified healthcare professional to explain options for your situation. Do not start or stop a medicine based on this page.",
            ],
          },
        ],
      },
      sw: {
        title: "Kuelewa mazungumzo kuhusu matibabu",
        description: "Muhtasari wa maandishi kuhusu mada zinazoweza kujadiliwa na mtaalamu wa afya.",
        summary: "Huduma hutofautiana kwa kila mtu. Chaguo zinaweza kujumuisha msaada wa maumivu, dawa za homoni, upasuaji au njia nyingine.",
        sections: [
          {
            heading: "Mada zinazoweza kujadiliwa",
            bullets: [
              "Njia za kudhibiti maumivu na kusaidia shughuli za kila siku",
              "Dawa za homoni na athari zinazoweza kutokea",
              "Upasuaji, wakati unaoweza kufikiriwa na mipaka yake",
              "Ufuatiliaji na msaada kwa hali ya kihisia au mahitaji mengine",
            ],
          },
          {
            heading: "Fanyeni mazungumzo pamoja",
            paragraphs: [
              "Chaguo tofauti huwa na faida, hatari na athari zinazoweza kutofautiana. Kinachofaa kinaweza kutegemea dalili, mapendeleo, mahitaji mengine ya afya na malengo yako.",
              "Muhtasari huu si ushauri wa matibabu. Muombe mtaalamu wa afya aliyehitimu akueleze chaguo zinazokufaa. Usianze au kuacha dawa kutokana na ukurasa huu.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "living-well",
    slug: "a-learning-story-about-seeking-help",
    contentType: "story",
    category: "living",
    journeyStages: ["noticing", "help", "living"],
    language: ["en", "sw"],
    thumbnail: "/assets/jalia-hero.svg",
    altText: { en: "Illustration accompanying a clearly labelled fictional learning story.", sw: "Mchoro unaoambatana na hadithi ya kujifunzia iliyowekwa wazi kuwa ya kubuni." },
    caption: { en: "A fictional composite for learning; not a real person's account.", sw: "Hadithi ya kubuni iliyounganishwa kwa ajili ya kujifunza; si simulizi la mtu halisi." },
    duration: 2,
    isFeatured: false,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Fictional composite created for education",
    references: [],
    relatedContent: ["period-pain", "appointment-preparation", "diagnosis-basics"],
    tags: ["story", "school", "work", "seeking help"],
    translations: {
      en: {
        title: "A journey to asking for help",
        description: "A fictional learning story about noticing patterns and preparing for a conversation.",
        summary: "This fictional composite shows one way someone might keep notes and ask for support. It is not medical evidence.",
        sections: [
          {
            heading: "A fictional learning story",
            paragraphs: [
              "Nia is a fictional character. After repeatedly missing lessons because of pain, she starts noting when it happens and how it affects her day. She chooses a trusted person to talk with and brings her notes to a healthcare appointment.",
              "Her next steps are discussed with a qualified professional. Nia's story is invented for learning and does not represent every person's experience or suggest a diagnosis.",
            ],
          },
        ],
      },
      sw: {
        title: "Safari ya kuomba msaada",
        description: "Hadithi ya kujifunzia ya kubuni kuhusu kutambua mabadiliko na kujiandaa kwa mazungumzo.",
        summary: "Hadithi hii ya kubuni inaonyesha njia moja ambayo mtu anaweza kutumia kuweka kumbukumbu na kuomba msaada. Si ushahidi wa kitabibu.",
        sections: [
          {
            heading: "Hadithi ya kujifunzia ya kubuni",
            paragraphs: [
              "Nia ni mhusika wa kubuni. Baada ya kukosa masomo mara kwa mara kwa sababu ya maumivu, anaanza kuandika yanapotokea na jinsi yanavyoathiri siku yake. Anachagua mtu anayemwamini wa kuzungumza naye na anapeleka kumbukumbu zake kwenye miadi ya afya.",
              "Hatua zake zinazofuata huzungumziwa na mtaalamu aliyehitimu. Hadithi ya Nia imebuniwa kwa ajili ya kujifunza; haiwakilishi kila mtu wala kupendekeza utambuzi.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "endo-audio",
    slug: "listen-understanding-endometriosis",
    contentType: "audio",
    category: "understanding",
    journeyStages: ["understanding", "experience"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: { en: "Audio lesson with a written transcript.", sw: "Somo la sauti lenye maandishi ya kusomeka." },
    caption: { en: "Optional spoken version. No audio plays until you choose to start.", sw: "Toleo la kusikiliza ni hiari. Sauti haitaanza hadi uchague kuisikiliza." },
    duration: 2,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia audio lesson generated with device speech",
    references,
    relatedContent: ["endo-basics", "symptoms", "where-it-can-occur"],
    tags: ["listen", "audio", "basics"],
    translations: {
      en: {
        title: "Listen: understanding endometriosis",
        description: "A short optional spoken lesson with a full written version.",
        summary: "Endometriosis can affect people differently. Symptoms can have more than one possible cause.",
        audioText: "Endometriosis is a condition where tissue similar to the lining of the womb is found in other parts of the body. People can have different experiences. Symptoms may include painful periods, pelvic pain, or bowel and bladder symptoms, but they can also have other causes. A healthcare professional can help you discuss what may be happening. This lesson is educational and does not diagnose.",
        sections: [
          {
            heading: "Written version",
            paragraphs: [
              "Endometriosis is a condition where tissue similar to the lining of the womb is found in other parts of the body. People can have different experiences.",
              "Symptoms may include painful periods, pelvic pain, or bowel and bladder symptoms, but they can also have other causes. A healthcare professional can help you discuss what may be happening. This lesson is educational and does not diagnose.",
            ],
          },
        ],
      },
      sw: {
        title: "Sikiliza: kuelewa endometriosis",
        description: "Somo fupi la kusikiliza kwa hiari, pamoja na maandishi kamili.",
        summary: "Endometriosis inaweza kuathiri watu kwa njia tofauti. Dalili zinaweza kuwa na sababu zaidi ya moja.",
        audioText: "Endometriosis ni hali ambapo tishu zinazofanana na utando wa ndani wa mji wa mimba hupatikana sehemu nyingine za mwili. Watu wanaweza kupitia hali tofauti. Dalili zinaweza kujumuisha maumivu ya hedhi, maumivu ya nyonga, au dalili za utumbo na kibofu, lakini pia zinaweza kuwa na sababu nyingine. Mtaalamu wa afya anaweza kukusaidia kujadili kinachoweza kuwa kinaendelea. Somo hili ni la elimu na halitoi utambuzi.",
        sections: [
          {
            heading: "Maandishi ya kusoma",
            paragraphs: [
              "Endometriosis ni hali ambapo tishu zinazofanana na utando wa ndani wa mji wa mimba hupatikana sehemu nyingine za mwili. Watu wanaweza kupitia hali tofauti.",
              "Dalili zinaweza kujumuisha maumivu ya hedhi, maumivu ya nyonga, au dalili za utumbo na kibofu, lakini pia zinaweza kuwa na sababu nyingine. Mtaalamu wa afya anaweza kukusaidia kujadili kinachoweza kuwa kinaendelea. Somo hili ni la elimu na halitoi utambuzi.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "nhs-video",
    slug: "watch-endometriosis-explainer",
    contentType: "video",
    category: "understanding",
    journeyStages: ["wondering", "understanding"],
    language: ["en", "sw"],
    thumbnail: "/assets/anatomy.svg",
    altText: { en: "Video card for an NHS endometriosis explainer.", sw: "Kadi ya video ya NHS inayoeleza endometriosis." },
    caption: { en: "External NHS video; opens only when requested. Kiswahili notes are provided separately.", sw: "Video ya NHS kutoka tovuti ya nje; hufunguliwa ukiomba. Maelezo ya Kiswahili yametolewa kando." },
    duration: null,
    isFeatured: false,
    isOfflineAvailable: false,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "NHS video hosted on YouTube",
    mediaUrl: null,
    video: {
      provider: "youtube",
      id: "ABi1ncHorBY",
      language: "en",
      captionTracks: [],
      transcript: null,
    },
    references,
    relatedContent: ["endo-basics", "symptoms", "diagnosis-basics"],
    tags: ["video", "NHS", "symptoms", "diagnosis"],
    translations: {
      en: {
        title: "Watch: an introduction to endometriosis",
        description: "An NHS video about endometriosis, symptoms, diagnosis, and treatment.",
        summary: "This external video is in English. A short Jalia learning summary is available below; it is not a verbatim transcript.",
        sections: [
          {
            heading: "Jalia learning summary",
            paragraphs: [
              "Endometriosis is a long-term condition that can involve tissue similar to the lining of the womb in other parts of the body. Symptoms differ, and similar symptoms can have other causes.",
              "The video is hosted by YouTube. Loading it connects to that service. If it is unavailable or you prefer not to load it, use the written summary or the linked NHS information.",
            ],
          },
        ],
      },
      sw: {
        title: "Tazama: utangulizi wa endometriosis",
        description: "Video ya NHS kuhusu endometriosis, dalili, utambuzi na matibabu.",
        summary: "Video hii ya nje iko kwa Kiingereza. Muhtasari mfupi wa Jalia upo hapa chini; si nakala ya maneno halisi ya video.",
        sections: [
          {
            heading: "Muhtasari wa kujifunzia wa Jalia",
            paragraphs: [
              "Endometriosis ni hali ya muda mrefu inayoweza kuhusisha tishu zinazofanana na utando wa ndani wa mji wa mimba katika sehemu nyingine za mwili. Dalili hutofautiana, na dalili zinazofanana zinaweza kuwa na sababu nyingine.",
              "Video hii inawekwa na YouTube. Ukiifungua, utaunganishwa na huduma hiyo. Ikiwa haipatikani au hutaki kuifungua, tumia muhtasari wa maandishi au taarifa ya NHS iliyounganishwa.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "life-stages-daily-life",
    slug: "living-with-endometriosis-across-life-stages",
    contentType: "article",
    category: "living",
    journeyStages: ["noticing", "wondering", "experience", "help", "diagnosis", "treatment", "living"],
    language: ["en", "sw"],
    thumbnail: "/assets/life-stage-family.jpg",
    altText: {
      en: "Illustrative stock photograph of a woman; not a patient story or medical image.",
      sw: "Picha ya mfano ya mwanamke; si simulizi la mgonjwa wala picha ya kitabibu.",
    },
    caption: {
      en: "Illustrative stock photography. People and experiences vary.",
      sw: "Picha ya mfano. Watu na wanachopitia hutofautiana.",
    },
    duration: 8,
    isFeatured: true,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational summary",
    references,
    relatedContent: ["symptoms", "appointment-preparation", "guided-pelvic-breathing"],
    tags: ["life stages", "school", "work", "self-care", "advocacy", "daily life"],
    translations: {
      en: {
        title: "Living with endometriosis across life stages and daily life",
        description: "A practical guide to school, work, family planning, changing needs, and self-advocacy.",
        summary: "Endometriosis can affect people differently and needs can change over time. This guide offers ideas for conversations and everyday planning, not individual medical advice.",
        sections: [
          {
            heading: "Medical disclaimer",
            paragraphs: [
              "This guide provides educational information and daily support ideas. It does not replace medical advice, diagnosis, or treatment from a qualified healthcare professional. Seek individual advice for symptoms, medicines, fertility questions, or treatment decisions.",
            ],
          },
          {
            heading: "Endometriosis across the life course",
            paragraphs: [
              "Endometriosis is a chronic condition in which tissue similar to the lining of the womb is found outside the womb. Experiences and support needs may shift as hormones, responsibilities, and daily routines change. There is no single path, and symptoms alone cannot confirm a diagnosis.",
            ],
          },
          {
            heading: "Teenage years (12–19) and school",
            paragraphs: [
              "Severe period pain, nausea, missed classes, and exams can be difficult to manage. Pain that repeatedly disrupts school or daily life deserves to be taken seriously; it is not something a young person should have to dismiss as ordinary cramps.",
            ],
            bullets: [
              "Keep a simple symptom record: dates, pain, other symptoms, and effect on school or sleep.",
              "If safe, talk with a trusted adult, school nurse, or qualified healthcare professional.",
              "Ask the school about practical supports such as bathroom access, water, a short break, or a plan for missed work.",
            ],
          },
          {
            heading: "Young adulthood (20–35), study, work, and relationships",
            paragraphs: [
              "Higher education, paid work, relationships, and seeking a diagnosis may all compete for time and energy. A concise record of symptoms and their impact can help someone explain their concerns at an appointment.",
            ],
            bullets: [
              "Consider asking a clinician what assessment or referral options may be appropriate.",
              "Where available, discuss flexible hours, short breaks, remote work, or ergonomic adjustments with a school or employer.",
              "Share only the functional information you choose; workplace and school policies vary.",
            ],
          },
          {
            heading: "Family planning and reproductive years",
            paragraphs: [
              "People may have questions about fertility, treatment choices, pain flares, or caring for children. Endometriosis does not mean that every person will have fertility problems, and individual outcomes cannot be predicted from this guide.",
            ],
            bullets: [
              "Ask a qualified clinician to discuss personal fertility questions and available options.",
              "If caring responsibilities make symptoms harder to manage, consider asking trusted people for practical support during difficult days.",
              "Discuss the possible benefits, risks, and alternatives of medical or surgical treatments with a specialist.",
            ],
          },
          {
            heading: "Perimenopause and later years",
            paragraphs: [
              "Hormonal changes may affect symptoms, but they do not affect everyone in the same way. Persistent or new pelvic pain still deserves medical assessment. Past surgery, scarring, bowel or bladder symptoms, pelvic-floor needs, and other health conditions may be relevant to a clinician.",
            ],
            bullets: [
              "Describe new, changing, or persistent symptoms to a qualified healthcare professional.",
              "Ask whether pelvic-floor therapy or other support is suitable for your situation.",
              "Do not start, stop, or change medicines based on this educational guide.",
            ],
          },
          {
            heading: "Planning for school, work, and home",
            paragraphs: [
              "Small practical adjustments may make a difficult day more manageable, but they are not a treatment or a guarantee of symptom relief. Choose options that are safe and realistic for you.",
            ],
            bullets: [
              "For study or exams, ask in advance about breaks, bathroom access, water, or a plan for catching up.",
              "For work, you could ask about flexible scheduling, brief rest breaks, a comfortable chair, or remote work when possible.",
              "Pace demanding tasks, plan rest where you can, and keep a trusted person informed if that feels helpful.",
            ],
          },
          {
            heading: "Everyday comfort ideas",
            paragraphs: [
              "Some people find warmth, a warm bath, gentle movement, relaxation breathing, or rest comforting. Staying hydrated and eating a balanced diet with fibre-containing foods may support general wellbeing if these suit you, but they do not treat endometriosis. These approaches may not suit everyone. Stop anything that worsens symptoms, and check with a clinician or pharmacist about medicines, supplements, teas, or other herbal products and possible risks or interactions.",
            ],
          },
          {
            heading: "A script for asking about adjustments",
            paragraphs: [
              "You might say: “I manage a health condition that can sometimes cause pain flares. To help me continue my work or studies, could we discuss brief flexible breaks and other reasonable adjustments when needed?” Adapt this to your needs and local policies; you do not have to share more personal health detail than you choose.",
            ],
          },
          {
            heading: "Possible next steps with Jalia",
            bullets: [
              "Use the symptom and cycle tracker to record patterns for a healthcare appointment.",
              "Try the optional guided breathing audio if you would like a short relaxation exercise.",
              "Use the appointment-preparation guide to note questions for a qualified professional.",
            ],
          },
        ],
      },
      sw: {
        title: "Mwongozo wa kuishi na endometriosis katika hatua mbalimbali za maisha",
        description: "Mwongozo wa shule, kazi, upangaji uzazi, mahitaji yanayobadilika na kujitetea.",
        summary: "Endometriosis inaweza kuathiri watu kwa njia tofauti na mahitaji yanaweza kubadilika kadiri muda unavyopita. Mwongozo huu unatoa mawazo ya mazungumzo na mipango ya kila siku, si ushauri wa kibinafsi wa kitabibu.",
        sections: [
          {
            heading: "Tanbihi ya matibabu",
            paragraphs: [
              "Mwongozo huu unatoa taarifa za elimu na mawazo ya msaada wa kila siku. Hauchukui nafasi ya ushauri, utambuzi au matibabu kutoka kwa mtaalamu wa afya aliyehitimu. Tafuta ushauri binafsi kuhusu dalili, dawa, maswali ya uzazi au maamuzi ya matibabu.",
            ],
          },
          {
            heading: "Endometriosis katika hatua mbalimbali za maisha",
            paragraphs: [
              "Endometriosis ni hali ya muda mrefu ambapo tishu zinazofanana na utando wa ndani wa mji wa mimba hupatikana nje ya mji wa mimba. Jinsi mtu anavyoathirika na msaada anaohitaji vinaweza kubadilika kadiri homoni, majukumu na shughuli za kila siku zinavyobadilika. Hakuna njia moja inayofanana kwa kila mtu, na dalili pekee haziwezi kuthibitisha utambuzi.",
            ],
          },
          {
            heading: "Miaka ya ujana (12–19) na shule",
            paragraphs: [
              "Maumivu makali ya hedhi, kichefuchefu, kukosa masomo na mitihani vinaweza kuwa vigumu. Maumivu yanayovuruga shule au maisha ya kila siku mara kwa mara yanastahili kuchukuliwa kwa uzito; kijana hapaswi kulazimika kuyapuuza kama maumivu ya kawaida tu.",
            ],
            bullets: [
              "Weka rekodi rahisi ya dalili: tarehe, maumivu, dalili nyingine na athari zake kwa masomo au usingizi.",
              "Ikiwa ni salama, zungumza na mtu mzima unayemwamini, muuguzi wa shule au mtaalamu wa afya aliyehitimu.",
              "Uliza shule kuhusu msaada wa vitendo kama kutumia choo, kupata maji, mapumziko mafupi au mpango wa kazi za masomo uliyokosa.",
            ],
          },
          {
            heading: "Utu uzima wa mwanzo (20–35), masomo, kazi na mahusiano",
            paragraphs: [
              "Masomo ya juu, kazi, mahusiano na kutafuta utambuzi vinaweza kushindania muda na nguvu. Rekodi fupi ya dalili na athari zake inaweza kusaidia mtu kueleza wasiwasi wake kwenye miadi ya afya.",
            ],
            bullets: [
              "Fikiria kumuuliza mtaalamu wa afya kuhusu uchunguzi au rufaa zinazoweza kufaa.",
              "Pale inapowezekana, jadili ratiba inayobadilika, mapumziko mafupi, kufanya kazi ukiwa nyumbani au marekebisho ya sehemu ya kazi na shule au mwajiri.",
              "Shiriki tu taarifa za mahitaji ya utendaji unazotaka; sera za shule na kazi hutofautiana.",
            ],
          },
          {
            heading: "Upangaji uzazi na miaka ya uzazi",
            paragraphs: [
              "Watu wanaweza kuwa na maswali kuhusu uzazi, chaguo za matibabu, vipindi vya maumivu au malezi ya watoto. Endometriosis haimaanishi kwamba kila mtu atakuwa na changamoto za uzazi, na mwongozo huu hauwezi kutabiri matokeo ya mtu binafsi.",
            ],
            bullets: [
              "Muombe mtaalamu wa afya aliyehitimu kujadili maswali yako binafsi kuhusu uzazi na chaguo zinazopatikana.",
              "Ikiwa majukumu ya malezi yanafanya dalili kuwa ngumu zaidi, unaweza kuwaomba watu unaowaamini msaada wa vitendo katika siku ngumu.",
              "Jadili faida, hatari na njia mbadala za matibabu ya dawa au upasuaji na mtaalamu.",
            ],
          },
          {
            heading: "Kuelekea ukomo wa hedhi na miaka ya baadaye",
            paragraphs: [
              "Mabadiliko ya homoni yanaweza kuathiri dalili, lakini hayaathiri kila mtu kwa njia sawa. Maumivu ya nyonga yanayoendelea au mapya bado yanahitaji tathmini ya kitabibu. Upasuaji wa awali, makovu, dalili za utumbo au kibofu, mahitaji ya misuli ya sakafu ya nyonga na hali nyingine za afya vinaweza kuwa muhimu kujadiliwa na mtaalamu.",
            ],
            bullets: [
              "Eleza dalili mpya, zinazobadilika au zinazoendelea kwa mtaalamu wa afya aliyehitimu.",
              "Uliza kama tiba ya misuli ya sakafu ya nyonga au msaada mwingine unafaa kwa hali yako.",
              "Usianze, kuacha au kubadilisha dawa kwa kutegemea mwongozo huu wa elimu.",
            ],
          },
          {
            heading: "Mipango ya shule, kazi na nyumbani",
            paragraphs: [
              "Marekebisho madogo ya vitendo yanaweza kufanya siku ngumu iwe rahisi zaidi, lakini si tiba wala hakikisho la kupungua kwa dalili. Chagua njia zilizo salama na zinazowezekana kwako.",
            ],
            bullets: [
              "Kwa masomo au mitihani, uliza mapema kuhusu mapumziko, kutumia choo, maji au mpango wa kukamilisha kazi ulizokosa.",
              "Kazini, unaweza kuuliza kuhusu ratiba inayobadilika, mapumziko mafupi, kiti kinachofaa au kufanya kazi ukiwa nyumbani ikiwezekana.",
              "Panga kazi nzito kwa mwendo unaowezekana, tafuta muda wa kupumzika na mjulishe mtu unayemwamini ikiwa hilo litakusaidia.",
            ],
          },
          {
            heading: "Mawazo ya kujifariji kila siku",
            paragraphs: [
              "Baadhi ya watu hupata faraja kwa kutumia joto, kuoga maji ya uvuguvugu, kusogea taratibu, kufanya mazoezi ya kupumua kwa utulivu au kupumzika. Kunywa maji ya kutosha na kula chakula chenye uwiano na nyuzinyuzi kunaweza kusaidia afya ya jumla ikiwa vinakufaa, lakini havitibu endometriosis. Njia hizi huenda zisifae kila mtu. Acha jambo lolote linalozidisha dalili, na muulize mtaalamu wa afya au mfamasia kuhusu dawa, virutubisho, chai au mitishamba na hatari au mwingiliano unaowezekana.",
            ],
          },
          {
            heading: "Mfano wa kuomba marekebisho",
            paragraphs: [
              "Unaweza kusema: “Ninaishi na hali ya afya ambayo wakati mwingine husababisha vipindi vya maumivu. Ili niendelee na kazi au masomo yangu, tunaweza kujadili mapumziko mafupi yanayobadilika na marekebisho mengine yanapohitajika?” Badilisha maneno haya kulingana na mahitaji na sera za eneo lako; huhitaji kushiriki taarifa binafsi za afya zaidi ya unavyotaka.",
            ],
          },
          {
            heading: "Hatua zinazowezekana na Jalia",
            bullets: [
              "Tumia kifuatilia dalili na mzunguko kurekodi mwenendo kwa ajili ya miadi ya afya.",
              "Jaribu sauti ya hiari ya kupumua kwa mwongozo ikiwa ungependa zoezi fupi la kutulia.",
              "Tumia mwongozo wa maandalizi ya miadi kuandika maswali ya kumuuliza mtaalamu aliyehitimu.",
            ],
          },
        ],
      },
    },
  },
  {
    id: "guided-pelvic-breathing",
    slug: "guided-gentle-breathing",
    contentType: "audio",
    category: "living",
    journeyStages: ["experience", "living"],
    language: ["en", "sw"],
    thumbnail: "/assets/life-stage-community.jpg",
    altText: {
      en: "Illustrative stock photograph accompanying an optional breathing exercise.",
      sw: "Picha ya mfano inayoambatana na zoezi la hiari la kupumua.",
    },
    caption: {
      en: "Optional relaxation exercise. It is not a treatment and is not suitable for everyone.",
      sw: "Zoezi la hiari la kutulia. Si tiba na huenda lisimfae kila mtu.",
    },
    duration: 4,
    isFeatured: false,
    isOfflineAvailable: true,
    reviewStatus: "draft",
    reviewedBy: null,
    reviewDate: null,
    lastUpdated: "2026-10-06",
    source: "Jalia educational draft",
    references,
    relatedContent: ["life-stages-daily-life", "appointment-preparation"],
    tags: ["audio", "breathing", "relaxation", "living"],
    translations: {
      en: {
        title: "Guided gentle breathing (about 4 minutes)",
        description: "An optional, gentle breathing exercise for a moment of rest.",
        summary: "This optional relaxation exercise is not a treatment for endometriosis. Keep breathing naturally and stop if you feel discomfort, breathlessness, dizziness, or increased pain.",
        audioText: "Settle in a position that feels comfortable, or skip this exercise if it does not feel right for you. You can keep your eyes open. Let your shoulders soften. There is no need to change your breath or make it deep. Notice the support beneath you. Breathe in gently, only as far as feels comfortable. Let the breath leave without pushing. If it feels comfortable, allow your lower ribs or abdomen to move naturally. There is no need to tighten or squeeze your pelvic floor. Continue at your own pace. If counting is helpful, breathe in for a count that feels easy and breathe out for a count that feels easy. Do not hold your breath. If your mind wanders, simply notice and return to the next comfortable breath. You may stop, change position, or return to normal breathing at any time. This exercise is optional and is not a treatment for endometriosis or a substitute for care. Stop if you feel pain worsening, dizziness, breathlessness, or distress. When you are ready, notice the room around you and return to your usual activity at your own pace.",
        sections: [
          {
            heading: "Before you begin",
            paragraphs: [
              "This is an optional relaxation exercise, not a treatment. Keep your breathing natural; do not force deep breaths, hold your breath, or tighten your pelvic floor. Stop if you feel unwell or uncomfortable.",
            ],
          },
          {
            heading: "Written breathing guide",
            paragraphs: [
              "Settle in a comfortable position, or skip the exercise if it does not feel right. Keep your eyes open if you prefer. Let your shoulders soften and notice the support beneath you.",
              "Breathe in gently, only as far as feels comfortable. Let the breath leave without pushing. If comfortable, allow your lower ribs or abdomen to move naturally. Continue at your own pace; there is no need to count or hold your breath.",
              "If your mind wanders, return to the next comfortable breath. You can stop, change position, or return to normal breathing at any time. Stop if you notice worsening pain, dizziness, breathlessness, or distress.",
            ],
          },
        ],
      },
      sw: {
        title: "Mwongozo wa kupumua taratibu (takribani dakika 4)",
        description: "Zoezi la hiari na la taratibu la kupumua kwa muda wa kupumzika.",
        summary: "Zoezi hili la hiari la kutulia si tiba ya endometriosis. Pumua kawaida na uache ikiwa unahisi usumbufu, kukosa pumzi, kizunguzungu au maumivu kuongezeka.",
        audioText: "Tulia katika mkao unaokufaa, au ruka zoezi hili ikiwa halikufai. Unaweza kuyaacha macho yako wazi. Legeza mabega yako. Huhitaji kubadilisha pumzi au kuvuta pumzi nyingi. Tambua kitu kinachokuunga mkono. Vuta pumzi taratibu, kiasi kinachokufaa. Acha pumzi itoke bila kujilazimisha. Ikiwa unajisikia vizuri, ruhusu mbavu za chini au tumbo lisogee kawaida. Huhitaji kukaza misuli ya sakafu ya nyonga. Endelea kwa mwendo wako. Ikiwa kuhesabu kunakusaidia, hesabu pumzi kwa kiasi kinachokufaa. Usishikilie pumzi. Mawazo yakitangatanga, tambua hilo na urudi kwenye pumzi inayokufaa. Unaweza kusimama, kubadilisha mkao au kurudia kupumua kawaida wakati wowote. Zoezi hili ni la hiari na si tiba ya endometriosis wala mbadala wa huduma. Acha ikiwa maumivu yanaongezeka, unahisi kizunguzungu, unakosa pumzi au una wasiwasi. Ukiwa tayari, tambua mazingira yanayokuzunguka na urudi kwenye shughuli zako kwa mwendo wako.",
        sections: [
          {
            heading: "Kabla ya kuanza",
            paragraphs: [
              "Hili ni zoezi la hiari la kutulia, si tiba. Endelea kupumua kawaida; usilazimishe pumzi nyingi, usishikilie pumzi wala kukaza misuli ya sakafu ya nyonga. Acha ikiwa unajisikia vibaya au huna raha.",
            ],
          },
          {
            heading: "Mwongozo wa kupumua kwa maandishi",
            paragraphs: [
              "Tulia katika mkao unaokufaa, au ruka zoezi ikiwa halikufai. Unaweza kuyaacha macho wazi. Legeza mabega na tambua kitu kinachokuunga mkono.",
              "Vuta pumzi taratibu, kiasi kinachokufaa. Acha pumzi itoke bila kujilazimisha. Ikiwa unajisikia vizuri, ruhusu mbavu za chini au tumbo lisogee kawaida. Endelea kwa mwendo wako; huhitaji kuhesabu wala kushikilia pumzi.",
              "Mawazo yakitangatanga, rudi kwenye pumzi inayokufaa. Unaweza kusimama, kubadilisha mkao au kurudia kupumua kawaida wakati wowote. Acha ikiwa maumivu yanaongezeka, unahisi kizunguzungu, unakosa pumzi au una wasiwasi.",
            ],
          },
        ],
      },
    },
  },
];

export const educationContentById = Object.fromEntries(educationContent.map((item) => [item.id, item]));

export function getLocalized(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || "";
  }
  return value || "";
}

export function getContentCopy(item, language) {
  return item?.translations?.[language] || item?.translations?.en || null;
}

export function getLocalizedAsset(asset, language) {
  if (language !== "sw") return asset;
  const swahiliAssets = {
    "/assets/anatomy.svg": "/assets/anatomy-sw.svg",
    "/assets/pain-map.svg": "/assets/pain-map-sw.svg",
  };
  return swahiliAssets[asset] || asset;
}

export const educationUiCopy = {
  en: {
    eyebrow: "LEARN",
    heading: "Understand endometriosis, one step at a time",
    intro: "Choose a format that works for you. Learn at your own pace, and return whenever you need.",
    search: "Search topics, symptoms, or questions",
    searchLabel: "Search learning resources",
    allTopics: "All topics",
    allStages: "All journey stages",
    startHere: "Start here",
    featured: "Suggested learning",
    explore: "Explore by topic",
    continue: "Continue learning",
    saved: "Saved resources",
    save: "Save",
    remove: "Remove saved resource",
    open: "Open resource",
    empty: "No resources match that search. Try another word or topic.",
    noSaved: "You have not saved any resources yet.",
    browse: "Browse learning resources",
    back: "Back to learning",
    medicalNote: "Educational information only — not a diagnosis or a substitute for professional care.",
    reviewNote: "Prototype education · requires clinical review",
    draftReview: "Draft · not clinically reviewed",
    reviewLabel: "Review status",
    readTime: "min",
    related: "Related learning",
    sources: "Sources and references",
    noReferences: "This fictional learning story is not medical evidence.",
    markComplete: "Mark as finished",
    completed: "Finished",
    continueReading: "Continue",
    share: "Share",
    linkCopied: "Link copied.",
    shareError: "Could not share this resource. You can copy the page link from your browser.",
    language: "Learning language",
    english: "English",
    swahili: "Kiswahili",
    searchResults: "Search results",
    bodyHeading: "Explore areas mentioned in education",
    bodyIntro: "Select a label to read about areas that may be involved. This does not show where disease is in your body.",
    bodyDisclaimer: "This simplified diagram is not to scale and is not a diagnostic tool.",
    areaLabel: "Choose an area",
    areaDetails: "About this area",
    audioPlay: "Play audio",
    audioPause: "Pause audio",
    audioResume: "Resume audio",
    audioStop: "Stop audio",
    audioUnavailable: "Spoken audio is not available in this browser. The written version is below.",
    videoLoad: "Load video",
    videoPrivacy: "This video is hosted by YouTube. It will connect to YouTube only if you choose to load it.",
    videoSummary: "Written learning summary (not a verbatim transcript)",
    videoAudio: "Video audio: English. The written Kiswahili summary is not a subtitle track.",
    contentLanguage: "Learning language",
    sourceLabel: "Content source",
    updatedLabel: "Last updated",
    externalVideo: "Open video on YouTube",
    contentStarted: "Started",
    progressSaved: "Your learning progress is saved on this device.",
    offlineAvailable: "Available offline",
    onlineOnly: "Internet connection required",
    fictional: "Fictional learning story",
    type: "Content type",
    category: "Topic",
    updated: "Content updated",
    clinicalReview: "This prototype material has not been clinically reviewed. Please use it for general education and discuss health concerns with a qualified professional.",
    languageUnavailable: "This resource does not yet have a complete version in your selected language.",
  },
  sw: {
    eyebrow: "JIFUNZE",
    heading: "Elewa endometriosis hatua kwa hatua",
    intro: "Chagua njia inayokufaa. Jifunze kwa mwendo wako na urudi wakati wowote unapohitaji.",
    search: "Tafuta mada, dalili au maswali",
    searchLabel: "Tafuta nyenzo za kujifunzia",
    allTopics: "Mada zote",
    allStages: "Hatua zote za safari",
    startHere: "Anza hapa",
    featured: "Mada za kuanza nazo",
    explore: "Chunguza kwa mada",
    continue: "Endelea kujifunza",
    saved: "Nyenzo ulizohifadhi",
    save: "Hifadhi",
    remove: "Ondoa nyenzo zilizohifadhiwa",
    open: "Fungua nyenzo",
    empty: "Hakuna nyenzo zinazolingana na utafutaji huo. Jaribu neno au mada nyingine.",
    noSaved: "Bado hujahifadhi nyenzo zozote.",
    browse: "Vinjari nyenzo za kujifunzia",
    back: "Rudi kwenye kujifunza",
    medicalNote: "Taarifa za elimu tu — si utambuzi wala mbadala wa huduma ya mtaalamu.",
    reviewNote: "Elimu ya majaribio · inahitaji ukaguzi wa kitabibu",
    draftReview: "Rasimu · haijakaguliwa kitabibu",
    reviewLabel: "Hali ya ukaguzi",
    readTime: "dak",
    related: "Mada zinazohusiana",
    sources: "Vyanzo na marejeleo",
    noReferences: "Hadithi hii ya kujifunzia imebuniwa na si ushahidi wa kitabibu.",
    markComplete: "Weka kuwa umemaliza",
    completed: "Imekamilika",
    continueReading: "Endelea",
    share: "Shiriki",
    linkCopied: "Kiungo kimenakiliwa.",
    shareError: "Imeshindikana kushiriki nyenzo hii. Unaweza kunakili kiungo kutoka kwenye kivinjari.",
    language: "Lugha ya kujifunzia",
    english: "English",
    swahili: "Kiswahili",
    searchResults: "Matokeo ya utafutaji",
    bodyHeading: "Chunguza maeneo yanayotajwa katika elimu",
    bodyIntro: "Chagua jina ili usome kuhusu maeneo yanayoweza kuhusika. Hii haionyeshi ugonjwa ulipo katika mwili wako.",
    bodyDisclaimer: "Mchoro huu rahisi hauonyeshi vipimo halisi na si kifaa cha utambuzi.",
    areaLabel: "Chagua eneo",
    areaDetails: "Kuhusu eneo hili",
    audioPlay: "Cheza sauti",
    audioPause: "Sitisha sauti",
    audioResume: "Endelea na sauti",
    audioStop: "Simamisha sauti",
    audioUnavailable: "Sauti ya kusoma haipatikani kwenye kivinjari hiki. Maandishi yapo hapa chini.",
    videoLoad: "Pakia video",
    videoPrivacy: "Video hii inawekwa na YouTube. Muunganisho wa YouTube utaanza tu ukichagua kuipakia.",
    videoSummary: "Muhtasari wa maandishi (si nakala ya maneno halisi ya video)",
    videoAudio: "Sauti ya video: Kiingereza. Muhtasari wa Kiswahili si manukuu ya video.",
    contentLanguage: "Lugha ya nyenzo",
    sourceLabel: "Chanzo cha nyenzo",
    updatedLabel: "Ilisasishwa",
    externalVideo: "Fungua video kwenye YouTube",
    contentStarted: "Imeanza",
    progressSaved: "Maendeleo yako ya kujifunza yamehifadhiwa kwenye kifaa hiki.",
    offlineAvailable: "Inapatikana bila intaneti",
    onlineOnly: "Inahitaji muunganisho wa intaneti",
    fictional: "Hadithi ya kujifunzia ya kubuni",
    type: "Aina ya nyenzo",
    category: "Mada",
    updated: "Tarehe ya kusasishwa",
    clinicalReview: "Nyenzo hii ya majaribio haijakaguliwa kitabibu. Itumie kwa elimu ya jumla na jadili wasiwasi wa afya na mtaalamu aliyehitimu.",
    languageUnavailable: "Nyenzo hii bado haina toleo kamili katika lugha uliyochagua.",
  },
};
