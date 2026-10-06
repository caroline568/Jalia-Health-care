import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import { api } from "../lib/api";
import { decryptBackup, encryptBackup, isValidJaliaBackup } from "../lib/secureBackup";

const swahili = {
  "← Back to Jalia": "← Rudi Jalia",
  "JALIA ACCOUNT": "AKAUNTI YA JALIA",
  "Create your account": "Fungua akaunti yako",
  "Sign in to Jalia": "Ingia Jalia",
  "Learning, local tracking, and appointment preparation are available without signing in. An account is only needed for encrypted backup and sharing your own summary.": "Kujifunza, kurekodi dalili kwenye kifaa hiki, na kujiandaa kwa miadi kunapatikana bila kuingia. Akaunti inahitajika tu kwa nakala rudufu iliyosimbwa na kushiriki muhtasari wako.",
  "Name": "Jina",
  "Email": "Barua pepe",
  "Passphrase": "Kaulisiri",
  "Use at least 12 characters. You will need this passphrase to restore encrypted backups.": "Tumia angalau herufi 12. Utahitaji kaulisiri hii kurejesha nakala rudufu zilizosimbwa.",
  "Please wait…": "Tafadhali subiri…",
  "Create account": "Fungua akaunti",
  "Sign in": "Ingia",
  "Already have an account?": "Tayari una akaunti?",
  "New to Jalia?": "Mpya kwa Jalia?",
  "Create an account": "Fungua akaunti",
  "Your symptom records stay on this device unless you deliberately create an encrypted backup.": "Rekodi za dalili zako hubaki kwenye kifaa hiki isipokuwa uunde nakala rudufu iliyosimbwa.",
  "PROFILE": "WASIFU",
  "Your Jalia account": "Akaunti yako ya Jalia",
  "Learning and personal tracking remain available when you are signed out.": "Kujifunza na kurekodi dalili zako bado kunapatikana ukiwa umetoka.",
  "Signed in as": "Umeingia kama",
  "personal entries remain saved on this device.": "rekodi zako binafsi zimehifadhiwa kwenye kifaa hiki.",
  "Manage encrypted backup": "Dhibiti nakala rudufu iliyosimbwa",
  "Sign out": "Toka",
  "You are signed out. Your on-device health records have not been removed.": "Umetoka. Rekodi zako za afya kwenye kifaa hiki hazijafutwa.",
  "Account service unavailable": "Huduma ya akaunti haipatikani",
  "You are using Jalia as a guest": "Unatumia Jalia kama mgeni",
  "Explore learning, track symptoms on this device, and prepare for an appointment without an account.": "Jifunze, rekodi dalili kwenye kifaa hiki, na ujiandae kwa miadi bila akaunti.",
  "Sign in when you want to create or restore an encrypted backup, or share your own appointment summary.": "Ingia unapotaka kuunda au kurejesha nakala rudufu iliyosimbwa, au kushiriki muhtasari wako wa miadi.",
  "The account service could not be reached. Guest features are still available.": "Huduma ya akaunti haikupatikana. Vipengele vya wageni bado vinapatikana.",
  "Preferences": "Mapendeleo",
  "Low-data mode": "Hali ya matumizi madogo ya data",
  "Text-first, no autoplay, and lighter media.": "Maandishi kwanza, hakuna uchezaji wa moja kwa moja, na midia nyepesi.",
  "Language": "Lugha",
  "Choose English or Kiswahili.": "Chagua Kiingereza au Kiswahili.",
  "Privacy": "Faragha",
  "On-device tracking entries:": "Rekodi za ufuatiliaji kwenye kifaa:",
  "Your personal health entries stay in this browser unless you explicitly create an encrypted backup. Signing out does not delete this device's records.": "Rekodi zako binafsi za afya hubaki kwenye kivinjari hiki isipokuwa uunde nakala rudufu iliyosimbwa. Kutoka hakufuti rekodi za kifaa hiki.",
  "← Profile": "← Wasifu",
  "ACCOUNT FEATURE": "KIPENGELE CHA AKAUNTI",
  "Encrypted health backup": "Nakala rudufu ya afya iliyosimbwa",
  "Guest learning and on-device tracking do not need an account. Sign in to save or restore an encrypted backup.": "Kujifunza na kufuatilia kwenye kifaa hakuhitaji akaunti. Ingia ili kuhifadhi au kurejesha nakala rudufu iliyosimbwa.",
  "ACCOUNT BACKUP": "NAKALA RUDUFU YA AKAUNTI",
  "If you forget this passphrase, Jalia cannot decrypt or recover the backup. Keep it private and do not reuse a passphrase you use elsewhere.": "Ukisahau kaulisiri hii, Jalia haiwezi kufungua au kurejesha nakala rudufu. Iweke kwa siri na usitumie kaulisiri unayotumia kwingineko.",
  "Checking for a backup…": "Inatafuta nakala rudufu…",
  "No encrypted backup exists yet.": "Bado hakuna nakala rudufu iliyosimbwa.",
  "Account passphrase": "Kaulisiri ya akaunti",
  "Update encrypted backup": "Sasisha nakala rudufu iliyosimbwa",
  "Create encrypted backup": "Unda nakala rudufu iliyosimbwa",
  "Restore backup to this device": "Rejesha nakala rudufu kwenye kifaa hiki",
  "Encrypted backup saved. The server receives ciphertext, not your health-record contents.": "Nakala rudufu iliyosimbwa imehifadhiwa. Seva hupokea data iliyosimbwa pekee, si maudhui ya rekodi zako za afya.",
  "Backup restored to this device.": "Nakala rudufu imerejeshwa kwenye kifaa hiki.",
  "Could not decrypt this backup. Check your account passphrase and try again.": "Haikuweza kufungua nakala rudufu hii. Angalia kaulisiri ya akaunti yako na ujaribu tena.",
  "This backup does not contain a valid Jalia health record.": "Nakala rudufu hii haina rekodi halali ya afya ya Jalia.",
  "Restore this backup and replace the health records currently on this device? This cannot be undone.": "Ungependa kurejesha nakala rudufu hii na kubadilisha rekodi za afya zilizopo kwenye kifaa hiki? Huwezi kutendua hatua hii.",
  "Backup is optional. Your records are encrypted in this browser with your account passphrase before anything is sent. The server stores ciphertext only.": "Nakala rudufu ni hiari. Rekodi zako husimbwa kwenye kivinjari hiki kwa kaulisiri ya akaunti yako kabla ya kutumwa. Seva huhifadhi data iliyosimbwa pekee.",
  "Checking account…": "Inakagua akaunti…",
  "Your learning and on-device records remain available. Try again when you can connect to the account service.": "Kujifunza na rekodi zako kwenye kifaa bado zinapatikana. Jaribu tena utakapoweza kuunganisha huduma ya akaunti.",
  "Pain entries": "Rekodi za maumivu",
  "Period entries": "Rekodi za hedhi",
  "Symptom entries": "Rekodi za dalili",
  "Questions:": "Maswali:",
  "This is not a medical diagnosis.": "Huu si utambuzi wa kitabibu.",
  "Jalia patient-generated appointment summary": "Muhtasari wa miadi ulioandaliwa na mtumiaji wa Jalia",
  "Jalia appointment summary": "Muhtasari wa miadi ya Jalia",
  "Back to profile": "Rudi kwenye wasifu",
  "Appointment summary": "Muhtasari wa miadi",
  "Recorded history": "Historia iliyorekodiwa",
  "Pain entries:": "Rekodi za maumivu:",
  "Period entries:": "Rekodi za hedhi:",
  "Symptom entries:": "Rekodi za dalili:",
  "personal entries are included in this summary.": "rekodi binafsi zimejumuishwa kwenye muhtasari huu.",
  "Questions": "Maswali",
  "No questions added yet.": "Bado hakuna maswali yaliyoongezwa.",
  "Patient-generated health summary — not a medical diagnosis.": "Muhtasari wa afya ulioandaliwa na mtumiaji — si utambuzi wa kitabibu.",
  "Print / Save PDF": "Chapisha / Hifadhi PDF",
  "Share my summary": "Shiriki muhtasari wangu",
  "Sign in to share my summary": "Ingia ili kushiriki muhtasari wangu",
  "Summary shared using your device's share controls.": "Muhtasari umeshirikiwa kwa kutumia chaguo za kushiriki za kifaa chako.",
  "Summary copied. Choose where you want to share it.": "Muhtasari umenakiliwa. Chagua mahali pa kuushiriki.",
  "Sharing is not available in this browser.": "Kushiriki hakupatikani kwenye kivinjari hiki.",
  "Send account details as a JSON object.": "Tuma maelezo ya akaunti kama data ya JSON.",
  "Enter your name (up to 120 characters).": "Weka jina lako (hadi herufi 120).",
  "Enter a valid email address.": "Weka anwani sahihi ya barua pepe.",
  "Choose a passphrase between 12 and 256 characters.": "Chagua kaulisiri yenye herufi 12 hadi 256.",
  "Too many account attempts. Please try again later.": "Umejaribu mara nyingi sana. Tafadhali jaribu tena baadaye.",
  "An account with this email already exists.": "Akaunti yenye barua pepe hii tayari ipo.",
  "Send sign-in details as a JSON object.": "Tuma maelezo ya kuingia kama data ya JSON.",
  "Incorrect email or password.": "Barua pepe au kaulisiri si sahihi.",
  "The request could not be completed.": "Ombi halikuweza kukamilishwa.",
  "The account service is unavailable. Your on-device records remain available.": "Huduma ya akaunti haipatikani. Rekodi zako kwenye kifaa bado zinapatikana.",
  "← Prepare": "← Jitayarishe",
};

function text(value, data) {
  return data?.language === "Kiswahili" ? (swahili[value] || value) : value;
}

function AuthForm({ mode, data }) {
  const isRegister = mode === "register";
  const { login, register } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const destination = location.state?.from?.pathname || searchParams.get("next");
  const nextPath = destination?.startsWith("/app/") ? destination : "/app/profile";

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(text(requestError.message, data));
    } finally {
      setBusy(false);
      setPassword("");
    }
  };

  return (
    <main className="account-page">
      <Link className="back" to="/app">{text("← Back to Jalia", data)}</Link>
      <section className="account-panel">
        <span className="eyebrow">{text("JALIA ACCOUNT", data)}</span>
        <h1>{text(isRegister ? "Create your account" : "Sign in to Jalia", data)}</h1>
        <p className="muted">{text("Learning, local tracking, and appointment preparation are available without signing in. An account is only needed for encrypted backup and sharing your own summary.", data)}</p>
        <form className="account-form" onSubmit={submit}>
          {isRegister && (
            <label>
              {text("Name", data)}
              <input autoComplete="name" maxLength="120" required value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          )}
          <label>
            {text("Email", data)}
            <input autoComplete="email" type="email" maxLength="254" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            {text("Passphrase", data)}
            <input
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 12 : undefined}
              maxLength="256"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegister && <small>{text("Use at least 12 characters. You will need this passphrase to restore encrypted backups.", data)}</small>}
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button className="btn primary wide" type="submit" disabled={busy}>
            {text(busy ? "Please wait…" : isRegister ? "Create account" : "Sign in", data)}
          </button>
        </form>
        <p className="account-switch">
          {text(isRegister ? "Already have an account?" : "New to Jalia?", data)}{" "}
          <Link to={`${isRegister ? "/login" : "/register"}${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next"))}` : ""}`}>
            {text(isRegister ? "Sign in" : "Create an account", data)}
          </Link>
        </p>
        <p className="account-privacy">{text("Your symptom records stay on this device unless you deliberately create an encrypted backup.", data)}</p>
      </section>
    </main>
  );
}

export function LoginPage({ data }) {
  return <AuthForm mode="login" data={data} />;
}

export function RegisterPage({ data }) {
  return <AuthForm mode="register" data={data} />;
}

export function AccountPage({ data, setData }) {
  const { user, status, logout } = useAccount();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const signOut = async () => {
    setError("");
    try {
      await logout();
      setMessage(text("You are signed out. Your on-device health records have not been removed.", data));
    } catch (requestError) {
      setError(text(requestError.message, data));
    }
  };

  return (
    <div className="account-page account-settings">
      <span className="eyebrow">{text("PROFILE", data)}</span>
      <h1>{text("Your Jalia account", data)}</h1>
      <p className="muted">{text("Learning and personal tracking remain available when you are signed out.", data)}</p>
      {user ? (
        <section className="account-panel">
          <h2>{text("Signed in as", data)} {user.name}</h2>
          <p>{user.email}</p>
          <p>{data.pain.length + data.periods.length + data.symptoms.length} {text("personal entries remain saved on this device.", data)}</p>
          <Link className="btn primary wide" to="/app/account/backup">{text("Manage encrypted backup", data)}</Link>
          <button className="btn secondary wide" type="button" onClick={signOut}>{text("Sign out", data)}</button>
          {message && <p className="account-success" role="status">{text(message, data)}</p>}
          {error && <p className="account-error" role="alert">{error}</p>}
        </section>
      ) : (
        <section className="account-panel">
          <h2>{text(status === "unavailable" ? "Account service unavailable" : "You are using Jalia as a guest", data)}</h2>
          <p>{text("Explore learning, track symptoms on this device, and prepare for an appointment without an account.", data)}</p>
          <p>{text("Sign in when you want to create or restore an encrypted backup, or share your own appointment summary.", data)}</p>
          {status === "unavailable" && <p className="account-error" role="status">{text("The account service could not be reached. Guest features are still available.", data)}</p>}
          <Link className="btn primary wide" to="/login">{text("Sign in", data)}</Link>
          <Link className="btn secondary wide" to="/register">{text("Create an account", data)}</Link>
        </section>
      )}
      <section className="account-panel">
        <h2>{text("Preferences", data)}</h2>
        <button className="card setting" type="button" onClick={() => setData({ ...data, lowData: !data.lowData })}>
          <span><b>{text("Low-data mode", data)}</b><small>{text("Text-first, no autoplay, and lighter media.", data)}</small></span>
          <strong>{data.lowData ? "ON" : "OFF"}</strong>
        </button>
        <button
          className="card setting"
          type="button"
          onClick={() => setData({ ...data, language: data.language === "English" ? "Kiswahili" : "English" })}
        >
          <span><b>{text("Language", data)}</b><small>{text("Choose English or Kiswahili.", data)}</small></span>
          <strong>{data.language}</strong>
        </button>
      </section>
      <section className="account-panel">
        <h2>{text("Privacy", data)}</h2>
        <p>{text("On-device tracking entries:", data)} {data.pain.length + data.periods.length + data.symptoms.length}</p>
        <p>{text("Your personal health entries stay in this browser unless you explicitly create an encrypted backup. Signing out does not delete this device's records.", data)}</p>
      </section>
    </div>
  );
}

function BackupPanel({ data, setData }) {
  const { user } = useAccount();
  const [backup, setBackup] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/backup")
      .then((result) => {
        if (active) setBackup(result.backup);
      })
      .catch((requestError) => {
        if (active) setError(text(requestError.message, data));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const saveBackup = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const encrypted = await encryptBackup(data, password, backup?.salt);
      const result = await api.put("/backup", encrypted);
      setBackup({ ...encrypted, updated_at: result.updatedAt });
      setMessage(text("Encrypted backup saved. The server receives ciphertext, not your health-record contents.", data));
    } catch (requestError) {
      setError(text(requestError.message, data));
    } finally {
      setBusy(false);
      setPassword("");
    }
  };

  const restoreBackup = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const restored = await decryptBackup(backup, password);
      if (!isValidJaliaBackup(restored)) {
        throw new Error(text("This backup does not contain a valid Jalia health record.", data));
      }
      if (!window.confirm(text("Restore this backup and replace the health records currently on this device? This cannot be undone.", data))) {
        return;
      }
      setData({ ...data, ...restored });
      setMessage(text("Backup restored to this device.", data));
    } catch (requestError) {
      setError(requestError.name === "OperationError" || requestError.name === "SyntaxError"
        ? text("Could not decrypt this backup. Check your account passphrase and try again.", data)
        : text(requestError.message, data));
    } finally {
      setBusy(false);
      setPassword("");
    }
  };

  if (!user) {
    return (
      <div className="account-page">
        <Link className="back" to="/app/profile">{text("← Profile", data)}</Link>
        <section className="account-panel">
          <span className="eyebrow">{text("ACCOUNT FEATURE", data)}</span>
          <h1>{text("Encrypted health backup", data)}</h1>
          <p>{text("Guest learning and on-device tracking do not need an account. Sign in to save or restore an encrypted backup.", data)}</p>
          <Link className="btn primary wide" to="/login?next=%2Fapp%2Faccount%2Fbackup">{text("Sign in", data)}</Link>
          <Link className="btn secondary wide" to="/register?next=%2Fapp%2Faccount%2Fbackup">{text("Create an account", data)}</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="account-page">
      <Link className="back" to="/app/profile">{text("← Profile", data)}</Link>
      <section className="account-panel">
        <span className="eyebrow">{text("ACCOUNT BACKUP", data)}</span>
        <h1>{text("Encrypted health backup", data)}</h1>
        <p>{text("Backup is optional. Your records are encrypted in this browser with your account passphrase before anything is sent. The server stores ciphertext only.", data)}</p>
        <p className="account-privacy">{text("If you forget this passphrase, Jalia cannot decrypt or recover the backup. Keep it private and do not reuse a passphrase you use elsewhere.", data)}</p>
        {loading ? <p role="status">{text("Checking for a backup…", data)}</p> : backup ? (
          <p role="status">{data.language === "Kiswahili" ? "Nakala rudufu ipo" : "A backup exists"}{backup.updated_at ? ` · ${data.language === "Kiswahili" ? "imehifadhiwa mara ya mwisho" : "last saved"} ${new Date(backup.updated_at).toLocaleString()}` : ""}.</p>
        ) : <p role="status">{text("No encrypted backup exists yet.", data)}</p>}
        <form className="account-form" onSubmit={saveBackup}>
          <label>
            {text("Account passphrase", data)}
            <input autoComplete="current-password" maxLength="256" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="btn primary wide" type="submit" disabled={busy || loading}>
            {text(busy ? "Please wait…" : backup ? "Update encrypted backup" : "Create encrypted backup", data)}
          </button>
        </form>
        {backup && (
          <button className="btn secondary wide" type="button" disabled={busy || loading || !password} onClick={restoreBackup}>
            {text("Restore backup to this device", data)}
          </button>
        )}
        {message && <p className="account-success" role="status">{message}</p>}
        {error && <p className="account-error" role="alert">{error}</p>}
      </section>
    </div>
  );
}

export function BackupPage(props) {
  const { user, status } = useAccount();
  if (status === "checking") return <div className="account-page" role="status">{text("Checking account…", props.data)}</div>;
  if (!user && status === "unavailable") {
    return (
      <div className="account-page">
        <section className="account-panel">
          <h1>{text("Account service unavailable", props.data)}</h1>
          <p>{text("Your learning and on-device records remain available. Try again when you can connect to the account service.", props.data)}</p>
          <Link className="btn secondary wide" to="/app/profile">{text("Back to profile", props.data)}</Link>
        </section>
      </div>
    );
  }
  return <BackupPanel {...props} />;
}

export function AppointmentReport({ data }) {
  const { user } = useAccount();
  const [shareMessage, setShareMessage] = useState("");
  const [shareError, setShareError] = useState("");
  const entryCount = data.pain.length + data.periods.length + data.symptoms.length;

  const shareSummary = async () => {
    const questions = (data.questions || []).map((question) => `• ${question}`).join("\n");
    const summary = [
      text("Jalia patient-generated appointment summary", data),
      `${text("Pain entries", data)}: ${data.pain.length}`,
      `${text("Period entries", data)}: ${data.periods.length}`,
      `${text("Symptom entries", data)}: ${data.symptoms.length}`,
      questions ? `${text("Questions:", data)}\n${questions}` : "",
      text("This is not a medical diagnosis.", data),
    ].filter(Boolean).join("\n");
    setShareError("");
    try {
      if (navigator.share) {
        await navigator.share({ title: text("Jalia appointment summary", data), text: summary });
        setShareMessage(text("Summary shared using your device's share controls.", data));
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
        setShareMessage(text("Summary copied. Choose where you want to share it.", data));
      } else {
        throw new Error(text("Sharing is not available in this browser.", data));
      }
    } catch (error) {
      if (error.name !== "AbortError") setShareError(text(error.message, data));
    }
  };

  return (
    <div className="account-page account-report">
      <Link className="back" to="/app/prepare">{text("← Prepare", data)}</Link>
      <article className="account-panel report">
        <div className="report-head"><b>Jalia Healthcare</b><span>{text("Appointment summary", data)}</span></div>
        <h1>{text("Recorded history", data)}</h1>
        <p>{text("Pain entries:", data)} {data.pain.length}</p>
        <p>{text("Period entries:", data)} {data.periods.length}</p>
        <p>{text("Symptom entries:", data)} {data.symptoms.length}</p>
        <p>{entryCount} {text("personal entries are included in this summary.", data)}</p>
        <h2>{text("Questions", data)}</h2>
        {(data.questions || []).length
          ? data.questions.map((question, index) => <p key={`${index}-${question}`}>• {question}</p>)
          : <p>{text("No questions added yet.", data)}</p>}
        <div className="notice">{text("Patient-generated health summary — not a medical diagnosis.", data)}</div>
      </article>
      <div className="account-actions">
        <button className="btn primary" type="button" onClick={() => window.print()}>{text("Print / Save PDF", data)}</button>
        {user ? (
          <button className="btn secondary" type="button" onClick={shareSummary}>{text("Share my summary", data)}</button>
        ) : (
          <Link className="btn secondary" to="/login?next=%2Fapp%2Fprepare%2Freport">{text("Sign in to share my summary", data)}</Link>
        )}
      </div>
      {shareMessage && <p className="account-success" role="status">{shareMessage}</p>}
      {shareError && <p className="account-error" role="alert">{shareError}</p>}
    </div>
  );
}
