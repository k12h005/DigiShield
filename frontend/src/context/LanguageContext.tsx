import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'gu';

// ─── Translations ─────────────────────────────────────────────────────────────
// Keep keys flat and consistent. Add more keys here as you expand the app.

const translations = {
  en: {
    // Nav
    nav_dashboard: 'Dashboard',
    nav_asset_monitoring: 'Asset Monitoring',
    nav_alerts: 'Alerts',
    nav_analytics: 'Analytics',
    nav_legal_intelligence: 'Legal Intelligence',
    nav_reports: 'Reports',
    nav_settings: 'Settings',
    nav_sign_out: 'Sign Out',

    // Header
    add_asset: 'Add Asset',
    notifications: 'Notifications',
    mark_all_read: 'Mark all read',
    no_notifications: 'No notifications',

    // Dashboard
    dashboard_title: 'Dashboard Overview',
    dashboard_subtitle: "Here's what's happening with your digital security.",
    stat_intelligence_records: 'Intelligence Records',
    stat_impact_estimate: 'Impact Estimate',
    stat_critical_threats: 'Critical Threats',
    stat_active_alerts: 'Active Alerts',
    breach_trends: 'Breach Trends',
    breach_trends_subtitle: 'Visualizing data exposures over time.',
    range_30d: 'Last 30 Days',
    range_6m: 'Last 6 Months',
    range_12m: 'Last 12 Months',
    next_steps: 'Next Steps',
    completed: 'Completed',
    recent_alerts: 'Recent Alerts',
    view_all_alerts: 'View All Alerts →',
    no_alerts: 'No recent alerts found.',
    step_2fa_title: 'Enable 2FA',
    step_2fa_desc: 'Add an extra layer of security to your email account.',
    step_2fa_action: 'Setup Now',
    step_pw_title: 'Change Password',
    step_pw_desc: "Your 'company.com' password was found in a 2024 breach.",
    step_pw_action: 'Update',
    step_domain_title: 'Review Domains',
    step_domain_desc: 'New domain assets suggested for monitoring.',
    step_domain_action: 'View',

    // Alerts
    alerts_title: 'Security Alerts',
    alerts_subtitle: 'Real-time notifications about your data exposures.',
    filter_all: 'All',
    filter_high: 'High',
    filter_medium: 'Medium',
    filter_low: 'Low',
    filter_pending: 'Pending',
    filter_resolved: 'Resolved',
    mark_resolved: 'Mark as Resolved',
    view_details: 'View Details',
    severity_high: 'High',
    severity_medium: 'Medium',
    severity_low: 'Low',
    notification_prefs: 'Notification Preferences',
    email_alerts: 'Email Alerts',
    push_notifications: 'Push Notifications',
    weekly_reports: 'Weekly Reports',

    // Asset Monitoring
    assets_title: 'Asset Monitoring',
    assets_subtitle: 'Manage and track your digital assets for potential exposures.',
    add_new_asset: 'Add New Asset',
    search_assets: 'Search assets...',
    tab_all: 'All',
    tab_emails: 'Emails',
    tab_phones: 'Phones',
    tab_domains: 'Domains',
    col_asset_details: 'Asset Details',
    col_status: 'Status',
    col_added_on: 'Added On',
    col_breaches: 'Breaches',
    col_actions: 'Actions',
    status_monitored: 'Monitored',
    status_verifying: 'Verifying',
    no_assets: 'No assets found',
    add_first_asset: 'Add your first asset',
    confirm_delete: 'Confirm delete?',

    // Add Asset Modal
    modal_title: 'Add New Asset',
    modal_subtitle: 'Start monitoring a new digital asset for exposures.',
    asset_type: 'Asset Type',
    type_email: 'Email',
    type_phone: 'Phone',
    type_domain: 'Domain',
    modal_note: 'Your asset will be scanned against known breach databases and monitoring will begin immediately.',
    btn_cancel: 'Cancel',
    btn_add_asset: 'Add Asset',
    btn_scanning: 'Scanning...',
    btn_asset_added: '✓ Asset Added',
    err_required: 'Please enter a value to monitor.',
    err_email: 'Please enter a valid email address.',
    err_phone: 'Please enter a valid phone number.',
    err_domain: 'Please enter a valid domain (e.g. example.com).',

    // Settings
    settings_title: 'Settings',
    settings_subtitle: 'Manage your account preferences and security.',
    tab_profile: 'Profile',
    tab_notifications: 'Notifications',
    tab_security: 'Security',
    tab_api_access: 'API Access',
    tab_billing: 'Billing',
    personal_information: 'Personal Information',
    first_name: 'First Name',
    last_name: 'Last Name',
    email_address: 'Email Address',
    bio: 'Bio',
    save_changes: 'Save Changes',
    saved: 'Saved!',
    danger_zone: 'Danger Zone',
    delete_account: 'Delete Account',
    two_factor: 'Two-Factor Authentication',
    two_factor_desc: 'Add an extra layer of protection. Requires a code from your authenticator app on each login.',
    enable_2fa: 'Enable 2FA',
    enabled: 'Enabled',
    change_password: 'Change Password',
    current_password: 'Current Password',
    new_password: 'New Password',
    confirm_password: 'Confirm New Password',
    update_password: 'Update Password',

    // Analytics
    analytics_title: 'Intelligent Analytics',
    analytics_subtitle: 'Gaining deeper insights into global threat intelligence trends.',

    // Reports
    reports_title: 'Reports & Exports',
    reports_subtitle: 'Generate and download detailed security audits.',
    generate_report: 'Generate New Report',

    // Legal
    legal_title: 'Threat Intelligence Hub',
    legal_subtitle: 'Global breach catalog and incident reports.',

    // Profile menu
    my_profile: 'My Profile',
    security: 'Security',
    sign_out: 'Sign Out',

    // Theme
    theme_dark: 'Dark',
    theme_light: 'Light',

    // Language
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_gu: 'ગુજરાતી',
  },

  hi: {
    nav_dashboard: 'डैशबोर्ड',
    nav_asset_monitoring: 'संपत्ति निगरानी',
    nav_alerts: 'अलर्ट',
    nav_analytics: 'विश्लेषण',
    nav_legal_intelligence: 'कानूनी खुफिया',
    nav_reports: 'रिपोर्ट',
    nav_settings: 'सेटिंग्स',
    nav_sign_out: 'साइन आउट',

    add_asset: 'संपत्ति जोड़ें',
    notifications: 'सूचनाएं',
    mark_all_read: 'सभी पढ़े के रूप में चिह्नित करें',
    no_notifications: 'कोई सूचना नहीं',

    dashboard_title: 'डैशबोर्ड अवलोकन',
    dashboard_subtitle: 'आपकी डिजिटल सुरक्षा की स्थिति यहाँ है।',
    stat_intelligence_records: 'खुफिया रिकॉर्ड',
    stat_impact_estimate: 'प्रभाव अनुमान',
    stat_critical_threats: 'गंभीर खतरे',
    stat_active_alerts: 'सक्रिय अलर्ट',
    breach_trends: 'उल्लंघन रुझान',
    breach_trends_subtitle: 'समय के साथ डेटा उजागर होने की विज़ुअलाइज़ेशन।',
    range_30d: 'पिछले 30 दिन',
    range_6m: 'पिछले 6 महीने',
    range_12m: 'पिछले 12 महीने',
    next_steps: 'अगले कदम',
    completed: 'पूर्ण',
    recent_alerts: 'हालिया अलर्ट',
    view_all_alerts: 'सभी अलर्ट देखें →',
    no_alerts: 'कोई हालिया अलर्ट नहीं मिला।',
    step_2fa_title: '2FA सक्षम करें',
    step_2fa_desc: 'अपने ईमेल खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें।',
    step_2fa_action: 'अभी सेटअप करें',
    step_pw_title: 'पासवर्ड बदलें',
    step_pw_desc: "आपका 'company.com' पासवर्ड 2024 के उल्लंघन में पाया गया।",
    step_pw_action: 'अपडेट करें',
    step_domain_title: 'डोमेन समीक्षा करें',
    step_domain_desc: 'निगरानी के लिए नए डोमेन संपत्तियां सुझाई गई हैं।',
    step_domain_action: 'देखें',

    alerts_title: 'सुरक्षा अलर्ट',
    alerts_subtitle: 'आपके डेटा उजागर होने की रियल-टाइम सूचनाएं।',
    filter_all: 'सभी',
    filter_high: 'उच्च',
    filter_medium: 'मध्यम',
    filter_low: 'निम्न',
    filter_pending: 'लंबित',
    filter_resolved: 'हल किया गया',
    mark_resolved: 'हल के रूप में चिह्नित करें',
    view_details: 'विवरण देखें',
    severity_high: 'उच्च',
    severity_medium: 'मध्यम',
    severity_low: 'निम्न',
    notification_prefs: 'सूचना प्राथमिकताएं',
    email_alerts: 'ईमेल अलर्ट',
    push_notifications: 'पुश सूचनाएं',
    weekly_reports: 'साप्ताहिक रिपोर्ट',

    assets_title: 'संपत्ति निगरानी',
    assets_subtitle: 'संभावित उजागरों के लिए अपनी डिजिटल संपत्तियों को प्रबंधित और ट्रैक करें।',
    add_new_asset: 'नई संपत्ति जोड़ें',
    search_assets: 'संपत्तियां खोजें...',
    tab_all: 'सभी',
    tab_emails: 'ईमेल',
    tab_phones: 'फोन',
    tab_domains: 'डोमेन',
    col_asset_details: 'संपत्ति विवरण',
    col_status: 'स्थिति',
    col_added_on: 'जोड़ा गया',
    col_breaches: 'उल्लंघन',
    col_actions: 'कार्रवाई',
    status_monitored: 'निगरानी में',
    status_verifying: 'सत्यापन हो रहा है',
    no_assets: 'कोई संपत्ति नहीं मिली',
    add_first_asset: 'अपनी पहली संपत्ति जोड़ें',
    confirm_delete: 'हटाने की पुष्टि करें?',

    modal_title: 'नई संपत्ति जोड़ें',
    modal_subtitle: 'उजागरों के लिए एक नई डिजिटल संपत्ति की निगरानी शुरू करें।',
    asset_type: 'संपत्ति प्रकार',
    type_email: 'ईमेल',
    type_phone: 'फोन',
    type_domain: 'डोमेन',
    modal_note: 'आपकी संपत्ति को ज्ञात उल्लंघन डेटाबेस के खिलाफ स्कैन किया जाएगा।',
    btn_cancel: 'रद्द करें',
    btn_add_asset: 'संपत्ति जोड़ें',
    btn_scanning: 'स्कैनिंग...',
    btn_asset_added: '✓ संपत्ति जोड़ी गई',
    err_required: 'कृपया निगरानी के लिए एक मान दर्ज करें।',
    err_email: 'कृपया एक वैध ईमेल पता दर्ज करें।',
    err_phone: 'कृपया एक वैध फोन नंबर दर्ज करें।',
    err_domain: 'कृपया एक वैध डोमेन दर्ज करें।',

    settings_title: 'सेटिंग्स',
    settings_subtitle: 'अपनी खाता प्राथमिकताएं और सुरक्षा प्रबंधित करें।',
    tab_profile: 'प्रोफ़ाइल',
    tab_notifications: 'सूचनाएं',
    tab_security: 'सुरक्षा',
    tab_api_access: 'एपीआई एक्सेस',
    tab_billing: 'बिलिंग',
    personal_information: 'व्यक्तिगत जानकारी',
    first_name: 'पहला नाम',
    last_name: 'अंतिम नाम',
    email_address: 'ईमेल पता',
    bio: 'बायो',
    save_changes: 'परिवर्तन सहेजें',
    saved: 'सहेजा गया!',
    danger_zone: 'खतरनाक क्षेत्र',
    delete_account: 'खाता हटाएं',
    two_factor: 'दो-कारक प्रमाणीकरण',
    two_factor_desc: 'सुरक्षा की एक अतिरिक्त परत जोड़ें।',
    enable_2fa: '2FA सक्षम करें',
    enabled: 'सक्षम',
    change_password: 'पासवर्ड बदलें',
    current_password: 'वर्तमान पासवर्ड',
    new_password: 'नया पासवर्ड',
    confirm_password: 'नए पासवर्ड की पुष्टि करें',
    update_password: 'पासवर्ड अपडेट करें',

    analytics_title: 'बुद्धिमान विश्लेषण',
    analytics_subtitle: 'वैश्विक खतरे की खुफिया प्रवृत्तियों में गहरी अंतर्दृष्टि।',

    reports_title: 'रिपोर्ट और निर्यात',
    reports_subtitle: 'विस्तृत सुरक्षा ऑडिट जनरेट और डाउनलोड करें।',
    generate_report: 'नई रिपोर्ट बनाएं',

    legal_title: 'खतरा खुफिया केंद्र',
    legal_subtitle: 'वैश्विक उल्लंघन कैटलॉग और घटना रिपोर्ट।',

    my_profile: 'मेरी प्रोफ़ाइल',
    security: 'सुरक्षा',
    sign_out: 'साइन आउट',

    theme_dark: 'डार्क',
    theme_light: 'लाइट',

    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_gu: 'ગુજરાતી',
  },

  gu: {
    nav_dashboard: 'ડૅશબોર્ડ',
    nav_asset_monitoring: 'સંપત્તિ નિghan',
    nav_alerts: 'ચેતવણી',
    nav_analytics: 'વિશ્લેષણ',
    nav_legal_intelligence: 'કાનૂની બૌદ્ધિક',
    nav_reports: 'અહેવાલ',
    nav_settings: 'સેટિંગ્સ',
    nav_sign_out: 'સાઇન આઉટ',

    add_asset: 'સંપત્તિ ઉmero',
    notifications: 'સૂચnao',
    mark_all_read: 'બdhane વchel tes',
    no_notifications: 'કoi સૂchna nhai',

    dashboard_title: 'ડૅshboard avlokan',
    dashboard_subtitle: 'આpni digital suraksha ni stithi.',
    stat_intelligence_records: 'બૌddik rekord',
    stat_impact_estimate: 'અasar andaj',
    stat_critical_threats: 'gar khatre',
    stat_active_alerts: 'sachi chetavni',
    breach_trends: 'ઉllanghan valgat',
    breach_trends_subtitle: 'samay sate data ujagal thavanu visualization.',
    range_30d: 'chella 30 divas',
    range_6m: 'chella 6 mahina',
    range_12m: 'chella 12 mahina',
    next_steps: 'agla pagla',
    completed: 'puurn',
    recent_alerts: 'tageta chetavni',
    view_all_alerts: 'bardhee chetavni juo →',
    no_alerts: 'koi tageta chetavni malli nahi.',
    step_2fa_title: '2FA sakriya karo',
    step_2fa_desc: 'tumara email khata ma suraksha no ek vdharo staro umero.',
    step_2fa_action: 'abhee setup karo',
    step_pw_title: 'password badalvo',
    step_pw_desc: "tumaro 'company.com' password 2024 na ullanghan ma malyo.",
    step_pw_action: 'update karo',
    step_domain_title: 'domain tapaso',
    step_domain_desc: 'nigarani mate nava domain suchavaya che.',
    step_domain_action: 'juo',

    alerts_title: 'suraksha chetavni',
    alerts_subtitle: 'tumara data ujagal thavani real-time suchna.',
    filter_all: 'badha',
    filter_high: 'unchu',
    filter_medium: 'madhyam',
    filter_low: 'nichu',
    filter_pending: 'baaki',
    filter_resolved: 'hal thayelu',
    mark_resolved: 'hal thayelu tarke mark karo',
    view_details: 'vivaran juo',
    severity_high: 'unchu',
    severity_medium: 'madhyam',
    severity_low: 'nichu',
    notification_prefs: 'suchna pasandagi',
    email_alerts: 'email chetavni',
    push_notifications: 'push suchna',
    weekly_reports: 'saptahik report',

    assets_title: 'sampatti nigarani',
    assets_subtitle: 'tumari digital sampatti ne manage ane track karo.',
    add_new_asset: 'navi sampatti umero',
    search_assets: 'sampatti shodo...',
    tab_all: 'badha',
    tab_emails: 'emails',
    tab_phones: 'phones',
    tab_domains: 'domains',
    col_asset_details: 'sampatti vivaran',
    col_status: 'stithi',
    col_added_on: 'umero thayu',
    col_breaches: 'ullanghan',
    col_actions: 'karya',
    status_monitored: 'nigarani ma',
    status_verifying: 'satapan thayi rahu che',
    no_assets: 'koi sampatti malli nahi',
    add_first_asset: 'tumari paheli sampatti umero',
    confirm_delete: 'delete ni pushti karo?',

    modal_title: 'navi sampatti umero',
    modal_subtitle: 'ujagal mate navi digital sampatti ni nigarani shuru karo.',
    asset_type: 'sampatti prakar',
    type_email: 'email',
    type_phone: 'phone',
    type_domain: 'domain',
    modal_note: 'tumari sampatti janta ullanghan database samu scan thashe.',
    btn_cancel: 'raddh karo',
    btn_add_asset: 'sampatti umero',
    btn_scanning: 'scan thayi rahu che...',
    btn_asset_added: '✓ sampatti umeri',
    err_required: 'krupaya nigarani mate mulya darakhlo.',
    err_email: 'krupaya valid email address darakhlo.',
    err_phone: 'krupaya valid phone number darakhlo.',
    err_domain: 'krupaya valid domain darakhlo.',

    settings_title: 'settings',
    settings_subtitle: 'tumara khata ni pasandagi ane suraksha manage karo.',
    tab_profile: 'profile',
    tab_notifications: 'suchna',
    tab_security: 'suraksha',
    tab_api_access: 'API access',
    tab_billing: 'billing',
    personal_information: 'vyaktigat mahiti',
    first_name: 'pahelu nam',
    last_name: 'antim nam',
    email_address: 'email sarnamu',
    bio: 'bio',
    save_changes: 'ferfar save karo',
    saved: 'save thayu!',
    danger_zone: 'khatarnak kshetra',
    delete_account: 'khatu delete karo',
    two_factor: 'be-ghataak prmanikaran',
    two_factor_desc: 'suraksha no ek vdharo staro umero.',
    enable_2fa: '2FA sakriya karo',
    enabled: 'sakriya',
    change_password: 'password badalvo',
    current_password: 'varato password',
    new_password: 'navo password',
    confirm_password: 'nava password ni pushti karo',
    update_password: 'password update karo',

    analytics_title: 'buddhiman vishleshaN',
    analytics_subtitle: 'vaishvik khatre ni bouddhik pravruttioma gahri antardrishti.',

    reports_title: 'report ane nishkash',
    reports_subtitle: 'vistrit suraksha audit generate ane download karo.',
    generate_report: 'navi report banavo',

    legal_title: 'khatranu bouddhik kendra',
    legal_subtitle: 'vaishvik ullanghan catalog ane ghatna report.',

    my_profile: 'maro profile',
    security: 'suraksha',
    sign_out: 'sign out',

    theme_dark: 'dark',
    theme_light: 'light',

    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_gu: 'ગુજરાતી',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('cg-lang') as Language) ?? 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cg-lang', lang);
  };

  const t = (key: TranslationKey): string => {
    return (translations[language] as Record<string, string>)[key] ?? translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
