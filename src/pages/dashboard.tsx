import Layout from "../components/layout";
import Sidebar from "../components/sidebar";

export default function About() {
  return (
    <section>
      <h2>Dashboard</h2>
    </section>
  );
}

About.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  );
};
