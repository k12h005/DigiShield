export interface UserPreferences {
  bio: string;
  emailAlerts: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  twoFactorEnabled: boolean;
}

const defaultPrefs: UserPreferences = {
  bio: '',
  emailAlerts: true,
  pushNotifications: false,
  weeklyReports: true,
  twoFactorEnabled: false,
};

export function getUserPrefs(userId: string): UserPreferences {
  const raw = localStorage.getItem(`digishield_prefs_${userId}`);
  if (!raw) return { ...defaultPrefs };
  try {
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return { ...defaultPrefs };
  }
}

export function saveUserPrefs(userId: string, prefs: Partial<UserPreferences>) {
  const current = getUserPrefs(userId);
  localStorage.setItem(`digishield_prefs_${userId}`, JSON.stringify({ ...current, ...prefs }));
}

export function updateStoredUser(partial: Record<string, unknown>) {
  const raw = localStorage.getItem('user');
  if (!raw) return;
  try {
    const user = JSON.parse(raw);
    localStorage.setItem('user', JSON.stringify({ ...user, ...partial }));
  } catch {
    /* ignore */
  }
}
