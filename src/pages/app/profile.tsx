import { signIn, useSession } from "next-auth/react"

import Layout from "../../components/Sidebar/Layout"

export default function Profile() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <section>
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
                Signed in as <strong>{session.user.email ?? session.user.name}</strong>
              </span>
            </>
          )}
        </p>
      </div>
      <h6 className="italic">(This profile page currently sucks, we are working on making it better.)</h6>
    </section>
  )
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}
