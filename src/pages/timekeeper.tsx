import Layout from "../components/layout";
import { trpc } from "../utils/trpc";

const Timekepper = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <Layout title="Time Keeper">
      <h1>NextAuth.js Example</h1>
    </Layout>
  );
};

export default Timekepper;
