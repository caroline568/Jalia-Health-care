import {BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { AccountProvider } from "./context/AccountContext";
import { AccountPage, BackupPage, LoginPage, RegisterPage, AppointmentReport } from "./pages/AccountPages";
import EducationExperience from "./pages/EducationExperience";
import { translate } from "./content/appTranslations";
import "./styles/global.css";

const initialData={pain:[],periods:[],symptoms:[],saved:[],questions:[],learningProgress:{},lastLearningContent:null,onboarded:false,lowData:true,language:"English"};
const loadData=()=>{try{return {...initialData,...JSON.parse(localStorage.getItem("jaliaData")||"{}")}}catch{return initialData}};
function useJalia(){const [data,setData]=useState(loadData);useEffect(()=>localStorage.setItem("jaliaData",JSON.stringify(data)),[data]);return [data,setData]}
const t=(data,value)=>translate(data?.language,value);
function Brand(){return <Link className="brand" to="/"><span className="brand-mark">J</span><span>Jalia Healthcare</span></Link>}
function Landing({data,setData}){
  const photos=["life-stage-teen.jpg","life-stage-adult.jpg","life-stage-family.jpg","life-stage-later.jpg","life-stage-community.jpg"];
  const stages=[
    ["Teenage & student life","Plan for classes and exams, record symptoms, and find an adult or clinician who listens.","life-stage-teen.jpg"],
    ["Young adulthood","Balance study, work, relationships, and conversations about diagnosis and care.","life-stage-adult.jpg"],
    ["Family planning & reproductive years","Get individual advice about fertility, treatment options, and caring responsibilities.","life-stage-family.jpg"],
    ["Perimenopause & later years","Keep seeking help for persistent symptoms and discuss changing needs with a clinician.","life-stage-later.jpg"],
  ];
  return <div className="landing">
    <header className="landing-nav">
      <Brand/>
      <label className="landing-language"><span>{t(data,"Choose language")}</span><select aria-label={t(data,"Choose language")} value={data.language} onChange={event=>setData({...data,language:event.target.value})}><option value="English">English</option><option value="Kiswahili">Kiswahili</option></select></label>
      <Link className="btn small primary" to="/app">{t(data,"Get started")}</Link>
    </header>
    <main>
      <section className="landing-hero landing-hero-card">
        <div className="landing-photo-collage" aria-hidden="true">{photos.map(photo=><img key={photo} src={`/assets/${photo}`} alt=""/>)}</div>
        <div className="landing-hook-card">
          <span className="eyebrow light">{t(data,"ENDOMETRIOSIS CARE & UNDERSTANDING")}</span>
          <h1>{t(data,"You deserve to be heard — at every stage of life.")}</h1>
          <p>{t(data,"Learn about endometriosis, find support for daily life, and prepare for care in a way that works for you.")}</p>
          <Link className="btn landing-cta" to="/app">{t(data,"Explore Jalia")} <span aria-hidden="true">→</span></Link>
          <div className="trust-row"><span>{t(data,"Education first · Your records stay yours · Guest access")}</span></div>
        </div>
        <p className="photo-disclaimer">{t(data,"Illustrative photographs of diverse people. They are not testimonials or depictions of people diagnosed with endometriosis.")}</p>
      </section>
      <section className="life-stages" aria-labelledby="life-stage-heading">
        <div className="life-stages-heading">
          <span className="eyebrow">{t(data,"LIFE DOES NOT PAUSE")}</span>
          <h2 id="life-stage-heading">{t(data,"Support for real life, through every life stage.")}</h2>
          <p>{t(data,"School, work, relationships, family planning, and changing bodies can all shape what support looks like.")}</p>
        </div>
        <div className="life-stage-grid">
          {stages.map(([title,description,image])=><Link className="life-stage-card" key={title} to="/app/learn/content/life-stages-daily-life">
            <img src={`/assets/${image}`} alt="" loading="lazy"/>
            <div><h3>{t(data,title)}</h3><p>{t(data,description)}</p></div>
          </Link>)}
        </div>
      </section>
      <section className="landing-guide">
        <div><span className="eyebrow">{t(data,"A guide for the whole of life")}</span><h2>{t(data,"Explore school and work adaptations, everyday comfort ideas, and words to advocate for yourself.")}</h2></div>
        <Link className="btn primary" to="/app/learn/content/life-stages-daily-life">{t(data,"View the living-with-endometriosis guide")} <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <footer><Brand/><span>{t(data,"Jalia Healthcare — endometriosis education, daily support and preparation for care.")}</span></footer>
  </div>;
}

function Onboarding({data}){const nav=useNavigate();const [step,setStep]=useState(0);const slides=[["Welcome to Jalia","Understand your symptoms. Learn about endometriosis. Prepare for care.","/assets/jalia-hero.svg"],["Learn","Trusted information in simple language, with images, short videos and audio.","/assets/anatomy.svg"],["Track","Keep a private record of pain, periods and symptoms — even when offline.","/assets/pain-map.svg"],["Prepare","Turn your health history into something useful for your next appointment.","/assets/anatomy.svg"],["Built for real life","Low-data, accessible and designed for everyday life in Kenya.","/assets/jalia-hero.svg"]];return <div className="onboarding"><header><Brand/><Link to="/" className="skip">{t(data,"Back")}</Link></header><div className="onboard-card"><img className="onboard-image" src={slides[step][2]} alt="Jalia educational illustration"/><span className="step">{step+1} / {slides.length}</span><span className="eyebrow">{t(data,"ENDOMETRIOSIS CARE & UNDERSTANDING")}</span><h1>{t(data,slides[step][0])}</h1><p>{t(data,slides[step][1])}</p><div className="dots">{slides.map((_,i)=><span className={i===step?"dot on":"dot"} key={i}/>)}</div>{step<slides.length-1?<button className="btn primary wide" onClick={()=>setStep(step+1)}>{t(data,"Continue")}</button>:<button className="btn primary wide" onClick={()=>nav("/app")}>{t(data,"Get started")}</button>}<small>{t(data,"Your health information belongs to you.")}</small></div></div>}

function Shell({children,data,setData}){const loc=useLocation();const nav=[["/app","Home","⌂"],["/app/learn","Learn","◈"],["/app/track","Track","＋"],["/app/prepare","Prepare","▣"],["/app/profile","Profile","○"]];return <div className="shell"><header className="topbar"><Brand/><div className="top-actions"><span className="sync">✓ {t(data,navigator.onLine?"Online":"Saved offline")}</span><button className="ghost" onClick={()=>setData({...data,lowData:!data.lowData})}>{t(data,data.lowData?"Low-data on":"Low-data off")}</button><label className="app-language"><span className="sr-only">{t(data,"Choose language")}</span><select aria-label={t(data,"Choose language")} value={data.language} onChange={event=>setData({...data,language:event.target.value})}><option value="English">English</option><option value="Kiswahili">Kiswahili</option></select></label></div></header><main className="main">{children}</main><nav className="bottom-nav" aria-label={t(data,"Main navigation")}>{nav.map(([to,label,ic])=><Link key={to} className={loc.pathname===to||loc.pathname.startsWith(to+"/")?"active":""} to={to}><span className="icon" aria-hidden="true">{ic}</span><span>{t(data,label)}</span></Link>)}</nav></div>}
function Home({data}) {
  return <>
    <div className="page-head">
      <span className="eyebrow">JALIA HEALTHCARE</span>
      <h1>{t(data,"Understand your body.")}<br/>{t(data,"Track what you're experiencing.")}</h1>
      <p>{t(data,"Understand your symptoms. Learn about endometriosis. Prepare for care.")}</p>
    </div>
    <section className="hero-card home-hero">
      <img src="/assets/life-stage-family.jpg" alt={t(data,"Illustrative stock photograph; not a patient story.")}/>
      <div>
        <span className="eyebrow light">{t(data,"ENDOMETRIOSIS CARE & UNDERSTANDING")}</span>
        <h2>{t(data,"Start with the basics, in plain language.")}</h2>
        <p>{t(data,"Learn what endometriosis is, recognize possible symptoms, and understand what to discuss with a healthcare professional.")}</p>
        <Link className="btn light-btn" to="/app/learn">{t(data,"Start learning")} →</Link>
      </div>
    </section>
    <section className="home-guide card">
      <div><span className="eyebrow">{t(data,"LIFE DOES NOT PAUSE")}</span><h2>{t(data,"A guide for the whole of life")}</h2><p>{t(data,"Explore school and work adaptations, everyday comfort ideas, and words to advocate for yourself.")}</p></div>
      <Link className="btn secondary" to="/app/learn/content/life-stages-daily-life">{t(data,"Start with the guide")} →</Link>
    </section>
    <h3 className="section-title">{t(data,"Quick actions")}</h3>
    <div className="grid2">
      <Quick data={data} to="/app/track/pain" title="Track pain" text="Log in under 30 seconds" icon="♡"/>
      <Quick data={data} to="/app/track/period" title="Track period" text="Keep cycle context" icon="◷"/>
      <Quick data={data} to="/app/track/symptoms" title="Track symptoms" text="Capture what changes" icon="＋"/>
      <Quick data={data} to="/app/prepare" title="Prepare for appointment" text="Turn your history into a summary" icon="▣"/>
    </div>
    <h3 className="section-title">{t(data,"Today’s health")}</h3>
    <div className="card">
      <div className="health-row"><strong>{t(data,"Pain")}</strong><b>{data.pain.length?data.pain[data.pain.length-1].score:"—"}/10</b></div>
      <p className="muted">{data.pain.length?t(data,data.pain[data.pain.length-1].area)+" · "+data.pain[data.pain.length-1].date:t(data,"No pain logged today yet.")}</p>
    </div>
    <div className="offline"><b>{t(data,"✓ Works offline")}</b><span>{t(data,"Low-data mode")}</span></div>
  </>;
}
function Quick({to,title,text,icon,data}){return <Link to={to} className="quick card"><span className="quick-icon">{icon}</span><span><b>{t(data,title)}</b><small>{t(data,text)}</small></span><span>→</span></Link>}

function Learn({data,setData}){return <EducationExperience data={data} setData={setData}/>}
function Lesson({to,title,text,tag,coral,sage}){return <Link to={to} className={'lesson card '+(coral?'coral ':'')+(sage?'sage':'')}><span className="pill">{tag}</span><h3>{title}</h3><p>{text}</p><span className="readmore">Open {tag.toLowerCase()} →</span></Link>}

function Track({data}){return <><div className="page-head"><span className="eyebrow">{t(data,"TRACK")}</span><h1>{t(data,"What are you experiencing?")}</h1><p>{t(data,"Fast, private logging. Everything is saved locally first.")}</p></div><div className="content-list"><Lesson to="/app/track/pain" title={t(data,"Pain")} text={t(data,"0–10 scale · body area · sensation · duration · what helped")} tag={t(data,"Under 30 seconds")} coral/><Lesson to="/app/track/period" title={t(data,"Period")} text={t(data,"Start · end · flow · spotting · period pain")} tag={t(data,"Cycle context")}/><Lesson to="/app/track/symptoms" title={t(data,"Symptoms")} text={t(data,"Pain · fatigue · bloating · bowel · urinary · nausea · sleep · mood")} tag={t(data,"Daily record")} sage/></div><h3 className="section-title">{t(data,"Recent pain")}</h3>{data.pain.slice(-3).reverse().map((x,i)=><div className="card timeline-mini" key={i}><b>{x.date} · {t(data,"Pain")} {x.score}/10</b><span>{t(data,x.area||"Pelvic pain")}</span></div>)}</>}
function FormPage({title,back,children,data}){return <><Link className="back" to={back}>← {t(data,"Back")}</Link><div className="page-head"><span className="eyebrow">{t(data,"TRACK")}</span><h1>{t(data,title)}</h1></div><div className="form">{children}</div></>}
function Pain({data,setData}) {
  const [score,setScore]=useState(6),[area,setArea]=useState("Pelvis"),[feel,setFeel]=useState("Cramping"),[duration,setDuration]=useState(""),[help,setHelp]=useState(""),[note,setNote]=useState("");
  const areas=["Lower abdomen","Pelvis","Lower back","Hips","Legs","Bowel area","Bladder area","Other"];
  const feelings=["Cramping","Sharp","Burning","Throbbing","Pressure","Pulling"];
  const relief=["Rest","Heat","Medication","Movement","Sleep","Nothing"];
  const save=()=>setData({...data,pain:[...data.pain,{id:crypto.randomUUID(),score,area,feel,duration,help,note,date:new Date().toLocaleDateString(data.language==="Kiswahili"?"sw-KE":"en-GB",{day:"2-digit",month:"short",year:"numeric"})}]});
  return <FormPage data={data} title="Track pain" back="/app/track">
    <label>{t(data,"How much pain are you experiencing?")}<div className="score">{score} <small>/ 10</small></div><input className="range" type="range" min="0" max="10" value={score} onChange={e=>setScore(+e.target.value)}/><div className="range-labels"><span>{t(data,"0 No pain")}</span><span>{t(data,"10 Worst pain")}</span></div></label>
    <label>{t(data,"Where does it hurt?")}</label><div className="chips">{areas.map(x=><button type="button" className={area===x?"chip selected":"chip"} onClick={()=>setArea(x)} key={x}>{t(data,x)}</button>)}</div>
    <label>{t(data,"What does the pain feel like?")}</label><div className="chips">{feelings.map(x=><button type="button" className={feel===x?"chip selected":"chip"} onClick={()=>setFeel(x)} key={x}>{t(data,x)}</button>)}</div>
    <label>{t(data,"How long has it lasted?")}<input value={duration} onChange={e=>setDuration(e.target.value)} placeholder={t(data,"e.g. 2 hours")}/></label>
    <label>{t(data,"What helped?")}</label><div className="chips">{relief.map(x=><button type="button" className={help===x?"chip selected":"chip"} onClick={()=>setHelp(x)} key={x}>{t(data,x)}</button>)}</div>
    <label>{t(data,"Optional note")}<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t(data,"Anything else you want to remember?")}/></label>
    <button className="btn primary wide" onClick={save}>{t(data,"Save pain entry")}</button><Link className="btn secondary wide" to="/app/track">{t(data,"Done")}</Link>
  </FormPage>;
}
function Period({data,setData}) {
  const [start,setStart]=useState(""),[end,setEnd]=useState(""),[flow,setFlow]=useState("Medium"),[pain,setPain]=useState("6");
  const flows=["Light","Medium","Heavy","Spotting"];
  const save=()=>setData({...data,periods:[...data.periods,{id:crypto.randomUUID(),start,end,flow,pain,date:new Date().toISOString()}]});
  return <FormPage data={data} title="Track period" back="/app/track">
    <label>{t(data,"Start date")}<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label>
    <label>{t(data,"End date")}<input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label>
    <label>{t(data,"Flow")}</label><div className="chips">{flows.map(x=><button type="button" className={flow===x?"chip selected":"chip"} onClick={()=>setFlow(x)} key={x}>{t(data,x)}</button>)}</div>
    <label>{t(data,"Period pain")}<div className="score">{pain}<small>/ 10</small></div><input className="range" type="range" min="0" max="10" value={pain} onChange={e=>setPain(e.target.value)}/></label>
    <button className="btn primary wide" onClick={save}>{t(data,"Save period entry")}</button><Link className="btn secondary wide" to="/app/track">{t(data,"Done")}</Link>
  </FormPage>;
}
function Symptoms({data,setData}) {
  const [selected,setSelected]=useState([]);
  const items=["Pain","Digestive changes","Bowel symptoms","Urinary symptoms","Bloating","Fatigue","Nausea","Headache","Sleep","Mood","Pain during/after sex","Other"];
  const toggle=x=>setSelected(selected.includes(x)?selected.filter(y=>y!==x):[...selected,x]);
  const save=()=>setData({...data,symptoms:[...data.symptoms,{id:crypto.randomUUID(),items:selected,date:new Date().toISOString()}]});
  return <FormPage data={data} title="Track symptoms" back="/app/track">
    <p className="muted">{t(data,"Select what you noticed. You can change this list later.")}</p>
    <div className="symptom-grid">{items.map(x=><button type="button" className={selected.includes(x)?"symptom selected":"symptom"} onClick={()=>toggle(x)} key={x}>{t(data,x)}<span>{selected.includes(x)?"✓":"+"}</span></button>)}</div>
    <button className="btn primary wide" onClick={save}>{t(data,"Save symptoms")}</button><Link className="btn secondary wide" to="/app/track">{t(data,"Done")}</Link>
  </FormPage>;
}
function Prepare({data,setData}) {
  const [questions,setQuestions]=useState(data.questions||[]),[q,setQ]=useState("");
  const add=()=>{if(q.trim())setQuestions([...questions,q.trim()]);setQ("")};
  useEffect(()=>setData({...data,questions}),[questions]);
  return <>
    <div className="page-head"><span className="eyebrow">{t(data,"PREPARE")}</span><h1>{t(data,"Prepare for your appointment")}</h1><p>{t(data,"Bring the pattern, not just the moment. Add what you want a healthcare professional to understand.")}</p></div>
    <div className="card report"><b>{t(data,"Your records")}</b><p>{t(data,"Pain entries:")} {data.pain.length}</p><p>{t(data,"Period entries:")} {data.periods.length}</p><p>{t(data,"Symptom entries:")} {data.symptoms.length}</p></div>
    <div className="question-box"><label><b>{t(data,"Questions I want to ask")}</b></label><div className="inline"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t(data,"e.g. What could explain this pattern?")}/><button onClick={add}>{t(data,"Add")}</button></div>{questions.map((x,i)=><div className="question" key={i}>✓ {x}</div>)}</div>
    <Link className="btn primary wide" to="/app/prepare/report">{t(data,"View my appointment summary")}</Link><p className="medical-note">{t(data,"Patient-generated health summary — not a medical diagnosis.")}</p>
  </>;
}
function Report({data}){return <AppointmentReport data={data}/>}
function Profile({data,setData}){return <AccountPage data={data} setData={setData}/>}
function App(){
  const [data,setData]=useJalia();
  useEffect(()=>{document.documentElement.lang=data.language==="Kiswahili"?"sw":"en";},[data.language]);
  return <BrowserRouter><AccountProvider><Routes>
    <Route path="/" element={<Landing data={data} setData={setData}/>}/>
    <Route path="/onboarding" element={<Onboarding data={data}/>}/>
    <Route path="/login" element={<LoginPage data={data}/>}/>
    <Route path="/register" element={<RegisterPage data={data}/>}/>
    <Route path="/app/*" element={<Shell data={data} setData={setData}><Routes>
      <Route index element={<Home data={data}/>}/>
      <Route path="learn/*" element={<Learn data={data} setData={setData}/>}/>
      <Route path="track" element={<Track data={data}/>}/>
      <Route path="track/pain" element={<Pain data={data} setData={setData}/>}/>
      <Route path="track/period" element={<Period data={data} setData={setData}/>}/>
      <Route path="track/symptoms" element={<Symptoms data={data} setData={setData}/>}/>
      <Route path="prepare" element={<Prepare data={data} setData={setData}/>}/>
      <Route path="prepare/report" element={<Report data={data}/>}/>
      <Route path="profile" element={<Profile data={data} setData={setData}/>}/>
      <Route path="account/backup" element={<BackupPage data={data} setData={setData}/>}/>
      <Route path="*" element={<Navigate to="/app"/>}/>
    </Routes></Shell>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes></AccountProvider></BrowserRouter>;
}
export default App;
