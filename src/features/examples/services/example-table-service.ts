import type {
  ExampleRecord,
  ExampleRole,
  ExampleStatus,
  TableQueryParams,
  TableQueryResult,
} from '@/features/examples/types';

const TOTAL_RECORDS = 143;
const NETWORK_DELAY_MS = 450;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const FIRST_NAMES = [
  'Ada',
  'Grace',
  'Alan',
  'Katherine',
  'Linus',
  'Margaret',
  'Dennis',
  'Barbara',
  'Alan',
  'Radia',
  'Ken',
  'Hedy',
] as const;

const LAST_NAMES = [
  'Lovelace',
  'Hopper',
  'Turing',
  'Johnson',
  'Torvalds',
  'Hamilton',
  'Ritchie',
  'Liskov',
  'Kay',
  'Perlman',
  'Thompson',
  'Lamarr',
] as const;

const ROLES: ExampleRole[] = ['admin', 'editor', 'viewer'];
const STATUSES: ExampleStatus[] = ['active', 'pending', 'inactive'];

interface RandomSource {
  (): number;
}

function createSeededRandom(seed: number): RandomSource {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;

    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: RandomSource): T {
  return items[Math.floor(random() * items.length)];
}

function createMockRecords(count: number): ExampleRecord[] {
  const random = createSeededRandom(20240101);
  const baseDate = Date.UTC(2023, 0, 1);

  return Array.from({ length: count }, (_, index) => {
    const firstName = pick(FIRST_NAMES, random);
    const lastName = pick(LAST_NAMES, random);

    return {
      id: `USR-${(index + 1).toString().padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName}.${lastName}${index + 1}@example.com`.toLowerCase(),
      role: pick(ROLES, random),
      status: pick(STATUSES, random),
      amount: Math.round(random() * 1_000_000) / 100,
      createdAt: new Date(baseDate + Math.floor(random() * 900) * DAY_IN_MS).toISOString(),
    };
  });
}

const ALL_RECORDS = createMockRecords(TOTAL_RECORDS);

const comparators: Record<string, (a: ExampleRecord, b: ExampleRecord) => number> = {
  id: (a, b) => a.id.localeCompare(b.id),
  name: (a, b) => a.name.localeCompare(b.name),
  email: (a, b) => a.email.localeCompare(b.email),
  role: (a, b) => a.role.localeCompare(b.role),
  status: (a, b) => a.status.localeCompare(b.status),
  amount: (a, b) => a.amount - b.amount,
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchExampleTable(params: TableQueryParams): Promise<TableQueryResult> {
  const { pageIndex, pageSize, sorting } = params;

  await delay(NETWORK_DELAY_MS);

  const sorted = [...ALL_RECORDS];

  if (sorting.length > 0) {
    sorted.sort((a, b) => {
      for (const sort of sorting) {
        const compare = comparators[sort.id];

        if (!compare) {
          continue;
        }

        const result = compare(a, b);

        if (result !== 0) {
          return sort.desc ? -result : result;
        }
      }

      return 0;
    });
  }

  const start = pageIndex * pageSize;

  return {
    rows: sorted.slice(start, start + pageSize),
    rowCount: sorted.length,
  };
}
