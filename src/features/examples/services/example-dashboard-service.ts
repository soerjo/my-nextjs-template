import type { DashboardPoint, DashboardResult } from '@/features/examples/types';

const NETWORK_DELAY_MS = 500;
const POINT_COUNT = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function createSeededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;

    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockPoints(count: number): DashboardPoint[] {
  const random = createSeededRandom(20240202);
  const endDate = Date.UTC(2024, 1, 29);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(endDate - (count - 1 - index) * DAY_IN_MS);
    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const seasonal = Math.sin(index / 4) * 1_800;
    const revenue = Math.max(600, Math.round(3_200 + seasonal + random() * 2_400 - (weekend ? 1_400 : 0)));
    const orders = Math.max(3, Math.round(revenue / 55 - random() * 12));

    return {
      date: date.toISOString(),
      revenue,
      orders,
    };
  });
}

export async function fetchExampleDashboard(): Promise<DashboardResult> {
  await delay(NETWORK_DELAY_MS);

  const points = createMockPoints(POINT_COUNT);

  const totalRevenue = points.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = points.reduce((sum, point) => sum + point.orders, 0);

  return {
    points,
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders),
    },
  };
}
