import { NextResponse } from "next/server";
import { sessionUser } from "../../../../lib/auth";

export async function GET(request: Request) { return NextResponse.json({ user: await sessionUser(request) }); }
