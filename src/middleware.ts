import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/fpl"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};