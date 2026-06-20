import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AssetType = 'email' | 'phone' | 'domain';
export type Severity = 'High' | 'Medium' | 'Low';
export type AlertStatus = 'pending' | 'resolved';

export interface Asset {
  id: number;
  type: AssetType;
  value: string;
  status: 'Monitored' | 'Verifying';
  date: string;
  breaches: number;
}

export interface AlertItem {
  id: number;
  asset: string;
  source: string;
  severity: Severity;
  date: string;
  status: AlertStatus;
  description: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  severity: Severity | 'info';
}

export interface NextStep {
  id: number;
  title: string;
  desc: string;
  action: string;
  completed: boolean;
  type: 'settings' | 'password' | 'domain';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio: string;
  twoFactorEnabled: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_ASSETS: Asset[] = [
  { id: 1, type: 'email', value: 'john.doe@gmail.com', status: 'Monitored', date: 'Oct 12, 2023', breaches: 3 },
  { id: 2, type: 'phone', value: '+91 9876543210', status: 'Monitored', date: 'Jan 05, 2024', breaches: 1 },
  { id: 3, type: 'domain', value: 'mybusiness.in', status: 'Verifying', date: 'Oct 10, 2024', breaches: 0 },
  { id: 4, type: 'email', value: 'work.john@company.com', status: 'Monitored', date: 'Mar 22, 2024', breaches: 8 },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 1,
    asset: 'john.doe@email.com',
    source: 'LinkedIn 2024 Breach',
    severity: 'High',
    date: 'Oct 12, 2024',
    status: 'pending',
    description: 'Your email address and job title were found in a large dataset leaked from LinkedIn. The data appears to be from early 2024.',
  },
  {
    id: 2,
    asset: '+91 9876543210',
    source: 'Telecom Provider Leak',
    severity: 'Medium',
    date: 'Oct 08, 2024',
    status: 'resolved',
    description: 'Customer contact details from a major telecom provider were exposed online.',
  },
  {
    id: 3,
    asset: 'company.gov',
    source: 'Data Aggregator Leak',
    severity: 'Low',
    date: 'Sep 24, 2024',
    status: 'pending',
    description: 'Publicly available domain information was found in an insecure MongoDB database.',
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'New High Severity Breach',
    message: 'john.doe@email.com found in LinkedIn 2024 Breach.',
    time: '5 min ago',
    read: false,
    severity: 'High',
  },
  {
    id: 2,
    title: 'Asset Scan Complete',
    message: 'mybusiness.in domain scan completed with 0 exposures.',
    time: '1 hour ago',
    read: false,
    severity: 'info',
  },
  {
    id: 3,
    title: 'Weekly Report Ready',
    message: 'Your October security summary is available to download.',
    time: '2 hours ago',
    read: true,
    severity: 'info',
  },
  {
    id: 4,
    title: 'Medium Alert Resolved',
    message: 'Telecom Provider Leak alert has been marked resolved.',
    time: 'Yesterday',
    read: true,
    severity: 'Medium',
  },
];

const INITIAL_NEXT_STEPS: NextStep[] = [
  {
    id: 1,
    title: 'Enable 2FA',
    desc: 'Add an extra layer of security to your email account.',
    action: 'Setup Now',
    completed: false,
    type: 'settings',
  },
  {
    id: 2,
    title: 'Change Password',
    desc: "Your 'company.com' password was found in a 2024 breach.",
    action: 'Update',
    completed: false,
    type: 'password',
  },
  {
    id: 3,
    title: 'Review Domains',
    desc: 'New domain assets suggested for monitoring.',
    action: 'View',
    completed: false,
    type: 'domain',
  },
];

const INITIAL_USER: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  role: 'Legal Professional',
  bio: 'Legal professional specializing in cyber law and identity protection.',
  twoFactorEnabled: false,
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  // Assets
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'status' | 'date' | 'breaches'>) => void;
  removeAsset: (id: number) => void;

  // Alerts
  alerts: AlertItem[];
  resolveAlert: (id: number) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Next Steps
  nextSteps: NextStep[];
  completeNextStep: (id: number) => void;

  // Add Asset Modal
  isAddAssetModalOpen: boolean;
  openAddAssetModal: () => void;
  closeAddAssetModal: () => void;

  // Settings Navigation
  settingsTab: string;
  setSettingsTab: (tab: string) => void;

  // User Profile
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  enableTwoFactor: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [nextSteps, setNextSteps] = useState<NextStep[]>(INITIAL_NEXT_STEPS);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('Profile');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'status' | 'date' | 'breaches'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now(),
      status: 'Verifying',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      breaches: 0,
    };
    setAssets((prev) => [...prev, newAsset]);
    // Add a notification for new asset
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Asset Added',
        message: `${asset.value} is now being monitored.`,
        time: 'Just now',
        read: false,
        severity: 'info',
      },
      ...prev,
    ]);
  }, []);

  const removeAsset = useCallback((id: number) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const resolveAlert = useCallback((id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const completeNextStep = useCallback((id: number) => {
    setNextSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s))
    );
  }, []);

  const openAddAssetModal = useCallback(() => setIsAddAssetModalOpen(true), []);
  const closeAddAssetModal = useCallback(() => setIsAddAssetModalOpen(false), []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const enableTwoFactor = useCallback(() => {
    setUser((prev) => ({ ...prev, twoFactorEnabled: true }));
    setNextSteps((prev) =>
      prev.map((s) => (s.type === 'settings' ? { ...s, completed: true } : s))
    );
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: '2FA Enabled',
        message: 'Two-factor authentication has been successfully activated.',
        time: 'Just now',
        read: false,
        severity: 'info',
      },
      ...prev,
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        assets,
        addAsset,
        removeAsset,
        alerts,
        resolveAlert,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        nextSteps,
        completeNextStep,
        isAddAssetModalOpen,
        openAddAssetModal,
        closeAddAssetModal,
        settingsTab,
        setSettingsTab,
        user,
        updateUser,
        enableTwoFactor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
