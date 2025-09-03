export type LearningItem = {
  id: string;
  title: string;
  type: 'course' | 'session' | 'quiz';
  completedAt: string; // ISO
  durationMinutes: number;
};

export type LearningPage = {
  items: LearningItem[];
  page: number;
  pageSize: number;
  total: number;
};

function generateMockItems(userId: string, total = 87): LearningItem[] {
  const items: LearningItem[] = [];
  for (let i = 0; i < total; i++) {
    items.push({
      id: `${userId}-${i}`,
      title: `Learning Artifact #${i + 1}`,
      type: (['course', 'session', 'quiz'] as const)[i % 3],
      completedAt: new Date(Date.now() - i * 86400000).toISOString(),
      durationMinutes: 10 + (i % 90),
    });
  }
  return items;
}

export async function fetchLearningHistory(
  userId: string,
  page: number,
  pageSize: number
): Promise<LearningPage> {
  await new Promise((r) => setTimeout(r, 700));
  if (!userId) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  if (userId === '404') {
    const err: any = new Error('Not found');
    err.status = 404;
    throw err;
  }
  const all = generateMockItems(userId);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = all.slice(start, end);
  return { items, page, pageSize, total: all.length };
}

