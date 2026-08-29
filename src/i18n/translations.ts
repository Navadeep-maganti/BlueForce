export type LanguageCode = 'en' | 'te' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    findWork: string;
    hireTalent: string;
    trustScore: string;
    howItWorks: string;
    login: string;
    register: string;
    dashboard: string;
    jobs: string;
    candidates: string;
    pipeline: string;
    applications: string;
    profile: string;
    analytics: string;
    verification: string;
    admin: string;
    logout: string;
    voiceSearch: string;
    switchRole: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    findWorkBtn: string;
    hireTalentBtn: string;
    tryDemoBtn: string;
    trustedByWorkers: string;
    activeOpenings: string;
    verifiedCompanies: string;
    trustVerifiedBadge: string;
  };
  problem: {
    tag: string;
    title: string;
    desc: string;
    traditionalTitle: string;
    traditionalDesc: string;
    kaushalTitle: string;
    kaushalDesc: string;
    fromLabel: string;
    toLabel: string;
  };
  trustSignals: {
    title: string;
    subtitle: string;
    identity: string;
    skills: string;
    certifications: string;
    experience: string;
    proofOfWork: string;
    scoreExplanation: string;
  };
  workerDashboard: {
    greeting: string;
    profileStrength: string;
    trustScore: string;
    recommendedJobs: string;
    careerInsights: string;
    unlockJobs: string;
    quickApply: string;
    verified: string;
    applyNow: string;
    viewDetails: string;
    applied: string;
    shortlisted: string;
    interview: string;
    hired: string;
  };
  employerDashboard: {
    overview: string;
    activeJobs: string;
    applications: string;
    shortlisted: string;
    interviews: string;
    hired: string;
    postNewJob: string;
    aiTopCandidates: string;
    viewPipeline: string;
    matchScore: string;
  };
  voiceModal: {
    title: string;
    listening: string;
    clickToSpeak: string;
    samplePrompt: string;
    orTry: string;
    searchResultBtn: string;
    analyzingVoice: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "KaushalConnect",
    tagline: "Skills that get seen. Work that gets trusted.",
    nav: {
      findWork: "Find Work",
      hireTalent: "Hire Talent",
      trustScore: "Trust Score",
      howItWorks: "How it Works",
      login: "Sign In",
      register: "Get Started",
      dashboard: "Dashboard",
      jobs: "Jobs",
      candidates: "Candidates",
      pipeline: "Pipeline",
      applications: "My Applications",
      profile: "Identity Profile",
      analytics: "Analytics",
      verification: "Verification Hub",
      admin: "Admin Control",
      logout: "Log Out",
      voiceSearch: "Voice Search",
      switchRole: "Switch View"
    },
    hero: {
      badge: "India's First Verified Skill & Proof-of-Work Platform",
      headline: "Turn your skills into",
      headlineHighlight: "verified opportunities.",
      subheadline: "Build a trusted professional identity, discover high-paying industrial jobs, and get recognized for the work you can actually prove.",
      findWorkBtn: "Find Work (Worker)",
      hireTalentBtn: "Hire Talent (Employer)",
      tryDemoBtn: "Explore Interactive Demo",
      trustedByWorkers: "12,400+ Verified Technicians",
      activeOpenings: "1,850+ Active Openings",
      verifiedCompanies: "420+ Verified Plants & MSMEs",
      trustVerifiedBadge: "Government ID & ITI Verified"
    },
    problem: {
      tag: "The Paradigm Shift",
      title: "Moving Beyond WhatsApp Groups & Middlemen",
      desc: "Traditional blue-collar hiring relies on fragmented referrals, contractor commissions, and unverified word-of-mouth. KaushalConnect replaces guesswork with verified proof.",
      traditionalTitle: "Traditional Hiring",
      traditionalDesc: "\"Who do you know?\" — Informal contractors, fake claims, delayed wages, zero career record.",
      kaushalTitle: "KaushalConnect Platform",
      kaushalDesc: "\"Here's what you can prove.\" — Verified trade credentials, photo work portfolios, direct hiring.",
      fromLabel: "FROM",
      toLabel: "TO"
    },
    trustSignals: {
      title: "Proof → Trust → Match → Work → Progress",
      subtitle: "Every worker builds a portable, tamper-evident digital identity backed by quantifiable trust score metrics.",
      identity: "Government ID Verified",
      skills: "Trade Skill Assessments",
      certifications: "NSDC & ITI Credentials",
      experience: "Employer Verified Tenures",
      proofOfWork: "Photo & Video Work Evidence",
      scoreExplanation: "Transparent 100-Point Trust Formula"
    },
    workerDashboard: {
      greeting: "Good morning, Ramesh",
      profileStrength: "Profile Strength",
      trustScore: "Trust Score",
      recommendedJobs: "AI-Recommended Jobs For You",
      careerInsights: "Career Skill Gap Insights",
      unlockJobs: "You're one skill away from qualifying for 18 more jobs.",
      quickApply: "Quick Apply",
      verified: "Verified",
      applyNow: "Apply Now",
      viewDetails: "View Details",
      applied: "Applied",
      shortlisted: "Shortlisted",
      interview: "Interview",
      hired: "Hired"
    },
    employerDashboard: {
      overview: "Recruitment Overview",
      activeJobs: "Active Jobs",
      applications: "Applications",
      shortlisted: "Shortlisted",
      interviews: "Interviews",
      hired: "Hired Candidates",
      postNewJob: "Post a New Job",
      aiTopCandidates: "AI-Ranked Verified Candidates",
      viewPipeline: "View Kanban Pipeline",
      matchScore: "Match"
    },
    voiceModal: {
      title: "Voice Job Finder",
      listening: "Listening... Speak in English, Telugu, or Hindi",
      clickToSpeak: "Tap microphone to speak",
      samplePrompt: "E.g. 'I need an electrician job near Vijayawada above 25 thousand.'",
      orTry: "Or try a sample voice prompt:",
      searchResultBtn: "Find Matching Jobs",
      analyzingVoice: "Analyzing speech & extracting trade parameters..."
    }
  },
  te: {
    appName: "కౌశల్ కనెక్ట్",
    tagline: "గుర్తింపు పొందే నైపుణ్యాలు. నమ్మకమైన ఉపాధి.",
    nav: {
      findWork: "పని వెతకండి",
      hireTalent: "సిబ్బందిని నియమించండి",
      trustScore: "ట్రస్ట్ స్కోర్",
      howItWorks: "ఇది ఎలా పనిచేస్తుంది",
      login: "లాగిన్",
      register: "ప్రారంభించండి",
      dashboard: "డ్యాష్‌బోర్డ్",
      jobs: "ఉద్యోగాలు",
      candidates: "అభ్యర్థులు",
      pipeline: "పైప్‌లైన్",
      applications: "నా దరఖాస్తులు",
      profile: "ప్రొఫైల్",
      analytics: "విశ్లేషణలు",
      verification: "ధృవీకరణ కేంద్రం",
      admin: "అడ్మిన్",
      logout: "లాగ్ అవుట్",
      voiceSearch: "వాయిస్ శోధన",
      switchRole: "రోల్ మార్చు"
    },
    hero: {
      badge: "భారతదేశపు మొట్టమొదటి ధృవీకరించబడిన నైపుణ్య వేదిక",
      headline: "మీ నైపుణ్యాలను",
      headlineHighlight: "నమ్మకమైన ఉపాధిగా మార్చుకోండి.",
      subheadline: "డిజిటల్ గుర్తింపును నిర్మించుకోండి, సరైన వేతనంతో కూడిన పారిశ్రామిక ఉద్యోగాలను పొందండి.",
      findWorkBtn: "ఉద్యోగం వెతకండి (వర్కర్)",
      hireTalentBtn: "సిబ్బందిని తీసుకోండి (యాజమాన్యం)",
      tryDemoBtn: "డెమో ప్రయత్నించండి",
      trustedByWorkers: "12,400+ ధృవీకరించబడిన నిపుణులు",
      activeOpenings: "1,850+ తాజా ఉద్యోగావకాశాలు",
      verifiedCompanies: "420+ పరిశ్రమలు & సంస్థలు",
      trustVerifiedBadge: "ప్రభుత్వ గుర్తింపు & ITI వెరిఫైడ్"
    },
    problem: {
      tag: "నూతన మార్పు",
      title: "మధ్యవర్తులు లేకుండా ప్రత్యక్ష నియామకాలు",
      desc: "సాంప్రదాయ బ్లూ-కాలర్ నియామకాలు కేవలం పరిచయాలు, మధ్యవర్తుల కమిషన్లపై ఆధారపడతాయి. కౌశల్ కనెక్ట్ ద్వారా ప్రత్యక్ష రుజువుతో ఉద్యోగం పొందండి.",
      traditionalTitle: "పాత పద్ధతి",
      traditionalDesc: "\"మీకు ఎవరు తెలుసు?\" — దళారులు, అబద్ధాలు, ఆలస్యమైన జీతాలు.",
      kaushalTitle: "కౌశల్ కనెక్ట్ వేదిక",
      kaushalDesc: "\"మీరు ఏమి చేయగలరో చూపించండి\" — సర్టిఫికెట్లు, ఫోటో వర్క్ రుజువులు, నేరుగా నియామకం.",
      fromLabel: "నుండి",
      toLabel: "వరకు"
    },
    trustSignals: {
      title: "రుజువు → నమ్మకం → సరైన ఉద్యోగం → పురోగతి",
      subtitle: "ప్రతి కార్మికుడికి నమ్మకమైన మరియు ధృవీకరించబడిన ప్రొఫెషనల్ గుర్తింపు.",
      identity: "ప్రభుత్వ ఐడీ ధృవీకరణ",
      skills: "నైపుణ్య పరీక్షలు",
      certifications: "NSDC & ITI సర్టిఫికెట్లు",
      experience: "కంపెనీ ధృవీకరించిన అనుభవం",
      proofOfWork: "పని యొక్క ఫోటో & వీడియో రుజువులు",
      scoreExplanation: "పారదర్శకమైన 100-పాయింట్ల ట్రస్ట్ స్కోర్"
    },
    workerDashboard: {
      greeting: "శుభోదయం, రమేష్ గారూ",
      profileStrength: "ప్రొఫైల్ పూర్తి శాతం",
      trustScore: "ట్రస్ట్ స్కోర్",
      recommendedJobs: "మీ నైపుణ్యాలకు సరిపడే ఉద్యోగాలు",
      careerInsights: "కెరీర్ వృద్ధి సలహాలు",
      unlockJobs: "మీరు మరో నైపుణ్యం నేర్చుకుంటే 18 అదనపు ఉద్యోగాలకు అర్హత సాధించవచ్చు.",
      quickApply: "సులభంగా దరఖాస్తు చేసుకోండి",
      verified: "ధృవీకరించబడింది",
      applyNow: "దరఖాస్తు చేయండి",
      viewDetails: "వివరాలు చూడండి",
      applied: "దరఖాస్తు చేసారు",
      shortlisted: "ఎంపికయ్యారు",
      interview: "ఇంటర్వ్యూ",
      hired: "ఉద్యోగం లభించింది"
    },
    employerDashboard: {
      overview: "నియామకాల నివేదిక",
      activeJobs: "యాక్టివ్ జాబ్స్",
      applications: "దరఖాస్తులు",
      shortlisted: "షార్ట్‌లిస్ట్",
      interviews: "ఇంటర్వ్యూలు",
      hired: "చేర్చుకున్నవారు",
      postNewJob: "కొత్త ఉద్యోగాన్ని ప్రకటించండి",
      aiTopCandidates: "AI ర్యాంక్ చేసిన నైపుణ్యవంతులు",
      viewPipeline: "కాన్‌బన్ బోర్డ్ చూడండి",
      matchScore: "సరిపోలిక"
    },
    voiceModal: {
      title: "వాయిస్ జాబ్ సెర్చ్",
      listening: "వింటున్నాము... తెలుగు, ఇంగ్లీష్ లేదా హిందీలో మాట్లాడండి",
      clickToSpeak: "మాట్లాడటానికి మైక్ నొక్కండి",
      samplePrompt: "ఉదా: 'విజయవాడ దగ్గర 25 వేల కంటే ఎక్కువ ఎలక్ట్రీషియన్ ఉద్యోగం కావాలి.'",
      orTry: "లేదా ఈ నమూనాను ఎంచుకోండి:",
      searchResultBtn: "ఉద్యోగాలను కనుగొనండి",
      analyzingVoice: "వాయిస్ ప్రాసెస్ అవుతోంది..."
    }
  },
  hi: {
    appName: "कौशल कनेक्ट",
    tagline: "हुनर जिसे पहचान मिले। काम जिस पर भरोसा हो।",
    nav: {
      findWork: "काम ढूंढें",
      hireTalent: "कारीगर नियुक्त करें",
      trustScore: "ट्रस्ट स्कोर",
      howItWorks: "यह कैसे काम करता है",
      login: "लॉग इन",
      register: "शुरू करें",
      dashboard: "डैशबोर्ड",
      jobs: "नौकरियां",
      candidates: "उम्मीदवार",
      pipeline: "पाइपलाइन",
      applications: "मेरी अर्जियां",
      profile: "पहचान प्रोफ़ाइल",
      analytics: "एनालिटिक्स",
      verification: "सत्यापन केंद्र",
      admin: "व्यवस्थापक",
      logout: "लॉग आउट",
      voiceSearch: "वॉइस सर्च",
      switchRole: "रोल बदलें"
    },
    hero: {
      badge: "भारत का पहला प्रमाणित कौशल और प्रूफ-ऑफ-वर्क मंच",
      headline: "अपने हुनर को बनाएं",
      headlineHighlight: "सच्चे अवसरों का आधार।",
      subheadline: "एक विश्वसनीय पेशेवर डिजिटल पहचान बनाएं, सही वेतन वाली औद्योगिक नौकरियां पाएं और अपने काम का सच्चा सम्मान पाएं।",
      findWorkBtn: "काम ढूंढें (कारीगर)",
      hireTalentBtn: "स्टाफ रखें (कंपनी)",
      tryDemoBtn: "लाइव डेमो देखें",
      trustedByWorkers: "12,400+ सत्यापित कुशल कारीगर",
      activeOpenings: "1,850+ सक्रिय पद",
      verifiedCompanies: "420+ सत्यापित फैक्ट्रियां एवं कंपनियां",
      trustVerifiedBadge: "सरकारी पहचान एवं ITI प्रमाणित"
    },
    problem: {
      tag: "नया बदलाव",
      title: "व्हाट्सएप ग्रुप और बिचौलियों से मुक्ति",
      desc: "पारंपरिक भर्ती केवल सिफ़ारिशों और दलालों के भरोसे चलती है। कौशल कनेक्ट अनुमान की जगह सीधे सत्यापित सबूतों पर काम करता है।",
      traditionalTitle: "पारंपरिक तरीका",
      traditionalDesc: "\"आप किसे जानते हैं?\" — ठेकेदार, कमीशन, अधूरी जानकारी और देरी से वेतन।",
      kaushalTitle: "कौशल कनेक्ट",
      kaushalDesc: "\"आप क्या कर सकते हैं उसका सबूत दें\" — ट्रेड सर्टिफिकेट, काम की तस्वीरें और सीधी नौकरी।",
      fromLabel: "पहले",
      toLabel: "अब"
    },
    trustSignals: {
      title: "सबूत → भरोसा → सही मैच → काम → प्रगति",
      subtitle: "हर कारीगर को मिलता है 100-अंकों के निष्पक्ष ट्रस्ट स्कोर के साथ डिजिटल पहचान।",
      identity: "आधार व सरकारी पहचान सत्यापित",
      skills: "ट्रेड स्किल टेस्ट प्रमाणित",
      certifications: "NSDC व ITI सर्टिफिकेट",
      experience: "कंपनियों द्वारा सत्यापित अनुभव",
      proofOfWork: "काम की असली तस्वीरें एवं वीडियो",
      scoreExplanation: "पारदर्शी 100-अंकों का ट्रस्ट फॉर्मूला"
    },
    workerDashboard: {
      greeting: "शुभ प्रभात, रमेश जी",
      profileStrength: "प्रोफ़ाइल पूर्णता",
      trustScore: "ट्रस्ट स्कोर",
      recommendedJobs: "आपके लिए सर्वश्रेष्ठ नौकरियां",
      careerInsights: "कौशल सुधार और करियर सलाह",
      unlockJobs: "एक नया हुनर सीखकर आप 18 और नौकरियों के लिए योग्य बन सकते हैं।",
      quickApply: "त्वरित आवेदन",
      verified: "सत्यापित",
      applyNow: "आवेदन करें",
      viewDetails: "विवरण देखें",
      applied: "आवेदन किया",
      shortlisted: "शॉर्टलिस्ट",
      interview: "इंटरव्यू",
      hired: "नौकरी मिली"
    },
    employerDashboard: {
      overview: "भर्ती सारांश",
      activeJobs: "सक्रिय नौकरियां",
      applications: "कुल आवेदन",
      shortlisted: "शॉर्टलिस्टेड",
      interviews: "इंटरव्यू",
      hired: "नियुक्त कारीगर",
      postNewJob: "नई नौकरी पोस्ट करें",
      aiTopCandidates: "AI रैंक किए गए सत्यापित कारीगर",
      viewPipeline: "कानबान पाइपलाइन देखें",
      matchScore: "मैच स्कोर"
    },
    voiceModal: {
      title: "वॉइस जॉब सर्च",
      listening: "सुन रहे हैं... हिंदी, तेलुगु या अंग्रेजी में बोलें",
      clickToSpeak: "बोलने के लिए माइक दबाएं",
      samplePrompt: "उदाहरण: 'मुझे विजयवाड़ा के पास 25 हजार से ऊपर इलेक्ट्रीशियन का काम चाहिए।'",
      orTry: "या इनमें से चुनें:",
      searchResultBtn: "नौकरियां खोजें",
      analyzingVoice: "आवाज़ का विश्लेषण हो रहा है..."
    }
  }
};
