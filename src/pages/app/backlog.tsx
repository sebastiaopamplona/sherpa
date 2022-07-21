import Layout from "../../components/layout"
import Sidebar from "../../components/sidebar"

export default function Backlog() {
  return (
    <section>
      <h2>Backlog</h2>
    </section>
  )
}

Backlog.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
