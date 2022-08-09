import Layout from "../../components/layout/layout"
import Sidebar from "../../components/sidebar/sidebar"

export default function Testing() {
  return null
}

Testing.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
