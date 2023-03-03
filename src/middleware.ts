// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("==============")
    console.log(req.nextauth.token)
    console.log("==============")
  },
  {
    callbacks: {
      //   authorized: ({ token }) => true,
      authorized: ({ token }) => false,
      // authorized: ({ token }) => token?.role === "admin",
    },
  }
)

export const config = { matcher: ["/app/:path*"] }
