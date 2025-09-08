type AnalyticsEvent =
  | { name: 'po_new_tenant_click'; props: { user_id?: string } }
  | { name: 'po_new_tenant_submit'; props: { tenant_name: string; slug: string } }
  | { name: 'po_new_tenant_success'; props: { tenant_id: string } }
  | { name: 'po_settings_open'; props: { source: 'dashboard' | string } }
  | { name: 'po_settings_save'; props: { sections: Array<'general' | 'billing' | 'theme' | 'roles'> } }
  // Additional names per spec
  | { name: 'tenant_create_submit'; props: { account_quota: number; plan: string } }
  | { name: 'tenant_create_success'; props: { tenant_id: string; account_quota: number } }
  | { name: 'user_create_blocked_quota'; props: { tenant_id: string; used_seats: number; account_quota: number } }
  | { name: 'seat_request_submitted'; props: { tenant_id: string; requested_delta: number } }
  | { name: 'skill_mgmt_tenant_filter_open'; props: {} }
  | { name: 'skill_mgmt_tenant_filter_select'; props: { slug: string; category: string } }
  | { name: 'skill_mgmt_tenant_filter_clear_all'; props: {} };

export function track(evt: AnalyticsEvent) {
  // In lieu of a real analytics client, log to console
  // Consumers can replace this with Segment/Amplitude/etc.
  // Also stamp a timestamp to aid timing inspection in dev
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${evt.name}`, { ...evt.props, ts: Date.now() });
}
