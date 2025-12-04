import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "labourlink_worker_profile";

const WorkerProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    about: "",
    skills: "",
    experienceYears: "",
    availability: "full-time",
    documents: [],
    isCertified: false,
  });

  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    alert("Profile saved (locally for this demo).");
  };

  const addDocument = () => {
    if (!docName.trim() || !docUrl.trim()) return;
    const nextDocs = [
      ...profile.documents,
      { name: docName.trim(), url: docUrl.trim() },
    ];
    setProfile((prev) => ({ ...prev, documents: nextDocs }));
    setDocName("");
    setDocUrl("");
  };

  const removeDocument = (index) => {
    const nextDocs = profile.documents.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, documents: nextDocs }));
  };

  return (
    <div className="ll-dashboard-main-only">
      <div className="ll-card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="ll-card-header">
          <div>
            <div className="ll-card-title">Tell us about yourself</div>
            <div className="ll-card-sub">
              Complete your worker profile so recruiters can quickly
              understand your skills.
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </div>
        </div>

        <div className="ll-form">
          <div className="ll-field">
            <label className="ll-label">About you</label>
            <textarea
              className="ll-textarea"
              rows={3}
              value={profile.about}
              onChange={(e) =>
                setProfile((p) => ({ ...p, about: e.target.value }))
              }
              placeholder="Example: I have 4 years of experience as an electrician working on residential and commercial sites..."
            />
          </div>

          <div className="ll-field">
            <label className="ll-label">Skills</label>
            <input
              className="ll-input"
              value={profile.skills}
              onChange={(e) =>
                setProfile((p) => ({ ...p, skills: e.target.value }))
              }
              placeholder="Example: Wiring, motor repair, safety checks, drilling..."
            />
            <div className="ll-help-text">
              Separate skills with commas. These will be highlighted on your
              profile.
            </div>
          </div>

          <div className="ll-filter-group">
            <div className="ll-field">
              <label className="ll-label">Years of experience</label>
              <input
                className="ll-input"
                type="number"
                value={profile.experienceYears}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, experienceYears: e.target.value }))
                }
                placeholder="e.g. 3"
              />
            </div>

            <div className="ll-field">
              <label className="ll-label">Availability</label>
              <select
                className="ll-input"
                value={profile.availability}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, availability: e.target.value }))
                }
              >
                <option value="full-time">Full time</option>
                <option value="part-time">Part time</option>
                <option value="weekends">Weekends only</option>
                <option value="not-available">Not currently available</option>
              </select>
            </div>

            <div className="ll-field">
              <label className="ll-label">Certified worker</label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={profile.isCertified}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, isCertified: e.target.checked }))
                  }
                />
                <span>
                  I have training certificates or government approved ID for
                  this work.
                </span>
              </label>
            </div>
          </div>

          <div className="ll-divider" />

          <div className="ll-field">
            <label className="ll-label">Upload documents (links)</label>
            <div className="ll-doc-row">
              <input
                className="ll-input"
                placeholder="Document name (e.g. Skill certificate)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
              <input
                className="ll-input"
                placeholder="Link (Google Drive, etc.)"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
              <button
                type="button"
                className="ll-btn ll-btn-ghost"
                onClick={addDocument}
              >
                Add
              </button>
            </div>

            {profile.documents.length > 0 && (
              <ul className="ll-doc-list">
                {profile.documents.map((doc, index) => (
                  <li key={index}>
                    <a href={doc.url} target="_blank" rel="noreferrer">
                      {doc.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="ll-btn ll-btn-primary"
            type="button"
            onClick={saveProfile}
          >
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
