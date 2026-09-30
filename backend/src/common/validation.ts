import { ApiError } from "./http";

export function requireString(value: unknown, field: string, opts?: { maxLength?: number }): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${field} is required.`);
  }
  if (opts?.maxLength && value.length > opts.maxLength) {
    throw new ApiError(400, `${field} must be at most ${opts.maxLength} characters.`);
  }
  return value.trim();
}

export function optionalString(value: unknown, field: string, opts?: { maxLength?: number }): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return requireString(value, field, opts);
}

export function requireNumber(value: unknown, field: string, opts?: { min?: number; max?: number }): number {
  const num = typeof value === "string" ? Number(value) : value;
  if (typeof num !== "number" || Number.isNaN(num) || !Number.isFinite(num)) {
    throw new ApiError(400, `${field} must be a valid number.`);
  }
  if (opts?.min !== undefined && num < opts.min) {
    throw new ApiError(400, `${field} must be at least ${opts.min}.`);
  }
  if (opts?.max !== undefined && num > opts.max) {
    throw new ApiError(400, `${field} must be at most ${opts.max}.`);
  }
  return num;
}

export function requireBoolean(value: unknown, field: string, fallback?: boolean): boolean {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== "boolean") {
    throw new ApiError(400, `${field} must be true or false.`);
  }
  return value;
}

const E164_INDIA = /^\+91[6-9]\d{9}$/;

export function requireIndianMobile(value: unknown, field = "mobileNumber"): string {
  const str = requireString(value, field);
  if (!E164_INDIA.test(str)) {
    throw new ApiError(400, `${field} must be a valid Indian mobile number in +91XXXXXXXXXX format.`);
  }
  return str;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
