import { signIn, signOut, useSession } from "next-auth/react"

import Layout from "../../../components/layout/layout"
import Sidebar from "../../../components/sidebar/sidebar"

export default function Profile() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <section>
      <h2>Profile</h2>
      <div>
        <p className={`nojs-show ${!session && loading}`}>
          {!session && (
            <>
              <span>You are not signed in</span>
              <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && <span style={{ backgroundImage: `url('${session.user.image}')` }} />}
              <span>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault()
                  signOut({ callbackUrl: "/auth/signin" })
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  )
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
