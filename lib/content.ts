export type Language = "en" | "np";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Initial section
    "initial.subtitle": "Uniting nation\nto solve problems together.",
    "initial.title":
      "Where Solutions to\nProblems are Driven by\nYou the People.",
    "initial.description1":
      "Rastra Pariwartan Abhiyan turns public participation into real progress by giving every citizen a structured way to raise issues, refine solutions, and shape the nation's priorities",
    "initial.description2":
      "Verified voices from all 77 districts come together in one transparent space where ideas evolve through open collaboration.",
    "initial.campaign": "Rastra Ekikaran Abhiyan",
    "initial.cta": "tap/click anywhere to begin.",

    // Layout navigation
    "nav.campaign": "Rastra Ekikaran Abhiyan",
    "nav.tagline": "By the people, For the Nation.",
    "nav.submitAgenda": "Submit an Agenda.",
    "nav.signIn": "Sign In / Register",
    "nav.profile": "Profile",
    "nav.logout": "Logout",

    // Tabs
    "tabs.rastriyaAgenda": "Rastriya-Agenda",
    "tabs.districtLevelAgenda": "District-Level Agenda",
    "tabs.fakeNews": "Fake News",
    "tabs.announcements": "Announcements",

    // Sub-navigation
    "subnav.selectDistrict": "Select District",
    "subnav.placeholder": "Select District",
    "subnav.shareNow": "Share Now",
    "subnav.keepMeNotified": "Keep me notified",

    // Overlays
    "overlay.signIn": "Sign In",
    "overlay.signUp": "Sign Up",
    "overlay.submitAgenda": "Submit Agenda",
  },
  np: {
    // Initial section
    "initial.subtitle": "राष्ट्रलाई एकीकृत गरी\nसमस्या समाधान गरौँ।",
    "initial.title":
      "समाधान जहाँ आमजनताले\nसंचालित गर्दछ\nसमस्यालाई समाधान गर्न।",
    "initial.description1":
      "राष्ट्र परिवर्तन अभियान जनता सहभागितालाई वास्तविक प्रगतिमा परिणत गर्दछ र प्रत्येक नागरिकलाई समस्या उठाउन, समाधान परिष्कार गर्न र राष्ट्रको प्राथमिकता तय गर्न संरचित तरिका प्रदान गर्दछ।",
    "initial.description2":
      "सबै ७७ जिल्लाका सत्यापित आवाजहरू एक स्वच्छ स्थानमा एकत्रित हुन्छन् जहाँ विचारहरू खुला सहयोगको माध्यमबाट विकसित हुन्छन्।",
    "initial.campaign": "राष्ट्र एकीकरण अभियान",
    "initial.cta": "शुरु गर्न कहीं पनि टपलगाउनुहोस्।",

    // Layout navigation
    "nav.campaign": "राष्ट्र एकीकरण अभियान",
    "nav.tagline": "जनताको लागि, राष्ट्रको लागि।",
    "nav.submitAgenda": "एजेन्डा बुझाउनुहोस्।",
    "nav.signIn": "साइन इन / दर्ता गर्नुहोस्",
    "nav.profile": "प्रोफाइल",
    "nav.logout": "लगआउट",

    // Tabs
    "tabs.rastriyaAgenda": "राष्ट्रिय एजेन्डा",
    "tabs.districtLevelAgenda": "जिल्ला स्तरको एजेन्डा",
    "tabs.fakeNews": "झूठो समाचार",
    "tabs.announcements": "घोषणा",

    // Sub-navigation
    "subnav.selectDistrict": "जिल्ला चयन गर्नुहोस्",
    "subnav.placeholder": "जिल्ला चयन गर्नुहोस्",
    "subnav.shareNow": "अहिले साझा गर्नुहोस्",
    "subnav.keepMeNotified": "मलाई सूचित राख्नुहोस्",

    // Overlays
    "overlay.signIn": "साइन इन",
    "overlay.signUp": "दर्ता गर्नुहोस्",
    "overlay.submitAgenda": "एजेन्डा बुझाउनुहोस्",
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language][key] || translations.en[key] || key;
}
