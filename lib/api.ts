import { NextResponse } from "next/server";
export const invalid = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
export const chips = (value: unknown) => Number.isInteger(value) && Number(value) > 0 && Number(value) <= 100000 ? Number(value) : null;
