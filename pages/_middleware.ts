import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, res: NextApiResponse) {
    // Token will exist if user is logged in
    const token = await getToken({ req: req as unknown as NextApiRequest, secret: process.env.JWT_SECRET as string });

    const { pathname } = req.nextUrl;
    // Allow the requests if the following is true
    // 1. Its a request for next-auth session & provider fetching
    // 2. the token exists
    if (pathname.includes("/api") || token) {
        return NextResponse.next();
    }
    // Redirect them to login if they don't have a token AND are requesting a protected route
    if (!token && pathname !== "/login") {
        return NextResponse.redirect("/login");
    }
}