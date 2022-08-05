import Layout from "../../../components/layout/layout"
import Sidebar from "../../../components/sidebar/sidebar"

export default function Dashboard() {
  return (
    <section>
      <h2>Sprints</h2>
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
