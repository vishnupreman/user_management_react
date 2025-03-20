// utils/safeParse.ts
export const safeParseJSON = <T>(value: string | null, fallback: T): T => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  