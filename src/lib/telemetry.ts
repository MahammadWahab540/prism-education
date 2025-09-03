type TelemetryPayload = Record<string, any>;

export function logEvent(event: string, payload: TelemetryPayload = {}) {
  const entry = {
    event,
    payload,
    ts: new Date().toISOString(),
  };
  // Console for dev visibility
  // eslint-disable-next-line no-console
  console.log('[telemetry]', event, payload);
  try {
    const key = 'telemetry-events';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(entry);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // ignore storage errors
  }
}

