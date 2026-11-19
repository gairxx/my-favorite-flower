import React, { useEffect, useState } from 'react';
import { Bell, BellOff, BellRing, Check, Clock, X } from 'lucide-react';
import { FlowerSpecimen } from '../types/flower';
import {
  NotificationSettings,
  formatTimeLabel,
  getNotificationPermission,
  isNotificationSupported,
} from '../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  todayFlower: FlowerSpecimen;
  settings: NotificationSettings;
  permission: NotificationPermission | 'unsupported';
  onClose: () => void;
  onEnableNotifications: (reminderTime: string) => Promise<{ ok: boolean; message?: string }>;
  onDisableNotifications: () => void;
  onUpdateTime: (reminderTime: string) => void;
  onSendTestNotification: () => { ok: boolean; error?: string };
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  todayFlower,
  settings,
  permission,
  onClose,
  onEnableNotifications,
  onDisableNotifications,
  onUpdateTime,
  onSendTestNotification,
}) => {
  const [timeDraft, setTimeDraft] = useState(settings.reminderTime);
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    tone: 'neutral' | 'success' | 'warning';
    text: string;
  } | null>(null);

  useEffect(() => {
    setTimeDraft(settings.reminderTime);
  }, [settings.reminderTime]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const supported = isNotificationSupported();
  const currentPermission = supported ? getNotificationPermission() : 'unsupported';
  const effectivePermission = permission === 'unsupported' ? currentPermission : permission;
  const isActive = settings.enabled && effectivePermission === 'granted';

  const handleEnable = async () => {
    setIsRequesting(true);
    setStatusMessage(null);
    const result = await onEnableNotifications(timeDraft);
    setIsRequesting(false);

    if (result.ok) {
      setStatusMessage({
        tone: 'success',
        text: `Daily reminder scheduled for ${formatTimeLabel(timeDraft)}.`,
      });
    } else if (result.message) {
      setStatusMessage({
        tone: 'warning',
        text: result.message,
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTimeDraft(val);
    if (val) {
      onUpdateTime(val);
    }
  };

  const handleTest = () => {
    const res = onSendTestNotification();
    if (res.ok) {
      setStatusMessage({
        tone: 'success',
        text: 'Sample notification sent to your browser.',
      });
    } else {
      setStatusMessage({
        tone: 'warning',
        text: res.error ?? 'Could not send notification.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1C1917]/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg bg-[#FBF9F5] border border-[#D8D0C2] rounded-md overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E3DDD1] flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B645B]">
              Daily Almanac Reminder
            </p>
            <h2
              id="notification-modal-title"
              className="font-display text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5"
            >
              Get Notified Each Morning
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification settings"
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md hover:bg-[#EFEAE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="font-prose text-base text-[#292524] leading-relaxed">
            Receive a quiet browser notification when a new flower of the day is published, featuring its name, virtues, and poetic essence.
          </p>

          {/* Current Permission & Status Readout */}
          <div className="p-4 bg-[#F4EFE6] border border-[#E3DDD1] rounded-md flex items-start gap-3">
            {isActive ? (
              <BellRing className="w-4 h-4 text-[#1B4332] mt-0.5 shrink-0" aria-hidden="true" />
            ) : effectivePermission === 'denied' || !supported ? (
              <BellOff className="w-4 h-4 text-[#991B1B] mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <Bell className="w-4 h-4 text-[#57534E] mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <div className="text-xs leading-relaxed">
              <div className="font-medium text-[#1C1917]">
                {!supported && 'Browser Notifications Unavailable'}
                {supported && effectivePermission === 'denied' && 'Notifications Blocked in Browser'}
                {supported && effectivePermission === 'default' && 'Permission Not Yet Granted'}
                {supported &&
                  effectivePermission === 'granted' &&
                  (isActive
                    ? `Active — Scheduled daily at ${formatTimeLabel(timeDraft)}`
                    : 'Permission Granted — Reminders Paused')}
              </div>
              <p className="text-[#57534E] mt-1">
                {!supported &&
                  'This browser environment does not expose the Notifications API.'}
                {supported &&
                  effectivePermission === 'denied' &&
                  'Allow notifications for this site in your browser settings, then return here to enable daily reminders.'}
                {supported &&
                  effectivePermission === 'default' &&
                  'Select your preferred morning hour and click Get Notified to allow browser reminders.'}
                {supported &&
                  effectivePermission === 'granted' &&
                  'Reminders fire automatically at or after your chosen hour whenever My Favorite Flower is open or revisited on a new day.'}
              </p>
            </div>
          </div>

          {/* Preferred Reminder Time */}
          <div className="flex items-center justify-between gap-4 py-1">
            <label
              htmlFor="reminder-time-input"
              className="flex items-center gap-2 text-sm font-medium text-[#1C1917]"
            >
              <Clock className="w-4 h-4 text-[#6B645B]" aria-hidden="true" />
              <span>Daily reminder time</span>
            </label>
            <input
              id="reminder-time-input"
              type="time"
              value={timeDraft}
              onChange={handleTimeChange}
              className="px-3 py-1.5 text-sm bg-[#FBF9F5] border border-[#D8D0C2] rounded-md text-[#1C1917] tabular-nums focus:outline-none focus:border-[#1B4332]"
            />
          </div>

          {/* Notification Preview */}
          <div className="border-t border-b border-[#E3DDD1] py-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B645B] mb-2">
              Today&rsquo;s Notification Preview
            </p>
            <div className="p-3.5 bg-[#FBF9F5] border border-[#E3DDD1] rounded-md">
              <div className="text-xs font-semibold text-[#1C1917]">
                Today&rsquo;s Flower: {todayFlower.commonName}
              </div>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                {todayFlower.primaryVirtues.join(' · ')} — {todayFlower.shortEssence}
              </p>
            </div>
          </div>

          {statusMessage && (
            <div
              role="status"
              className={`flex items-center gap-2 text-xs px-3.5 py-2.5 rounded-md border ${
                statusMessage.tone === 'success'
                  ? 'bg-[#1B4332]/8 border-[#1B4332]/25 text-[#143326]'
                  : statusMessage.tone === 'warning'
                    ? 'bg-[#9A3412]/8 border-[#9A3412]/25 text-[#7C2D12]'
                    : 'bg-[#F4EFE6] border-[#E3DDD1] text-[#44403C]'
              }`}
            >
              {statusMessage.tone === 'success' && (
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {effectivePermission === 'granted' ? (
              <button
                type="button"
                onClick={handleTest}
                className="px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#D8D0C2] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Send Test Notification
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2.5 ml-auto">
              {isActive ? (
                <button
                  type="button"
                  onClick={() => {
                    onDisableNotifications();
                    setStatusMessage({
                      tone: 'neutral',
                      text: 'Daily reminders paused.',
                    });
                  }}
                  className="px-4 py-2 text-xs font-medium text-[#44403C] hover:text-[#1C1917] border border-[#D8D0C2] hover:bg-[#EFEAE1] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Pause Reminders
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!supported || effectivePermission === 'denied' || isRequesting}
                  onClick={handleEnable}
                  className="px-4 py-2 text-xs font-medium text-[#FBF9F5] bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isRequesting ? 'Requesting Permission...' : 'Get Notified'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
