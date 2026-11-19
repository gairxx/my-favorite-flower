import { FlowerSpecimen } from '../types/flower';

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // "HH:MM" 24-hour local time
  lastNotifiedDateKey: string | null; // "YYYY-MM-DD"
}

const STORAGE_KEY = 'florilegium_notifications_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderTime: '08:00',
  lastNotifiedDateKey: null,
};

export function getTodayDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return window.Notification.permission;
}

export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
    return {
      enabled: Boolean(parsed.enabled),
      reminderTime:
        typeof parsed.reminderTime === 'string' && /^\d{2}:\d{2}$/.test(parsed.reminderTime)
          ? parsed.reminderTime
          : DEFAULT_NOTIFICATION_SETTINGS.reminderTime,
      lastNotifiedDateKey:
        typeof parsed.lastNotifiedDateKey === 'string' ? parsed.lastNotifiedDateKey : null,
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function formatTimeLabel(time24: string): string {
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function shouldTriggerDailyReminder(
  settings: NotificationSettings,
  now: Date = new Date()
): boolean {
  if (!settings.enabled) return false;
  if (getNotificationPermission() !== 'granted') return false;

  const todayKey = getTodayDateKey(now);
  if (settings.lastNotifiedDateKey === todayKey) return false;

  const [targetHour, targetMinute] = settings.reminderTime.split(':').map(Number);
  if (Number.isNaN(targetHour) || Number.isNaN(targetMinute)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = targetHour * 60 + targetMinute;

  return currentMinutes >= targetMinutes;
}

export function sendFlowerNotification(
  flower: FlowerSpecimen,
  options?: { isTest?: boolean; onClick?: () => void }
): { ok: boolean; error?: string } {
  if (!isNotificationSupported()) {
    return { ok: false, error: 'This browser does not support desktop notifications.' };
  }

  if (window.Notification.permission !== 'granted') {
    return { ok: false, error: 'Notification permission has not been granted.' };
  }

  const todayKey = getTodayDateKey();
  const prefix = options?.isTest ? 'Sample Reminder — ' : '';
  const title = `${prefix}Today's Flower: ${flower.commonName}`;
  const body = `${flower.primaryVirtues.join(' · ')} — ${flower.shortEssence}`;

  try {
    const notification = new window.Notification(title, {
      body,
      tag: options?.isTest ? `florilegium-test-${Date.now()}` : `florilegium-daily-${todayKey}`,
    });

    notification.onclick = () => {
      try {
        window.focus();
      } catch {
        // Focus may be restricted inside nested contexts
      }
      options?.onClick?.();
      notification.close();
    };

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Unable to display a notification in this browser context.',
    };
  }
}
