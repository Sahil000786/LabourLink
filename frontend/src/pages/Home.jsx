import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="ll-hero">
      {/* HERO */}
      <div className="ll-hero-main">
        <div className="ll-hero-text">
          <h1 className="ll-hero-title">
            Find trusted labour or your next local job in minutes.
          </h1>
          <p className="ll-hero-sub">
            LabourLink connects workers and recruiters nearby with clear job
            details, no middlemen. See wages, location and job type in one
            place – then connect instantly.
          </p>

          <div className="ll-hero-buttons">
            <button
              className="ll-btn ll-btn-primary ll-btn-lg"
              onClick={() => navigate("/register-worker")}
            >
              I am a Worker
            </button>
            <button
              className="ll-btn ll-btn-outline ll-btn-lg"
              onClick={() => navigate("/register-recruiter")}
            >
              I am a Recruiter
            </button>
          </div>

          <div className="ll-hero-badges">
            <span>✅ No agency commission</span>
            <span>📍 Hyper-local jobs</span>
            <span>⭐ Ratings & feedback</span>
          </div>
        </div>

        {/* Animated hero card */}
        <div className="ll-hero-card">
          <div className="ll-hero-chip">Live today</div>
          <div className="ll-hero-card-header">
            8 new electrician jobs in Jaipur
          </div>
          <div className="ll-hero-card-body">
            <div className="ll-chip-row" style={{ marginBottom: 8 }}>
              <span className="ll-chip-pill">₹700 – ₹1,000 / day</span>
              <span className="ll-chip-pill">Daily & monthly</span>
            </div>
            <p>
              Workers nearby can see these openings in their dashboard and
              apply with one tap. Recruiters can shortlist, chat and mark
              workers as hired.
            </p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="ll-home-section">
        <h2>How LabourLink works</h2>
        <p className="ll-card-sub" style={{ marginBottom: 10 }}>
          Simple 3-step flow for both workers and recruiters.
        </p>

        <div className="ll-home-steps">
          <div className="ll-step-card">
            <div className="ll-step-number">1</div>
            <h3 style={{ marginBottom: 4 }}>Create your account</h3>
            <p className="ll-card-sub">
              Sign up as a worker or recruiter with basic details and your
              mobile number. Tell us your skills, location and languages.
            </p>
          </div>

          <div className="ll-step-card">
            <div className="ll-step-number">2</div>
            <h3 style={{ marginBottom: 4 }}>Post or find jobs</h3>
            <p className="ll-card-sub">
              Recruiters post verified openings. Workers see all jobs in one
              place, filter by category, wage and distance and then apply.
            </p>
          </div>

          <div className="ll-step-card">
            <div className="ll-step-number">3</div>
            <h3 style={{ marginBottom: 4 }}>Connect & get hired</h3>
            <p className="ll-card-sub">
              Use in-built chat to clarify details. Recruiters can rate
              workers after hiring, helping others see trusted profiles.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="ll-home-section">
        <h2>Popular categories</h2>
        <p className="ll-card-sub" style={{ marginBottom: 10 }}>
          Quickly browse jobs by skill and location.
        </p>

        <div className="ll-chip-row">
          <span className="ll-chip-pill">Electrician</span>
          <span className="ll-chip-pill">Plumber</span>
          <span className="ll-chip-pill">Carpenter</span>
          <span className="ll-chip-pill">Welder</span>
          <span className="ll-chip-pill">Painter</span>
          <span className="ll-chip-pill">Helper / Loader</span>
          <span className="ll-chip-pill">Construction labour</span>
        </div>
      </section>

      {/* WHY LABOURLINK */}
      <section className="ll-home-section">
        <h2>Why choose LabourLink?</h2>
        <div className="ll-home-steps">
          <div className="ll-step-card">
            <h3 style={{ marginBottom: 4 }}>Transparent wages</h3>
            <p className="ll-card-sub">
              See clear daily / monthly wage information before you apply. No
              hidden terms, no surprise cuts.
            </p>
          </div>
          <div className="ll-step-card">
            <h3 style={{ marginBottom: 4 }}>Verified recruiters</h3>
            <p className="ll-card-sub">
              Recruiters maintain profiles and get feedback from workers,
              building trust on both sides.
            </p>
          </div>
          <div className="ll-step-card">
            <h3 style={{ marginBottom: 4 }}>Ratings & documents</h3>
            <p className="ll-card-sub">
              Workers can upload ID / certificate proofs. Recruiters can rate
              hired workers, which helps them stand out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
