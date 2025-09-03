export type AccountPrefs = {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
};

export async function fetchAccountPrefs(userId: string): Promise<AccountPrefs> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  // Basic simulated errors based on id for testability
  if (!userId) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  // Deterministic 500 for a specific id to test error UI
  if (userId === '500') {
    const err: any = new Error('Server error');
    err.status = 500;
    throw err;
  }
  return {
    theme: 'system',
    emailNotifications: true,
    pushNotifications: false,
  };
}

