export { default } from "next-auth/middleware";

export const config = { matcher: ["/app/:path*"] };
// export const config = { matcher: ["/dashboard"] };
