import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

export default function Profile() {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  console.log(hello);

  const { data: session, status } = useSession();

  return (
    <section>
      <h2>Profile</h2>
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
