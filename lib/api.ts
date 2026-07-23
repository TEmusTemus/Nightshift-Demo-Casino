import { NextResponse } from "next/server";
export const invalid = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
export const unauthorized = () => invalid("Sign in is required.", 401);
export const forbidden = () => invalid("Administrator access is required.", 403);
export const chips = (value: unknown) => Number.isInteger(value) && Number(value) > 0 && Number(value) <= 100000 ? Number(value) : null;
export async function readJson<T>(request: Request, isValid: (value: unknown) => value is T): Promise<T | NextResponse> {
  try {
    const value: unknown = await request.json();
    return isValid(value) ? value : invalid("Invalid request data.");
  } catch { return invalid("Request body must be valid JSON."); }
}

export function isResponse(value: unknown): value is NextResponse { return value instanceof NextResponse; }
