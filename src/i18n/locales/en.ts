export interface TranslationDict {
  app: { name: string; tagline: string };
  nav: Record<string, string>;
  roles: Record<string, string>;
  theme: { light: string; dark: string; toggle: string };
  language: { label: string; en: string; hi: string; gu: string };
  common: Record<string, string>;
  landing: Record<string, string>;
  dashboard: Record<string, string>;
  monitoring: Record<string, string>;
  alerts: Record<string, string>;
  analytics: Record<string, string>;
  threatIntel: Record<string, string>;
  settings: Record<string, string>;
  auth: Record<string, string>;
}

export const en: TranslationDict = {
  app: { name: 'DigiShield', tagline: 'Real-time Breach Monitoring' },
  nav: {
    dashboard: 'Dashboard',
    monitoring: 'Asset Monitoring',
    alerts: 'Alerts',
    analytics: 'Analytics',
    threatIntel: 'Threat Intel',
    reports: 'Reports',
    settings: 'Settings',
    signOut: 'Sign Out',
  },
  roles: {
    individual: 'Citizen',
    legal: 'Legal Professional',
    government: 'Government Official',
    admin: 'Administrator',
  },
  theme: { light: 'Light', dark: 'Dark', toggle: 'Toggle theme' },
  language: { label: 'Language', en: 'English', hi: 'Hindi', gu: 'Gujarati' },
  common: {
    loading: 'Loading...',
    save: 'Save Changes',
    saving: 'Saving...',
    saved: 'Changes saved',
    search: 'Search',
    filter: 'Filter',
    cancel: 'Cancel',
    close: 'Close',
    viewAll: 'View All',
    noData: 'No data available',
    loadMore: 'Load More',
    records: 'records',
  },
  landing: {
    features: 'Features',
    solutions: 'Solutions',
    about: 'About',
    login: 'Login',
    getStarted: 'Get Started',
    heroTitle: 'Protect Your Identity with',
    heroHighlight: 'Intelligence and Law',
    heroSubtitle: 'A comprehensive platform for citizens, legal professionals, and government officials to monitor data breaches and manage cyber intelligence.',
    startMonitoring: 'Start Free Monitoring',
    legalResources: 'Access Legal Resources',
  },
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Your security posture based on live breach intelligence.',
    addAsset: 'Add Asset',
    intelligenceRecords: 'Intelligence Records',
    impactEstimate: 'Impact Estimate',
    criticalThreats: 'Critical Threats',
    yourAlerts: 'Your Active Alerts',
    breachTrend: 'Breach Intelligence Trend',
    breachTrendDesc: 'Verified incidents by month from HIBP corpus.',
    recommendedActions: 'Recommended Actions',
    recentAlerts: 'Recent Alerts',
    viewAllAlerts: 'View All Alerts',
    noAlerts: 'No alerts yet.',
    addDomain: 'Add a domain',
  },
  monitoring: {
    title: 'Asset Monitoring',
    subtitle: 'Monitor emails, phones, and domains against live breach intelligence.',
    addAsset: 'Add New Asset',
    emails: 'Emails',
    phones: 'Phones',
    domains: 'Domains',
    searchPlaceholder: 'Search assets...',
    assetDetails: 'Asset Details',
    status: 'Status',
    lastChecked: 'Last Checked',
    breachHits: 'Breach Hits',
    actions: 'Actions',
    empty: 'No assets yet. Add a domain like adobe.com or linkedin.com to see live breach matches.',
  },
  alerts: {
    title: 'Security Alerts',
    subtitle: 'Real-time notifications about domain and organizational exposure.',
    markResolved: 'Mark as Resolved',
    viewDetails: 'View Details',
    exposedData: 'Exposed Data Types',
    recommendations: 'Recommended Actions',
    legalGuidance: 'Legal Guidance',
    severityGuide: 'Understanding Severity',
    empty: 'No alerts yet.',
  },
  analytics: {
    title: 'Intelligent Analytics',
    subtitle: 'Gaining deeper insights into global threat intelligence trends.',
    certTitle: 'CERT-In Advisory Intelligence',
    certSubtitle: 'Government cybersecurity advisories and threat categories.',
  },
  threatIntel: {
    title: 'Threat Intelligence Hub',
    subtitle: 'HIBP verified corpus · domain exposure matching',
    certTitle: 'CERT-In Security Advisories',
    certSubtitle: 'Official-style advisories for government and legal workflows',
    latestRecords: 'Latest Intelligence Records',
    compliance: 'Compliance Frameworks',
    searchPlaceholder: 'Search Adobe, LinkedIn...',
    monitorDomain: 'Monitor Domain',
    investigation: 'Investigation Details',
  },
  settings: {
    title: 'Account Settings',
    subtitle: 'Manage your profile, alerts, and security preferences.',
    profile: 'Profile',
    notifications: 'Notifications',
    security: 'Security',
    appearance: 'Appearance',
    theme: 'Theme',
    themeDesc: 'Switch between light and dark mode. Orange accent is preserved.',
    language: 'Display Language',
    languageDesc: 'Choose English, Hindi, or Gujarati for the interface.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    bio: 'Professional Bio',
    bioPlaceholder: 'Describe your role in legal or government cyber operations...',
  },
  auth: {
    loginTitle: 'Welcome back',
    loginSubtitle: 'Sign in to your DigiShield account',
    signupTitle: 'Create your account',
    signupSubtitle: 'Start monitoring your digital identity today',
    email: 'Email address',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
  },
};
