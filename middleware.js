import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Force www
  if (host === "timewatchindia.com") {
    url.host = "www.timewatchindia.com";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
