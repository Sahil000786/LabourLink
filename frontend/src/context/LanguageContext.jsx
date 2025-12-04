import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

const STRINGS = {
  en: {
    appName: "LabourLink",
    navHome: "Home",
    navAbout: "About",
    navContact: "Contact",
    navDashboard: "Dashboard",
    navProfile: "Profile",
    navFindWork: "Find Work",
    heroTitle: "Find trusted labour or your next local job in minutes.",
    heroSubtitle:
      "LabourLink connects workers and recruiters nearby with clear job details, no middlemen.",
    heroWorker: "I am a Worker",
    heroRecruiter: "I am a Recruiter",
    homeHowItWorks: "How it works",
    homeStep1Title: "Create your account",
    homeStep1Text:
      "Sign up as a worker or recruiter with your basic details and mobile number.",
    homeStep2Title: "Post or find jobs",
    homeStep2Text:
      "Recruiters post openings. Workers browse jobs from one simple dashboard.",
    homeStep3Title: "Connect and get hired",
    homeStep3Text:
      "Chat inside LabourLink, manage applications, and confirm the best match.",
    homePopularCategories: "Popular categories",
  },
  hi: {
    appName: "LabourLink",
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navContact: "संपर्क",
    navDashboard: "डैशबोर्ड",
    navProfile: "प्रोफाइल",
    navFindWork: "काम खोजें",
    heroTitle: "विश्वसनीय मजदूर या अपना अगला लोकल काम मिनटों में खोजें।",
    heroSubtitle:
      "LabourLink पास के मजदूरों और रिक्रूटर्स को जोड़ता है, बिना बिचौलिये के।",
    heroWorker: "मैं Worker हूं",
    heroRecruiter: "मैं Recruiter हूं",
    homeHowItWorks: "यह कैसे काम करता है",
    homeStep1Title: "अपना अकाउंट बनाएँ",
    homeStep1Text:
      "Worker या Recruiter के रूप में मोबाइल नंबर और बेसिक जानकारी से साइन-अप करें।",
    homeStep2Title: "जॉब पोस्ट करें या खोजें",
    homeStep2Text:
      "Recruiter जॉब पोस्ट करते हैं, Worker एक ही डैशबोर्ड से जॉब देखते हैं।",
    homeStep3Title: "कनेक्ट हों और हायर हों",
    homeStep3Text:
      "LabourLink के अंदर चैट करें, अप्लिकेशन मैनेज करें और सही मैच चुनें।",
    homePopularCategories: "लोकप्रिय श्रेणियाँ",
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("labourlink_lang");
    if (stored === "hi" || stored === "en") setLang(stored);
  }, []);

  const changeLanguage = (value) => {
    setLang(value);
    localStorage.setItem("labourlink_lang", value);
  };

  const t = (key) => STRINGS[lang][key] || STRINGS.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
