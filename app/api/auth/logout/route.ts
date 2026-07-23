import { NextResponse } from "next/server";
import { clearSession } from "../../../../lib/auth";

export function POST() { return clearSession(new NextResponse(null, { status: 204 })); }
