const Contact = () => {
  return (
    <div className="ll-card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="ll-card-header">
        <div>
          <div className="ll-card-title">Contact us</div>
          <div className="ll-card-sub">
            Have feedback or need support? Send us a quick message.
          </div>
        </div>
      </div>

      <form
        className="ll-form"
        onSubmit={(e) => {
          e.preventDefault();
          alert(
            "This is a demo form – in production this would send an email / ticket."
          );
        }}
      >
        <div className="ll-field">
          <label className="ll-label">Your name</label>
          <input className="ll-input" required />
        </div>

        <div className="ll-field">
          <label className="ll-label">Email</label>
          <input className="ll-input" type="email" required />
        </div>

        <div className="ll-field">
          <label className="ll-label">Message</label>
          <textarea className="ll-textarea" rows={4} required />
        </div>

        <button className="ll-btn ll-btn-primary" type="submit">
          Send message
        </button>
      </form>
    </div>
  );
};

export default Contact;
