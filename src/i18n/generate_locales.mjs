import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'locales');
fs.mkdirSync(path.join(localesDir, 'en'), { recursive: true });
fs.mkdirSync(path.join(localesDir, 'hi'), { recursive: true });
fs.mkdirSync(path.join(localesDir, 'te'), { recursive: true });

const hiData = {
  auth: {
    signInTitle: "कौशलकनेक्ट में पुनः स्वागत है",
    signInSubtitle: "अपने सत्यापित करियर डैशबोर्ड या भर्ती पाइपलाइन तक पहुँचने के लिए साइन इन करें।",
    registerTitle: "अपना सत्यापित खाता बनाएँ",
    registerSubtitle: "12,000+ प्रमाणित तकनीशियनों और 400+ शीर्ष औद्योगिक नियोक्ताओं से जुड़ें।",
    selectRole: "अपने खाते का प्रकार चुनें",
    workerRole: "कुशल कर्मचारी",
    workerRoleDesc: "सत्यापित नौकरियाँ खोजें, 100-पॉइंट ट्रस्ट स्कोर बनाएँ और सीधे कॉल प्राप्त करें।",
    employerRole: "औद्योगिक नियोक्ता",
    employerRoleDesc: "प्रमाणित कौशल और कार्य नमूनों के साथ पूर्व-सत्यापित तकनीशियनों को नियुक्त करें।",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "उदा. रमेश कुमार",
    phoneNumber: "मोबाइल नंबर",
    phoneNumberPlaceholder: "10 अंकों का मोबाइल नंबर",
    companyName: "कंपनी / संस्थान का नाम",
    companyNamePlaceholder: "उदा. हैदराबाद स्टील टेक प्राइवेट लिमिटेड",
    tradeCategory: "मुख्य ट्रेड / कौशल",
    selectTrade: "अपना मुख्य ट्रेड चुनें",
    sendOtp: "सत्यापन OTP भेजें",
    enterOtp: "6-अंकों का OTP दर्ज करें",
    otpSentTo: "+91 {{phone}} पर OTP भेजा गया",
    resendOtp: "OTP पुनः भेजें",
    resendOtpIn: "{{seconds}}s में पुनः भेजें",
    verifyAndProceed: "सत्यापित करें और आगे बढ़ें",
    signInBtn: "साइन इन",
    registerBtn: "खाता बनाएँ",
    alreadyHaveAccount: "पहले से खाता है? साइन इन करें",
    dontHaveAccount: "कौशलकनेक्ट पर नए हैं? खाता बनाएँ",
    demoQuickLogin: "त्वरित डेमो लॉगिन",
    demoWorker: "डेमो कर्मचारी के रूप में साइन इन करें",
    demoEmployer: "डेमो नियोक्ता के रूप में साइन इन करें",
    demoAdmin: "डेमो एडमिन के रूप में साइन इन करें",
    termsNotice: "जारी रखकर, आप कौशलकनेक्ट की सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।",
    validation: {
      nameRequired: "कृपया अपना पूरा नाम दर्ज करें",
      phoneInvalid: "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें",
      otpInvalid: "कृपया 6 अंकों का सत्यापन OTP दर्ज करें",
      companyRequired: "नियोक्ताओं के लिए कंपनी का नाम आवश्यक है",
      tradeRequired: "कृपया अपना प्राथमिक ट्रेड चुनें"
    }
  },
  worker: {
    greeting: "सुप्रभात",
    welcomeBack: "वापसी पर स्वागत है, {{name}}",
    profileStrength: "प्रोफ़ाइल पूर्णता",
    profileCompletion: "{{percent}}% पूर्ण",
    trustScoreTitle: "आपका ट्रस्ट स्कोर",
    trustScoreHelp: "उच्च स्कोर सत्यापित औद्योगिक नियोक्ताओं के साथ प्राथमिकता रैंकिंग दिलाता है।",
    recommendedJobs: "आपके लिए सुझाई गई नौकरियाँ",
    careerInsights: "करियर मार्गदर्शन और प्रगति",
    unlockJobsTip: "अधिक वेतन वाले अवसर पाने के लिए एक और सत्यापित कौशल जोड़ें।",
    quickApply: "त्वरित आवेदन",
    applied: "आवेदन किया",
    applyNow: "अभी आवेदन करें",
    verifiedBadge: "सत्यापित प्रमाण-पत्र",
    primaryTrade: "प्राथमिक ट्रेड",
    experience: "अनुभव",
    experienceYears: "{{years}} वर्ष का अनुभव",
    preferredLocation: "पसंदीदा स्थान",
    expectedSalary: "अपेक्षित वेतन",
    availability: "उपलब्धता",
    immediateJoining: "तत्काल जॉइनिंग के लिए उपलब्ध",
    daysNotice: "{{days}} दिनों का नोटिस",
    tabs: {
      overview: "अवलोकन",
      skills: "कौशल और मूल्यांकन",
      workProof: "कार्य प्रमाण गैलरी",
      certifications: "प्रमाण-पत्र और पहचान",
      experience: "कार्य अनुभव",
      preferences: "नौकरी प्राथमिकताएँ"
    },
    workProof: {
      title: "फ़ोटो और वीडियो कार्य प्रमाण",
      subtitle: "कार्यस्थल पर अपने तकनीकी काम के वास्तविक फ़ोटो और वीडियो दिखाएँ।",
      uploadBtn: "नया कार्य प्रमाण अपलोड करें",
      verifiedByEmployer: "पूर्व नियोक्ता द्वारा सत्यापित",
      emptyState: "अभी तक कोई कार्य प्रमाण अपलोड नहीं किया गया है। अपना ट्रस्ट स्कोर बढ़ाने के लिए अपने वेल्डिंग, वायरिंग या निर्माण कार्य की तस्वीरें अपलोड करें।"
    },
    certifications: {
      title: "सरकारी और ट्रेड प्रमाण-पत्र",
      subtitle: "NSDC, NCVT, ITI, या औद्योगिक शिक्षुता प्रमाण-पत्र।",
      addCert: "प्रमाण-पत्र जोड़ें",
      verifiedOn: "{{date}} को सत्यापित"
    },
    stats: {
      appliedJobs: "आवेदन की गई नौकरियाँ",
      shortlisted: "शॉर्टलिस्ट",
      interviews: "साक्षात्कार",
      profileViews: "प्रोफ़ाइल व्यू"
    },
    upcomingInterviews: "आगामी साक्षात्कार",
    noInterviews: "अभी कोई आगामी साक्षात्कार निर्धारित नहीं है।"
  },
  employer: {
    overview: "भर्ती सारांश",
    welcomeTitle: "औद्योगिक भर्ती केंद्र",
    postNewJob: "नई नौकरी पोस्ट करें",
    activeJobs: "सक्रिय नौकरियाँ",
    totalApplications: "कुल आवेदन",
    shortlistedCandidates: "शॉर्टलिस्ट",
    interviewsScheduled: "निर्धारित साक्षात्कार",
    offersMade: "प्रस्ताव दिए गए",
    hiredCandidates: "नियुक्त",
    topCandidates: "शीर्ष मिलान वाले उम्मीदवार",
    topCandidatesDesc: "ट्रेड प्रमाणन, सत्यापित अनुभव और 100-पॉइंट ट्रस्ट स्कोर पर आधारित AI मिलान।",
    viewPipeline: "पाइपलाइन देखें",
    matchScore: "मिलान स्कोर",
    candidateSearch: "उम्मीदवार खोजें",
    pipelineTitle: "भर्ती पाइपलाइन",
    stages: {
      applied: "आवेदन किया ({{count}})",
      shortlisted: "शॉर्टलिस्ट ({{count}})",
      interview: "साक्षात्कार ({{count}})",
      offer: "प्रस्ताव ({{count}})",
      hired: "नियुक्त ({{count}})",
      rejected: "अस्वीकृत ({{count}})"
    },
    jobCreation: {
      title: "नौकरी का अवसर बनाएँ",
      subtitle: "12,000+ प्रमाणित तकनीशियनों के लिए सत्यापित औद्योगिक नौकरी प्रकाशित करें।",
      jobTitle: "नौकरी का पद",
      jobTitlePlaceholder: "उदा. सीनियर सीएनसी लेथ ऑपरेटर",
      tradeCategory: "ट्रेड श्रेणी",
      vacancies: "रिक्तियों की संख्या",
      location: "स्थान / शहर",
      salaryMin: "न्यूनतम मासिक वेतन (₹)",
      salaryMax: "अधिकतम मासिक वेतन (₹)",
      minExperience: "न्यूनतम आवश्यक अनुभव (वर्ष)",
      certificationsRequired: "आवश्यक प्रमाण-पत्र",
      jobDescription: "विस्तृत नौकरी विवरण",
      jobDescriptionPlaceholder: "शिफ्ट का समय, मशीन के प्रकार, ओवरटाइम नीति, भोजन/आवास का विवरण लिखें...",
      publishJob: "नौकरी प्रकाशित करें",
      saveDraft: "ड्राफ़्ट सहेजें",
      publishedSuccess: "नौकरी सफलतापूर्वक प्रकाशित की गई!"
    },
    analytics: {
      title: "भर्ती और प्रतिभा एनालिटिक्स",
      timeToHire: "औसत भर्ती समय",
      verifiedRatio: "सत्यापित उम्मीदवार",
      applicationFunnel: "आवेदन फ़नल"
    }
  },
  jobs: {
    searchPlaceholder: "ट्रेड, पद या मशीन कौशल द्वारा खोजें...",
    locationPlaceholder: "शहर, ज़िला या औद्योगिक क्षेत्र...",
    filterByTrade: "ट्रेड / उद्योग",
    filterByExperience: "अनुभव स्तर",
    filterBySalary: "न्यूनतम मासिक वेतन",
    filterByJobType: "कार्य प्रकार",
    allTrades: "सभी ट्रेड",
    allLocations: "सभी स्थान",
    anyExperience: "कोई भी अनुभव",
    fresher: "प्रारंभिक स्तर / फ्रेशर (0-1 वर्ष)",
    midLevel: "मध्यम स्तर (2-5 वर्ष)",
    seniorLevel: "वरिष्ठ स्तर (5+ वर्ष)",
    sortOptions: {
      label: "क्रमबद्ध करें",
      bestMatch: "सर्वश्रेष्ठ मिलान (AI स्कोर)",
      highestSalary: "उच्चतम वेतन",
      newest: "हाल ही में पोस्ट की गई",
      trustScore: "शीर्ष नियोक्ता ट्रस्ट"
    },
    jobCard: {
      openings: "{{count}} रिक्तियाँ",
      perMonth: "प्रति माह",
      viewDetails: "विवरण देखें",
      quickApply: "त्वरित आवेदन",
      applied: "आवेदन किया जा चुका है",
      posted: "{{time}} पोस्ट किया गया",
      urgent: "तत्काल",
      verifiedCompany: "सत्यापित कंपनी"
    },
    jobDetails: {
      aboutCompany: "कंपनी के बारे में",
      jobOverview: "नौकरी अवलोकन",
      responsibilities: "मुख्य जिम्मेदारियाँ",
      requirements: "कौशल और अनुभव आवश्यकताएँ",
      certifications: "पसंदीदा प्रमाण-पत्र",
      benefits: "लाभ और सुविधाएँ",
      salaryAndPerks: "वेतन और सुविधाएँ",
      foodAndAccom: "भोजन और आवास",
      providentFund: "PF और ESI उपलब्ध",
      overtime: "ओवरटाइम उपलब्ध",
      transport: "परिवहन / कैब सुविधा",
      applyNow: "इस नौकरी के लिए आवेदन करें",
      matchAnalysis: "मिलान स्कोर विश्लेषण",
      dynamicNotice: "नोट: नौकरी का विवरण और आवश्यकताएँ नियोक्ता द्वारा सीधे प्रदान की जाती हैं।"
    },
    voiceModal: {
      title: "वॉइस जॉब सर्च",
      listening: "सुन रहे हैं… हिंदी, तेलुगु या अंग्रेज़ी में बोलें",
      clickToSpeak: "बोलने के लिए माइक्रोफ़ोन दबाएँ",
      samplePrompt: "उदाहरण: “विजयवाड़ा के पास 25 हज़ार से ऊपर इलेक्ट्रीशियन का काम चाहिए।”",
      orTry: "या इन वॉइस नमूनों को आज़माएँ:",
      searchResultBtn: "नौकरियाँ खोजें",
      analyzingVoice: "वॉइस इनपुट को प्रोसेस किया जा रहा है…"
    }
  },
  applications: {
    title: "मेरे नौकरी आवेदन",
    subtitle: "अपने सक्रिय आवेदनों, स्क्रीनिंग अपडेट, साक्षात्कार कॉल और जॉब ऑफ़र को ट्रैक करें।",
    tabs: {
      all: "सभी आवेदन ({{count}})",
      active: "प्रगति पर ({{count}})",
      interviews: "साक्षात्कार ({{count}})",
      hired: "नियुक्त और प्रस्ताव ({{count}})",
      archived: "आर्काइव ({{count}})"
    },
    statusStages: {
      applied: "आवेदन जमा किया गया",
      screening: "प्रोफ़ाइल स्क्रीनिंग में है",
      shortlisted: "नियोक्ता द्वारा शॉर्टलिस्ट",
      interview: "साक्षात्कार निर्धारित",
      offered: "जॉब ऑफ़र दिया गया",
      hired: "सफलतापूर्वक नियुक्त 🎉",
      rejected: "चयनित नहीं हुए",
      withdrawn: "आवेदन वापस ले लिया गया"
    },
    timeline: {
      title: "आवेदन समयरेखा",
      appliedOn: "{{date}} को आवेदन किया गया",
      statusUpdated: "{{date}} को स्थिति {{status}} में बदली गई",
      interviewTime: "{{time}} के लिए साक्षात्कार निर्धारित",
      location: "स्थान / माध्यम: {{location}}"
    },
    actions: {
      viewJob: "नौकरी का विवरण देखें",
      withdraw: "आवेदन वापस लें",
      confirmInterview: "उपस्थिति की पुष्टि करें",
      reschedule: "पुनर्निर्धारण का अनुरोध करें"
    },
    emptyState: "आपने अभी तक कोई नौकरी आवेदन जमा नहीं किया है।",
    emptyStateCta: "सुझाई गई नौकरियाँ देखें"
  },
  verification: {
    title: "प्रमाण-पत्र और ट्रस्ट सत्यापन केंद्र",
    subtitle: "एंटीग्रेविटी ट्रस्ट इंजन - प्रामाणिक आधार, NSDC प्रमाण-पत्र और पूर्व नियोक्ता कार्य प्रमाणों का सत्यापन।",
    scoreBreakdown: "ट्रस्ट स्कोर 100-पॉइंट फ़ॉर्मूला",
    factors: {
      identity: "सरकारी पहचान सत्यापन",
      identityDesc: "आधार / डिजिलॉकर आधिकारिक पहचान पुष्टि (+20 अंक)",
      skills: "ट्रेड कौशल और तकनीकी मूल्यांकन",
      skillsDesc: "मानकीकृत ट्रेड मूल्यांकन या व्यावसायिक प्रशिक्षण स्कोर (+25 अंक)",
      certifications: "मान्यता प्राप्त प्रमाण-पत्र",
      certificationsDesc: "NSDC, NCVT, ITI, या राज्य व्यावसायिक बोर्ड प्रमाण-पत्र (+20 अंक)",
      experience: "नियोक्ता द्वारा सत्यापित अनुभव",
      experienceDesc: "पूर्व औद्योगिक नियोक्ता संदर्भ या EPF सेवा प्रमाण (+20 अंक)",
      proofOfWork: "फ़ोटो और वीडियो कार्य प्रमाण",
      proofOfWorkDesc: "जियोटैग किए गए कार्यस्थल साक्ष्य की समीक्षा और सत्यापन (+15 अंक)"
    },
    adminQueue: {
      title: "सत्यापन कतार",
      pendingItems: "लंबित सत्यापन आइटम",
      workerName: "कर्मचारी का नाम",
      itemType: "सत्यापन प्रकार",
      submittedOn: "जमा किया गया",
      document: "दस्तावेज़ / प्रमाण",
      approve: "प्रमाण-पत्र स्वीकृत करें",
      reject: "अस्वीकार करें और पुनः अपलोड का अनुरोध करें",
      status: "ऑडिट स्थिति"
    },
    verifiedBadge: "कौशल सत्यापित ट्रस्ट बैज",
    auditNotice: "सभी क्रेडेंशियल सत्यापन सख्त NSDC / NCVT अनुपालन मानकों का पालन करते हैं।"
  },
  analytics: {
    title: "कार्यबल और भर्ती एनालिटिक्स",
    subtitle: "उम्मीदवार मिलान, भर्ती समय और क्षेत्रीय कौशल मांग पर रीयल-टाइम मेट्रिक्स।",
    metrics: {
      totalOpenings: "कुल पोस्ट की गई नौकरियाँ",
      totalApplications: "कुल प्राप्त आवेदन",
      avgTimeToHire: "औसत भर्ती समय",
      hireConversion: "भर्ती रूपांतरण दर",
      avgTrustScore: "औसत उम्मीदवार ट्रस्ट स्कोर",
      activeWorkers: "सक्रिय सत्यापित कर्मचारी"
    },
    charts: {
      applicationFunnel: "भर्ती फ़नल चरण",
      demandByTrade: "ट्रेड कौशल मांग बनाम आपूर्ति",
      regionalDistribution: "भौगोलिक उम्मीदवार वितरण",
      monthlyHires: "मासिक नियुक्तियाँ"
    },
    reports: {
      exportReport: "एनालिटिक्स रिपोर्ट निर्यात करें (PDF/CSV)",
      dateRange: "तिथि सीमा",
      last30Days: "पिछले 30 दिन",
      lastQuarter: "पिछली तिमाही",
      thisYear: "इस वर्ष"
    }
  },
  errors: {
    general: {
      somethingWentWrong: "कुछ गलत हो गया",
      tryAgainLater: "कृपया कुछ समय बाद पुनः प्रयास करें या पृष्ठ को रीफ़्रेश करें।",
      networkError: "नेटवर्क कनेक्शन त्रुटि। कृपया अपना इंटरनेट कनेक्शन जाँचें।",
      notFound: "अनुरोधित पृष्ठ या संसाधन नहीं मिला।",
      unauthorized: "आपको इस क्षेत्र तक पहुँचने की अनुमति नहीं है।",
      sessionExpired: "आपका सत्र समाप्त हो गया है। कृपया पुनः साइन इन करें।"
    },
    validation: {
      fieldRequired: "यह फ़ील्ड आवश्यक है।",
      invalidPhone: "कृपया एक मान्य 10-अंकों का भारतीय फ़ोन नंबर दर्ज करें।",
      invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
      invalidNumber: "कृपया एक मान्य संख्या दर्ज करें।",
      minCharacters: "कम से कम {{min}} वर्ण होने चाहिए।"
    },
    upload: {
      fileTooLarge: "फ़ाइल का आकार 10MB की सीमा से अधिक है।",
      unsupportedFormat: "असमर्थित फ़ाइल प्रारूप। कृपया JPG, PNG या PDF अपलोड करें।",
      uploadFailed: "अपलोड विफल रहा। कृपया पुनः प्रयास करें।"
    }
  }
};

const teData = {
  common: {
    appName: "కౌశల్‌కనెక్ట్",
    tagline: "గుర్తింపు పొందే నైపుణ్యాలు. నమ్మకమైన పని.",
    slogan: "ధృవీకరించిన పత్రాలు మరియు నేరుగా అవకాశాలతో భారతదేశ నైపుణ్యం గల శ్రామిక శక్తిని బలోపేతం చేయడం.",
    actions: {
      save: "భద్రపరచు",
      cancel: "రద్దు చేయి",
      confirm: "నిర్ధారించు",
      delete: "తొలగించు",
      edit: "సవరించు",
      update: "నవీకరించు",
      submit: "సమర్పించు",
      search: "వెతకండి",
      filter: "ఫిల్టర్",
      clearAll: "అన్నీ క్లియర్ చేయి",
      applyFilters: "ఫిల్టర్లు వర్తింపజేయి",
      reset: "రీసెట్",
      close: "మూసివేయి",
      back: "వెనుకకు",
      next: "తదుపరి",
      continue: "కొనసాగించు",
      viewDetails: "వివరాలు చూడండి",
      viewAll: "అన్నీ చూడండి",
      learnMore: "మరింత తెలుసుకోండి",
      download: "డౌన్‌లోడ్",
      upload: "అప్‌లోడ్",
      copy: "కాపీ చేయి",
      copied: "కాపీ చేయబడింది!",
      share: "షేర్ చేయండి",
      refresh: "రిఫ్రెష్",
      loading: "లోడ్ అవుతోంది...",
      processing: "ప్రాసెస్ అవుతోంది...",
      submitting: "సమర్పిస్తోంది...",
      saving: "భద్రపరుస్తోంది..."
    },
    status: {
      active: "క్రియాశీలం",
      inactive: "నిష్క్రియం",
      pending: "వేచి ఉంది",
      verified: "ధృవీకరించబడింది",
      unverified: "ధృవీకరించబడలేదు",
      inReview: "సమీక్షలో ఉంది",
      approved: "ఆమోదించబడింది",
      rejected: "తిరస్కరించబడింది",
      completed: "పూర్తయింది",
      expired: "గడువు ముగిసింది",
      draft: "డ్రాఫ్ట్",
      published: "ప్రచురించబడింది",
      closed: "మూసివేయబడింది"
    },
    badges: {
      verifiedWorker: "ధృవీకరించిన టెక్నీషియన్",
      trustScore: "ట్రస్ట్ స్కోర్",
      highMatch: "ఉత్తమ సరిపోలిక",
      urgentHiring: "తక్షణ నియామకం",
      topEmployer: "ధృవీకరించిన యజమాని",
      governmentCertified: "NSDC సర్టిఫైడ్",
      proofVerified: "పని రుజువు ధృవీకరించబడింది"
    },
    time: {
      justNow: "ఇప్పుడే",
      minsAgo: "{{count}} నిమిషాల క్రితం",
      hoursAgo: "{{count}} గంటల క్రితం",
      daysAgo: "{{count}} రోజుల క్రితం",
      weeksAgo: "{{count}} వారాల క్రితం",
      monthsAgo: "{{count}} నెలల క్రితం",
      perMonth: "నెలకు",
      perDay: "రోజుకు",
      perHour: "గంటకు"
    },
    pagination: {
      previous: "మునుపటి",
      next: "తదుపరి",
      showing: "{{total}} ఫలితాలలో {{from}} నుండి {{to}} చూపబడుతున్నాయి",
      page: "పేజీ {{current}} / {{total}}"
    },
    emptyState: {
      noResults: "ఎటువంటి ఫలితాలు కనుగొనబడలేదు",
      noResultsDesc: "మరిన్ని అవకాశాలను కనుగొనడానికి మీ ఫిల్టర్లు లేదా శోధన పదాలను మార్చడానికి ప్రయత్నించండి.",
      clearFilters: "ఫిల్టర్లు క్లియర్ చేయండి"
    },
    confirm: {
      areYouSure: "మీరు ఖచ్చితంగా ఉన్నారా?",
      actionCannotBeUndone: "ఈ చర్యను రద్దు చేయలేరు."
    },
    integrityDisclaimer: "వినియోగదారు ప్రొఫైల్‌లు మరియు యజమాని నమోదు చేసిన ఉద్యోగ వివరాలు అసలు సమర్పణలను ప్రతిబింబిస్తాయి. ధృవీకరణ బ్యాడ్జ్‌లు ప్లాట్‌ఫారమ్ ఆధారాల ఆడిట్‌లను ప్రతిబింబిస్తాయి."
  },
  navigation: {
    brandName: "కౌశల్‌కనెక్ట్",
    findWork: "పని కనుగొనండి",
    hireTalent: "సిబ్బందిని నియమించండి",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    trustScore: "ట్రస్ట్ స్కోర్",
    dashboard: "డాష్‌బోర్డ్",
    jobs: "ఉద్యోగాలు",
    candidates: "అభ్యర్థులు",
    pipeline: "పైప్‌లైన్",
    applications: "నా దరఖాస్తులు",
    profile: "నా ప్రొఫైల్",
    analytics: "విశ్లేషణలు",
    verification: "ధృవీకరణ కేంద్రం",
    admin: "అడ్మిన్",
    login: "సైన్ ఇన్",
    register: "ప్రారంభించండి",
    logout: "లాగ్ అవుట్",
    voiceSearch: "వాయిస్ సెర్చ్",
    notifications: "నోటిఫికేషన్‌లు",
    switchRole: "వీక్షణ మార్చండి",
    switchRoleWorker: "శ్రామికుల వీక్షణ",
    switchRoleEmployer: "యజమానుల వీక్షణ",
    switchRoleAdmin: "అడ్మిన్ వీక్షణ",
    postJob: "ఉద్యోగాన్ని పోస్ట్ చేయండి",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    footer: {
      about: "కౌశల్‌కనెక్ట్ గురించి",
      aboutDesc: "సర్టిఫైడ్ టెక్నీషియన్లను భారతదేశవ్యాప్తంగా ధృవీకరించిన పారిశ్రామిక సంస్థలతో అనుసంధానించే ఆధునిక శ్రామిక శక్తి వేదిక.",
      quickLinks: "శీఘ్ర లింకులు",
      forWorkers: "శ్రామికుల కోసం",
      forEmployers: "యజమానుల కోసం",
      resources: "వనరులు",
      privacyPolicy: "గోప్యతా విధానం",
      termsOfService: "సేవా నిబంధనలు",
      trustCharter: "ట్రస్ట్ చార్టర్",
      helpCentre: "సహాయం & మద్దతు",
      copyright: "© {{year}} కౌశల్‌కనెక్ట్ వర్క్‌ఫోర్స్ టెక్నాలజీస్. సర్వ హక్కులు రక్షించబడ్డాయి.",
      proudlyMadeInIndia: "భారతదేశ నైపుణ్యం గల శ్రామిక శక్తికి అంకితం 🇮🇳"
    }
  },
  auth: {
    signInTitle: "కౌశల్‌కనెక్ట్‌కు తిరిగి స్వాగతం",
    signInSubtitle: "మీ ధృవీకరించిన కెరీర్ డాష్‌బోర్డ్ లేదా నియామక పైప్‌లైన్‌ను యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి.",
    registerTitle: "మీ ధృవీకరించిన ఖాతాను సృష్టించండి",
    registerSubtitle: "12,000+ సర్టిఫైడ్ వర్కర్లు మరియు 400+ ప్రముఖ పారిశ్రామిక యజమానులతో చేరండి.",
    selectRole: "మీ ఖాతా రకాన్ని ఎంచుకోండి",
    workerRole: "నైపుణ్యం గల వర్కర్",
    workerRoleDesc: "ధృవీకరించిన ఉద్యోగాలను కనుగొనండి, మీ 100-పాయింట్ల ట్రస్ట్ స్కోర్‌ను నిర్మించుకోండి మరియు నేరుగా కాల్స్ పొందండి.",
    employerRole: "పారిశ్రామిక యజమాని",
    employerRoleDesc: "నిరూపితమైన నైపుణ్య సర్టిఫికెట్లు మరియు పని నమూనాలతో ముందుగా ధృవీకరించిన టెక్నీషియన్లను నియమించండి.",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "ఉదా. రమేష్ కుమార్",
    phoneNumber: "మొబైల్ నంబర్",
    phoneNumberPlaceholder: "10 అంకెల మొబైల్ నంబర్",
    companyName: "కంపెనీ / సంస్థ పేరు",
    companyNamePlaceholder: "ఉదా. హైదరాబాద్ స్టీల్ టెక్ ప్రైవేట్ లిమిటెడ్",
    tradeCategory: "ప్రధాన ట్రేడ్ / నైపుణ్యం",
    selectTrade: "మీ ప్రధాన ట్రేడ్‌ను ఎంచుకోండి",
    sendOtp: "ధృవీకరణ OTP పంపండి",
    enterOtp: "6 అంకెల OTP నమోదు చేయండి",
    otpSentTo: "+91 {{phone}} కు OTP పంపబడింది",
    resendOtp: "OTP మళ్లీ పంపండి",
    resendOtpIn: "{{seconds}} సెకన్లలో మళ్లీ పంపండి",
    verifyAndProceed: "ధృవీకరించి కొనసాగండి",
    signInBtn: "సైన్ ఇన్",
    registerBtn: "ఖాతా సృష్టించండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
    dontHaveAccount: "కౌశల్‌కనెక్ట్‌కు కొత్తవారా? ఖాతా సృష్టించండి",
    demoQuickLogin: "శీఘ్ర డెమో లాగిన్",
    demoWorker: "డెమో వర్కర్‌గా సైన్ ఇన్ చేయండి",
    demoEmployer: "డెమో యజమానిగా సైన్ ఇన్ చేయండి",
    demoAdmin: "డెమో అడ్మిన్‌గా సైన్ ఇన్ చేయండి",
    termsNotice: "కొనసాగించడం ద్వారా, మీరు కౌశల్‌కనెక్ట్ సేవా నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరిస్తున్నారు.",
    validation: {
      nameRequired: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి",
      phoneInvalid: "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి",
      otpInvalid: "దయచేసి 6 అంకెల ధృవీకరణ OTP ని నమోదు చేయండి",
      companyRequired: "యజమానులకు కంపెనీ పేరు అవసరం",
      tradeRequired: "దయచేసి మీ ప్రాథమిక ట్రేడ్‌ను ఎంచుకోండి"
    }
  },
  worker: {
    greeting: "శుభోదయం",
    welcomeBack: "తిరిగి స్వాగతం, {{name}}",
    profileStrength: "ప్రొఫైల్ పూర్తి స్థాయి",
    profileCompletion: "{{percent}}% పూర్తయింది",
    trustScoreTitle: "మీ ట్రస్ట్ స్కోర్",
    trustScoreHelp: "ఎక్కువ స్కోర్ ధృవీకరించిన పారిశ్రామిక యజమానులతో ప్రాధాన్యత ర్యాంకింగ్‌ను అందిస్తుంది.",
    recommendedJobs: "మీ కోసం సిఫార్సు చేసిన ఉద్యోగాలు",
    careerInsights: "కెరీర్ అంతర్దృష్టులు & ఎదుగుదల",
    unlockJobsTip: "మరిన్ని ఎక్కువ జీతం గల ఉద్యోగాలను పొందడానికి మరో ధృవీకరించిన నైపుణ్యాన్ని జోడించండి.",
    quickApply: "త్వరిత దరఖాస్తు",
    applied: "దరఖాస్తు చేశారు",
    applyNow: "ఇప్పుడే దరఖాస్తు చేయండి",
    verifiedBadge: "ధృవీకరించిన ఆధారాలు",
    primaryTrade: "ప్రాథమిక ట్రేడ్",
    experience: "అనుభవం",
    experienceYears: "{{years}} సంవత్సరాల అనుభవం",
    preferredLocation: "ఇష్టపడే ప్రాంతం",
    expectedSalary: "ఆశించే జీతం",
    availability: "లభ్యత",
    immediateJoining: "వెంటనే చేరడానికి అందుబాటులో ఉన్నారు",
    daysNotice: "{{days}} రోజుల నోటీసు",
    tabs: {
      overview: "అవలోకనం",
      skills: "నైపుణ్యాలు & పరీక్షలు",
      workProof: "పని రుజువు గ్యాలరీ",
      certifications: "సర్టిఫికెట్లు & గుర్తింపు",
      experience: "అనుభవ చరిత్ర",
      preferences: "ఉద్యోగ ప్రాధాన్యతలు"
    },
    workProof: {
      title: "ఫోటో & వీడియో పని రుజువు",
      subtitle: "పని వద్ద మీ సాంకేతిక పని యొక్క నిజమైన ఫోటోలు మరియు వీడియోలను ప్రదర్శించండి.",
      uploadBtn: "కొత్త పని రుజువును అప్‌లోడ్ చేయండి",
      verifiedByEmployer: "గత యజమానిచే ధృవీకరించబడింది",
      emptyState: "ఇంకా ఎటువంటి పని రుజువు అప్‌లోడ్ చేయబడలేదు. మీ ట్రస్ట్ స్కోర్‌ను పెంచడానికి మీ వెల్డింగ్, వైరింగ్ లేదా ఫ్యాబ్రికేషన్ పని చిత్రాలను అప్‌లోడ్ చేయండి."
    },
    certifications: {
      title: "ప్రభుత్వ & ట్రేడ్ సర్టిఫికెట్లు",
      subtitle: "NSDC, NCVT, ITI లేదా పారిశ్రామిక అప్రెంటిస్‌షిప్ ఆధారాలు.",
      addCert: "సర్టిఫికెట్ జోడించండి",
      verifiedOn: "{{date}} న ధృవీకరించబడింది"
    },
    stats: {
      appliedJobs: "దరఖాస్తు చేసిన ఉద్యోగాలు",
      shortlisted: "ఎంపిక జాబితా",
      interviews: "ఇంటర్వ్యూలు",
      profileViews: "ప్రొఫైల్ వీక్షణలు"
    },
    upcomingInterviews: "రాబోయే ఇంటర్వ్యూలు",
    noInterviews: "ఇంకా రాబోయే ఇంటర్వ్యూలు ఏవీ షెడ్యూల్ చేయబడలేదు."
  },
  employer: {
    overview: "నియామక సారాంశం",
    welcomeTitle: "ఎంటర్‌ప్రైజ్ నియామక కేంద్రం",
    postNewJob: "కొత్త ఉద్యోగాన్ని పోస్ట్ చేయండి",
    activeJobs: "క్రియాశీల ఉద్యోగాలు",
    totalApplications: "మొత్తం దరఖాస్తులు",
    shortlistedCandidates: "ఎంపిక జాబితా",
    interviewsScheduled: "షెడ్యూల్ చేసిన ఇంటర్వ్యూలు",
    offersMade: "ఆఫర్లు ఇచ్చారు",
    hiredCandidates: "నియమించారు",
    topCandidates: "ఉత్తమ సరిపోలిన అభ్యర్థులు",
    topCandidatesDesc: "ట్రేడ్ సర్టిఫికేషన్లు, ధృవీకరించిన అనుభవం మరియు 100-పాయింట్ల ట్రస్ట్ స్కోర్ ఆధారంగా AI మ్యాచ్.",
    viewPipeline: "పైప్‌లైన్ చూడండి",
    matchScore: "మ్యాచ్ స్కోర్",
    candidateSearch: "అభ్యర్థులను వెతకండి",
    pipelineTitle: "నియామక పైప్‌లైన్",
    stages: {
      applied: "దరఖాస్తు చేశారు ({{count}})",
      shortlisted: "ఎంపిక జాబితా ({{count}})",
      interview: "ఇంటర్వ్యూ ({{count}})",
      offer: "ఆఫర్ ({{count}})",
      hired: "నియమించారు ({{count}})",
      rejected: "తిరస్కరించబడింది ({{count}})"
    },
    jobCreation: {
      title: "ఉద్యోగ అవకాశాన్ని సృష్టించండి",
      subtitle: "12,000+ సర్టిఫైడ్ టెక్నీషియన్లకు ధృవీకరించిన పారిశ్రామిక ఉద్యోగాన్ని ప్రచురించండి.",
      jobTitle: "ఉద్యోగ శీర్షిక",
      jobTitlePlaceholder: "ఉదా. సీనియర్ CNC లాత్ ఆపరేటర్",
      tradeCategory: "ట్రేడ్ వర్గం",
      vacancies: "ఖాళీల సంఖ్య",
      location: "ఉద్యోగ ప్రాంతం / నగరం",
      salaryMin: "కనీస నెలవారీ జీతం (₹)",
      salaryMax: "గరిష్ట నెలవారీ జీతం (₹)",
      minExperience: "కనీస అవసరమైన అనుభవం (సంవత్సరాలు)",
      certificationsRequired: "అవసరమైన సర్టిఫికేషన్లు",
      jobDescription: "వివరణాత్మక ఉద్యోగ వివరణ",
      jobDescriptionPlaceholder: "షిఫ్ట్ సమయాలు, మెషీన్ రకాలు, ఓవర్‌టైమ్ పాలసీ, ఆహారం/వసతి సౌకర్యాలను వివరించండి...",
      publishJob: "ఉద్యోగాన్ని ప్రచురించండి",
      saveDraft: "డ్రాఫ్ట్‌గా సేవ్ చేయండి",
      publishedSuccess: "ఉద్యోగ అవకాశం విజయవంతంగా ప్రచురించబడింది!"
    },
    analytics: {
      title: "నియామకం & ప్రతిభ విశ్లేషణలు",
      timeToHire: "సగటు నియామక సమయం",
      verifiedRatio: "ధృవీకరించిన అభ్యర్థులు",
      applicationFunnel: "దరఖాస్తుల ఫన్నెల్"
    }
  },
  jobs: {
    searchPlaceholder: "ట్రేడ్, హోదా లేదా మెషీన్ నైపుణ్యం ద్వారా శోధించండి...",
    locationPlaceholder: "నగరం, జిల్లా లేదా పారిశ్రామిక ప్రాంతం...",
    filterByTrade: "ట్రేడ్ / పరిశ్రమ",
    filterByExperience: "అనుభవ స్థాయి",
    filterBySalary: "కనీస నెలవారీ జీతం",
    filterByJobType: "ఉద్యోగ రకం",
    allTrades: "అన్ని ట్రేడ్‌లు",
    allLocations: "అన్ని ప్రాంతాలు",
    anyExperience: "ఏదైనా అనుభవం",
    fresher: "ప్రారంభ స్థాయి / ఫ్రెషర్ (0-1 సం.)",
    midLevel: "మధ్య స్థాయి (2-5 సం.)",
    seniorLevel: "సీనియర్ స్థాయి (5+ సం.)",
    sortOptions: {
      label: "క్రమబద్ధీకరించండి",
      bestMatch: "ఉత్తమ సరిపోలిక (AI స్కోర్)",
      highestSalary: "అత్యధిక జీతం",
      newest: "ఇటీవల పోస్ట్ చేసినవి",
      trustScore: "అత్యధిక యజమాని ట్రస్ట్"
    },
    jobCard: {
      openings: "{{count}} ఖాళీలు",
      perMonth: "నెలకు",
      viewDetails: "వివరాలు చూడండి",
      quickApply: "త్వరిత దరఖాస్తు",
      applied: "ఇప్పటికే దరఖాస్తు చేశారు",
      posted: "{{time}} పోస్ట్ చేయబడింది",
      urgent: "అత్యవసరం",
      verifiedCompany: "ధృవీకరించిన కంపెనీ"
    },
    jobDetails: {
      aboutCompany: "కంపెనీ గురించి",
      jobOverview: "ఉద్యోగ అవలోకనం",
      responsibilities: "ప్రధాన బాధ్యతలు",
      requirements: "నైపుణ్యాలు & అనుభవ అవసరాలు",
      certifications: "ప్రాధాన్య సర్టిఫికేషన్లు",
      benefits: "ప్రయోజనాలు & అలవెన్సులు",
      salaryAndPerks: "పరిహారం & సౌకర్యాలు",
      foodAndAccom: "ఆహారం & వసతి",
      providentFund: "PF & ESI అందుబాటులో ఉంది",
      overtime: "ఓవర్‌టైమ్ అందుబాటులో ఉంది",
      transport: "రవాణా / క్యాబ్ సౌకర్యం",
      applyNow: "ఈ ఉద్యోగానికి దరఖాస్తు చేయండి",
      matchAnalysis: "మ్యాచ్ స్కోర్ విశ్లేషణ",
      dynamicNotice: "గమనిక: ఉద్యోగ వివరాలు మరియు అవసరాలు యజమాని నేరుగా అందించినవి."
    },
    voiceModal: {
      title: "వాయిస్ జాబ్ సెర్చ్",
      listening: "వింటున్నాము… తెలుగు, హిందీ లేదా ఇంగ్లీషులో మాట్లాడండి",
      clickToSpeak: "మాట్లాడటానికి మైక్రోఫోన్‌ను నొక్కండి",
      samplePrompt: "ఉదాహరణ: “విజయవాడ దగ్గర 25 వేలకు పైగా ఎలక్ట్రీషియన్ పని కావాలి.”",
      orTry: "లేదా ఈ వాయిస్ నమూనాలను ప్రయత్నించండి:",
      searchResultBtn: "ఉద్యోగాలు కనుగొనండి",
      analyzingVoice: "వాయిస్ ఇన్‌పుట్‌ను ప్రాసెస్ చేస్తున్నాము…"
    }
  },
  applications: {
    title: "నా ఉద్యోగ దరఖాస్తులు",
    subtitle: "మీ క్రియాశీల దరఖాస్తులు, స్క్రీనింగ్ అప్‌డేట్లు, ఇంటర్వ్యూ కాల్స్ మరియు ఉద్యోగ ఆఫర్లను ట్రాక్ చేయండి.",
    tabs: {
      all: "అన్ని దరఖాస్తులు ({{count}})",
      active: "పురోగతిలో ఉన్నవి ({{count}})",
      interviews: "ఇంటర్వ్యూలు ({{count}})",
      hired: "నియమించినవి & ఆఫర్లు ({{count}})",
      archived: "ఆర్కైవ్ చేసినవి ({{count}})"
    },
    statusStages: {
      applied: "దరఖాస్తు సమర్పించబడింది",
      screening: "ప్రొఫైల్ స్క్రీనింగ్‌లో ఉంది",
      shortlisted: "యజమానిచే ఎంపిక చేయబడింది",
      interview: "ఇంటర్వ్యూ షెడ్యూల్ చేయబడింది",
      offered: "జాబ్ ఆఫర్ ఇవ్వబడింది",
      hired: "విజయవంతంగా నియమించబడ్డారు 🎉",
      rejected: "ఎంపిక కాలేదు",
      withdrawn: "దరఖాస్తు ఉపసంహరించబడింది"
    },
    timeline: {
      title: "దరఖాస్తు కాలక్రమం",
      appliedOn: "{{date}} న దరఖాస్తు చేయబడింది",
      statusUpdated: "{{date}} న స్థితి {{status}} కు నవీకరించబడింది",
      interviewTime: "{{time}} కు ఇంటర్వ్యూ షెడ్యూల్ చేయబడింది",
      location: "ప్రాంతం / విధానం: {{location}}"
    },
    actions: {
      viewJob: "ఉద్యోగ ప్రకటన చూడండి",
      withdraw: "దరఖాస్తును ఉపసంహరించుకోండి",
      confirmInterview: "హాజరును నిర్ధారించండి",
      reschedule: "రీషెడ్యూల్ అభ్యర్థన"
    },
    emptyState: "మీరు ఇంకా ఎటువంటి ఉద్యోగ దరఖాస్తులను సమర్పించలేదు.",
    emptyStateCta: "సిఫార్సు చేసిన ఉద్యోగాలను బ్రౌజ్ చేయండి"
  },
  verification: {
    title: "రుజువు & ట్రస్ట్ ధృవీకరణ కేంద్రం",
    subtitle: "యాంటిగ్రావిటీ ట్రస్ట్ ఇంజిన్ - ప్రామాణిక ఆధార్ ఐడీ, NSDC సర్టిఫికెట్లు మరియు గత యజమాని పని రుజువుల ధృవీకరణ.",
    scoreBreakdown: "ట్రస్ట్ స్కోర్ 100-పాయింట్ల ఫార్ములా",
    factors: {
      identity: "ప్రభుత్వ గుర్తింపు ధృవీకరణ",
      identityDesc: "ఆధార్ / డిజిలాకర్ అధికారిక గుర్తింపు నిర్ధారణ (+20 పాయింట్లు)",
      skills: "ట్రేడ్ నైపుణ్యం & సాంకేతిక మూల్యాంకనం",
      skillsDesc: "ప్రామాణిక ట్రేడ్ అసెస్‌మెంట్ లేదా ఒకేషనల్ శిక్షణ స్కోరు (+25 పాయింట్లు)",
      certifications: "గుర్తింపు పొందిన సర్టిఫికేషన్లు",
      certificationsDesc: "NSDC, NCVT, ITI లేదా రాష్ట్ర వృత్తి విద్యా బోర్డు సర్టిఫికేట్ (+20 పాయింట్లు)",
      experience: "యజమాని ధృవీకరించిన అనుభవం",
      experienceDesc: "గత పారిశ్రామిక యజమాని రిఫరెన్స్ లేదా EPF సేవా రుజువు (+20 పాయింట్లు)",
      proofOfWork: "ఫోటో & వీడియో పని రుజువు",
      proofOfWorkDesc: "జియోట్యాగ్ చేయబడిన కార్యాలయ సాక్ష్యాలు సమీక్షించబడి ధృవీకరించబడతాయి (+15 పాయింట్లు)"
    },
    adminQueue: {
      title: "ధృవీకరణ క్యూ",
      pendingItems: "వేచి ఉన్న ధృవీకరణ అంశాలు",
      workerName: "శ్రామికుని పేరు",
      itemType: "ధృవీకరణ రకం",
      submittedOn: "సమర్పించిన తేదీ",
      document: "పత్రం / రుజువు",
      approve: "రుజువును ఆమోదించండి",
      reject: "తిరస్కరించి తిరిగి అప్‌లోడ్ చేయమని అడగండి",
      status: "ఆడిట్ స్థితి"
    },
    verifiedBadge: "కౌశల్ వెరిఫైడ్ ట్రస్ట్ బ్యాడ్జ్",
    auditNotice: "అన్ని ఆధారాల ధృవీకరణలు కఠినమైన NSDC / NCVT నిబంధనల ప్రమాణాలను అనుసరిస్తాయి."
  },
  analytics: {
    title: "శ్రామిక శక్తి & నియామక విశ్లేషణలు",
    subtitle: "అభ్యర్థుల సరిపోలిక, నియామక సమయం మరియు ప్రాంతీయ నైపుణ్య డిమాండ్‌పై ప్రత్యక్ష సమాచారం.",
    metrics: {
      totalOpenings: "మొత్తం పోస్ట్ చేసిన ఉద్యోగాలు",
      totalApplications: "మొత్తం వచ్చిన దరఖాస్తులు",
      avgTimeToHire: "సగటు నియామక సమయం",
      hireConversion: "నియామక మార్పిడి రేటు",
      avgTrustScore: "సగటు అభ్యర్థి ట్రస్ట్ స్కోర్",
      activeWorkers: "క్రియాశీల ధృవీకరించిన శ్రామికులు"
    },
    charts: {
      applicationFunnel: "నియామక ఫన్నెల్ దశలు",
      demandByTrade: "ట్రేడ్ నైపుణ్య డిమాండ్ vs సరఫరా",
      regionalDistribution: "భౌగోళిక అభ్యర్థుల పంపిణీ",
      monthlyHires: "నెలవారీ నియామకాలు"
    },
    reports: {
      exportReport: "విశ్లేషణల నివేదికను ఎగుమతి చేయండి (PDF/CSV)",
      dateRange: "తేదీ పరిధి",
      last30Days: "గత 30 రోజులు",
      lastQuarter: "గత త్రైమాసికం",
      thisYear: "ఈ సంవత్సరం"
    }
  },
  errors: {
    general: {
      somethingWentWrong: "ఏదో తప్పు జరిగింది",
      tryAgainLater: "దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి లేదా పేజీని రీఫ్రెష్ చేయండి.",
      networkError: "నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ని తనిఖీ చేయండి.",
      notFound: "అభ్యర్థించిన పేజీ లేదా వనరు కనుగొనబడలేదు.",
      unauthorized: "ఈ విభాగాన్ని యాక్సెస్ చేయడానికి మీకు అనుమతి లేదు.",
      sessionExpired: "మీ సెషన్ గడువు ముగిసింది. దయచేసి మళ్లీ సైన్ ఇన్ చేయండి."
    },
    validation: {
      fieldRequired: "ఈ ఫీల్డ్ తప్పనిసరి.",
      invalidPhone: "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల భారతీయ ఫోన్ నంబర్‌ను నమోదు చేయండి.",
      invalidEmail: "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి.",
      invalidNumber: "దయచేసి చెల్లుబాటు అయ్యే సంఖ్యను నమోదు చేయండి.",
      minCharacters: "కనీసం {{min}} అక్షరాలు ఉండాలి."
    },
    upload: {
      fileTooLarge: "ఫైల్ పరిమాణం 10MB పరిమితిని మించిపోయింది.",
      unsupportedFormat: "మద్దతు లేని ఫైల్ ఫార్మాట్. దయచేసి JPG, PNG లేదా PDF అప్‌లోడ్ చేయండి.",
      uploadFailed: "అప్‌లోడ్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి."
    }
  }
};

// Write Hindi files
for (const [ns, content] of Object.entries(hiData)) {
  const filePath = path.join(localesDir, 'hi', `${ns}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`Wrote hi/${ns}.json`);
}

// Write Telugu files
for (const [ns, content] of Object.entries(teData)) {
  const filePath = path.join(localesDir, 'te', `${ns}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`Wrote te/${ns}.json`);
}

console.log('All locale files generated successfully!');
