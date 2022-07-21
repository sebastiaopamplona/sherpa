import Layout from "../../components/layout"
import Sidebar from "../../components/sidebar"

export default function TimeKeeper() {
  return (
    <section>
      <div className="w-full h-full bg-red-200">
        <h2>Time Keeper</h2>
      </div>
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
