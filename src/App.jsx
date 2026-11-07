import React, { useState } from "react";

const topics = [
  ["01", "Understanding Your Unconscious Self", "Explore conditioning, unmet emotional needs, past hurts, fears, expectations and unconscious behaviours.", "What is happening within me?"],
  ["02", "Understanding Your Relationship Patterns", "Recognize recurring emotional experiences, attachments and familiar patterns across relationships.", "Why do I keep experiencing similar things?"],
  ["03", "Making Conscious Relationship Choices", "Explore self-worth, boundaries, individuality and choices rooted in genuine needs rather than fear.", "How can I choose differently?"],
  ["04", "Building Conscious Relationships", "Understand mutual effort, communication, repair, trust, emotional safety and respect for individuality.", "How can I relate to others more consciously?"]
];

export default function App() {
  const [form, setForm] = useState({ name: "", consultingFor: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function requestOtp() {
    setMessage("");
    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.trim())) return setMessage("Enter a valid phone number with country code if needed.");
    setBusy(true);
    try {
      const r = await fetch("/api/request-otp", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ phone: form.phone }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not send OTP.");
      setOtpSent(true);
      setMessage(data.message || "OTP sent. Check your phone.");
      if (data.demoOtp) setMessage(`Demo mode: your OTP is ${data.demoOtp}`);
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  }

  async function verifyOtp() {
    setBusy(true); setMessage("");
    try {
      const r = await fetch("/api/verify-otp", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ phone: form.phone, otp }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "OTP verification failed.");
      setVerified(true); setMessage("Phone number verified successfully.");
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  }

  async function payNow(e) {
    e.preventDefault(); setMessage("");
    if (!verified) return setMessage("Please verify your phone number first.");
    if (!consent) return setMessage("Please confirm that you agree to be contacted about this consultation.");
    if (!form.name.trim() || !form.consultingFor || !form.email.trim()) return setMessage("Please complete all required fields.");
    setBusy(true);
    try {
      const r = await fetch("/api/create-order", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ amount: 999, currency: "INR", customer: form }) });
      const order = await r.json();
      if (!r.ok) throw new Error(order.error || "Could not create payment order.");
      if (!window.Razorpay) throw new Error("Payment checkout could not load. Refresh and try again.");
      const checkout = new window.Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency, name: "Relationship Consciousness",
        description: "1:1 Relationship Consciousness Guidance", order_id: order.id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#8a5d50" },
        handler: async (response) => {
          const verify = await fetch("/api/verify-payment", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ...response, customer: form }) });
          const result = await verify.json();
          if (verify.ok && result.success) { setPaymentReady(true); setMessage("Payment successful. Your consultation request has been received."); }
          else setMessage(result.error || "Payment verification failed. Please contact support before retrying.");
        }
      });
      checkout.on("payment.failed", () => setMessage("Payment was not completed. You can try again."));
      checkout.open();
    } catch (e) { setMessage(e.message); }
    finally { setBusy(false); }
  }

  return <div className="site-shell">
    <nav className="nav"><a className="brand" href="#top"><span className="brand-mark">✳</span> relationship consciousness</a><a href="#consult" className="nav-cta">Book a consultation <span>↗</span></a></nav>
    <main id="top">
      <section className="hero">
        <div className="eyebrow"><span></span> 1:1 PERSONAL GUIDANCE</div>
        <h1>Understand yourself.<br/><em>Choose consciously.</em></h1>
        <p className="hero-copy">A guided journey into understanding yourself, your relationship patterns, and the inner experiences that influence the way you connect with others.</p>
        <a className="primary-link" href="#consult">Begin your journey <span>↓</span></a>
        <div className="hero-note">A space for reflection, awareness and meaningful change.</div>
        <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
      </section>

      <section className="intro section-wrap">
        <div className="section-kicker">THE APPROACH</div>
        <div className="intro-grid"><h2>Relationships begin<br/>with the <em>inner world.</em></h2>
          <div><p>Relationships are not just about whom we choose or how another person treats us. They are also influenced by our emotional needs, past experiences, fears, conditioning, beliefs and expectations.</p>
          <p>This guidance helps you look within yourself before focusing entirely on the other person. By becoming aware of your emotional experiences and learned patterns, you can understand why certain experiences repeat and how your inner world influences the way you relate.</p></div>
        </div>
      </section>

      <section className="explore section-wrap">
        <div className="section-kicker">WHAT YOU WILL EXPLORE</div>
        <h2>Four steps toward <em>awareness.</em></h2>
        <div className="topic-grid">{topics.map(([n,title,desc,q]) => <article className="topic" key={n}>
          <div className="topic-number">{n}</div><h3>{title}</h3><p>{desc}</p><div className="core"><span>CORE QUESTION</span><strong>{q}</strong></div>
        </article>)}</div>
      </section>

      <section className="journey">
        <div className="section-wrap journey-inner"><div><div className="section-kicker light">YOUR JOURNEY</div><h2>From awareness<br/>to <em>connection.</em></h2></div>
          <div className="journey-list">{[["01","Understand yourself","Become aware of your inner world, emotional needs, fears and conditioning."],["02","Recognize your patterns","Understand repeated experiences, attachments and unconscious behaviours."],["03","Choose consciously","Make relationship choices based on genuine needs, values and self-respect."],["04","Relate consciously","Build relationships through mutual understanding, responsibility and respect."]].map(([n,t,d])=><div className="journey-row" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>
        </div>
      </section>

      <section className="principles section-wrap">
        <div className="section-kicker">THE CORE PURPOSE</div><h2>Understand your part.<br/><em>Respect what isn't yours.</em></h2>
        <p className="principle-copy">This journey is not about blaming yourself for your relationship experiences or making yourself responsible for another person's behaviour. It is about understanding your part, recognizing what is within your control, respecting what is not, and developing the awareness to make different choices.</p>
        <div className="values">{["Mutual effort","Honesty & transparency","Emotional safety","Healthy boundaries","Conflict repair","Individuality","Self-respect","Trust & consistency"].map(v=><span key={v}>{v}</span>)}</div>
        <blockquote>“When you understand yourself, you begin to understand your relationship choices. When you recognize your patterns, you gain the freedom to choose differently.”</blockquote>
      </section>

      <section className="consult-section" id="consult"><div className="consult-layout">
        <div className="consult-copy"><div className="section-kicker light">TAKE THE FIRST STEP</div><h2>Your journey starts<br/>with <em>one conversation.</em></h2>
          <p>Share a few details to request your 1:1 Relationship Consciousness Guidance session.</p>
          <div className="session-card"><span>CONSULTATION FEE</span><strong>₹999</strong><small>One-time introductory session · Update the fee in the project settings before launch.</small></div>
          <p className="secure-note">Your details are used only to process your consultation request and contact you about the session.</p>
        </div>
        <form className="consult-form" onSubmit={payNow}>
          <div className="form-heading"><span>CONSULTANCY FORM</span><h3>Let's get to know you.</h3></div>
          <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" required /></label>
          <label>Consulting for<select name="consultingFor" value={form.consultingFor} onChange={update} required><option value="">Choose a focus area</option><option>Understanding myself</option><option>Understanding my relationship patterns</option><option>Making a relationship decision</option><option>Building a conscious relationship</option><option>General relationship guidance</option></select></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
          <label>Phone number<div className="phone-row"><input name="phone" type="tel" value={form.phone} onChange={e=>{update(e);setVerified(false);setOtpSent(false);}} placeholder="+91 98765 43210" required/><button type="button" className="outline-btn" onClick={requestOtp} disabled={busy}>{otpSent ? "Resend OTP" : "Get OTP"}</button></div></label>
          {otpSent && <label>Enter OTP<div className="phone-row"><input value={otp} onChange={e=>setOtp(e.target.value)} inputMode="numeric" maxLength="6" placeholder="6-digit OTP"/><button type="button" className="outline-btn" onClick={verifyOtp} disabled={busy || otp.length !== 6}>Verify</button></div></label>}
          {verified && <div className="verified">✓ Phone number verified</div>}
          <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree to be contacted regarding this consultation and understand this is a guidance service, not mental-health or crisis treatment.</span></label>
          <button className="pay-btn" type="submit" disabled={busy || paymentReady}>{busy ? "Please wait…" : paymentReady ? "Request received ✓" : "Continue to secure payment · ₹999"} <span>↗</span></button>
          {message && <p className="form-message" role="status">{message}</p>}
          <p className="form-foot">Payments are processed securely by Razorpay. Do not share your OTP with anyone.</p>
        </form>
      </div></section>
    </main>
    <footer><a className="brand" href="#top"><span className="brand-mark">✳</span> relationship consciousness</a><span>Understand yourself. Recognize your patterns. Choose consciously.</span><span>© {new Date().getFullYear()}</span></footer>
    <script async src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </div>;
}
