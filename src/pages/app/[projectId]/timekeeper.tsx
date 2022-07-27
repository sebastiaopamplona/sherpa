import Layout from "../../../components/layout/layout"
import Sidebar from "../../../components/sidebar/sidebar"

export default function TimeKeeper() {
  return (
    <section>
      <h2>Time Keeper</h2>
    </section>
  )
}

TimeKeeper.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
