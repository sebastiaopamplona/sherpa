import "../styles/globals.css"

import { ReactElement, ReactNode, useState } from "react"

import { AppProps } from "next/app"
import { JourndevContext } from "../utils/reactContext"
import { NextPage } from "next"
import { SessionProvider } from "next-auth/react"
import { trpc } from "../utils/trpc"

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
export default trpc.withTRPC(MyApp)
