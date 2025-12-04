import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../api/profileApi";

const RecruiterProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    companyType: "",
    website: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setForm({
          companyName: data.companyName || "",
          companyAddress: data.companyAddress || "",
          companyType: data.companyType || "",
          website: data.website || "",
          bio: data.bio || "",
        });
      } catch (err) {
        console.error("Load recruiter profile error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form };
      await updateMyProfile(payload);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Update recruiter profile error:", err);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading profile...</div>;
  }

  return (
    <div className="ll-card" style={{ maxWidth: 780, margin: "0 auto" }}>
      <div className="ll-card-header">
        <div>
          <div className="ll-card-title">Recruiter Profile</div>
          <div className="ll-card-sub">
            Share details about your business to build trust with workers.
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, marginBottom: 18 }}>
        Logged in as <strong>{user?.name}</strong> ({user?.email})
      </p>

      <form className="ll-form" onSubmit={handleSubmit}>
        <div className="ll-field">
          <label className="ll-label">Company / shop name</label>
          <input
            className="ll-input"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. Kamboj Construction Works"
          />
        </div>

        <div className="ll-field">
          <label className="ll-label">Business address</label>
          <input
            className="ll-input"
            name="companyAddress"
            value={form.companyAddress}
            onChange={handleChange}
            placeholder="Street, area, city"
          />
        </div>

        <div className="ll-field">
          <label className="ll-label">Type of work / business</label>
          <input
            className="ll-input"
            name="companyType"
            value={form.companyType}
            onChange={handleChange}
            placeholder="e.g. Civil contractor, home repairs"
          />
        </div>

        <div className="ll-field">
          <label className="ll-label">Website (optional)</label>
          <input
            className="ll-input"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="ll-field">
          <label className="ll-label">Short note for workers</label>
          <textarea
            className="ll-textarea"
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            placeholder="Explain what kind of work you offer and expectations."
          />
        </div>

        {message && (
          <div style={{ color: "#2563eb", fontSize: 13 }}>{message}</div>
        )}

        <button
          className="ll-btn ll-btn-primary"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default RecruiterProfile;
