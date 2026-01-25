import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getAlertSeverityColor } from '../../utils/colors';
import type { WeatherAlert } from '../../types';

interface AlertsBannerProps {
  alerts: WeatherAlert[];
}

export function AlertsBanner({ alerts }: AlertsBannerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.id));

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2 mb-4">
      {visibleAlerts.map((alert) => {
        const isExpanded = expandedId === alert.id;
        const severityColor = getAlertSeverityColor(alert.severity);

        return (
          <div
            key={alert.id}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: `${severityColor}15`,
              borderLeft: `4px solid ${severityColor}`,
            }}
          >
            <div className="flex items-start gap-3 p-3">
              <AlertTriangle
                size={20}
                style={{ color: severityColor }}
                className="shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: severityColor }}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {alert.event}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {alert.headline}
                  </p>

                  {isExpanded && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-line">
                      {alert.description}
                    </p>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  aria-label={isExpanded ? 'Collapse alert' : 'Expand alert'}
                >
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  aria-label="Dismiss alert"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
