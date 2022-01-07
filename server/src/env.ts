export function get(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return process.env[key] as string;
}
