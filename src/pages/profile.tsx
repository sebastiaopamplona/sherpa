import { signIn, signOut, useSession } from "next-auth/react";

import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { trpc } from "../utils/trpc";

export default function Profile() {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  console.log(hello);

  const { data: session, status } = useSession();
  const loading = status === "loading";

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
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                />
              )}
              <span>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  );
};
