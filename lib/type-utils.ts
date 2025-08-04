export function toNumber(value: any, fallback: number = 0): number {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
}

export function toBoolean(value: any): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "1";
  return Boolean(value);
}

export function toString(value: any, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}
