import "../styles/globals.css"

import { ReactElement, ReactNode, useState } from "react"

import { AppProps } from "next/app"
import type { AppRouter } from "../server/createRouter"
import { JourndevContext } from "../utils/reactContext"
import { NextPage } from "next"
import { SessionProvider } from "next-auth/react"
import superjson from "superjson"
import { withTRPC } from "@trpc/next"

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const [theme, setTheme] = useState<string>("")

  const getLayout = Component.getLayout ?? ((page) => page)
  const layout = getLayout(<Component {...pageProps} />)

  return (
    <JourndevContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,
      }}
    >
      <SessionProvider session={session} refetchInterval={0}>
        {layout}
      </SessionProvider>
    </JourndevContext.Provider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""
  }
  if (process.browser) return "" // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,

  // @ts-ignore
  // I added this because I needed to extend MyApp to have getLayout
  // (https://nextjs.org/docs/basic-features/layouts#with-typescript)
  // There must be a way to keep the type, I just ignored it for now
})(MyApp)
