import Layout from "../../components/layout"
import Sidebar from "../../components/sidebar"

export default function Dashboard() {
  return (
    <section>
      <h2>Dashboard</h2>
    </section>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
