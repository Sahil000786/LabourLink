import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const SettingsPage = () => {
  const { lang, changeLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [availability, setAvailability] = useState("full-time");

  useEffect(() => {
    const storedNoti = localStorage.getItem("labourlink_notifications");
    if (storedNoti === "off") setNotifications(false);

    const storedAvail = localStorage.getItem("labourlink_availability");
    if (storedAvail) setAvailability(storedAvail);
  }, []);

  const save = () => {
    localStorage.setItem(
      "labourlink_notifications",
      notifications ? "on" : "off"
    );
    localStorage.setItem("labourlink_availability", availability);
    alert("Settings saved (stored locally in this demo).");
  };

  return (
    <div className="ll-card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="ll-card-header">
        <div>
          <div className="ll-card-title">Settings</div>
          <div className="ll-card-sub">
            Control language, notifications, and availability.
          </div>
        </div>
      </div>

      <div className="ll-form">
        <div className="ll-field">
          <label className="ll-label">Language</label>
          <select
            className="ll-input"
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="ll-field">
          <label className="ll-label">Availability</label>
          <select
            className="ll-input"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="full-time">Available full time</option>
            <option value="part-time">Part time</option>
            <option value="weekends">Weekends only</option>
            <option value="not-available">Currently not available</option>
          </select>
        </div>

        <div className="ll-field">
          <label className="ll-label">Notifications</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span>Show in-app notifications and tips</span>
          </label>
        </div>

        <button className="ll-btn ll-btn-primary" onClick={save}>
          Save settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
