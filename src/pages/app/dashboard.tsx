import Layout from "../../components/layout";
import Sidebar from "../../components/sidebar";
import { trpc } from "../../utils/trpc";

export default function Dashboard() {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  console.log(hello);

  return (
    <section>
      <h2>Dashboard</h2>
    </section>
  );
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  );
};
