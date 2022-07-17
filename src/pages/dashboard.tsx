import Layout from "../components/layout";
import { trpc } from "../utils/trpc";

const Dashboard = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <Layout title="Dashboard">
      <h1>NextAuth.js Example</h1>
    </Layout>
  );
};

export default Dashboard;
