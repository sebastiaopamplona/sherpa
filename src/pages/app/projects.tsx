import { GetServerSidePropsContext } from "next"
import Layout from "../../components/layout/layout"
import Modal from "../../components/modal/modal"
import Sidebar from "../../components/sidebar/sidebar"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { useRouter } from "next/router"

export default function Projects() {
  const router = useRouter()
  const { projectId } = router.query

  return (
    <section>
      <h2>Projects</h2>
      <div className="px-[300px]"></div>
      <Modal isOpen={false} onClose={() => {}}></Modal>
    </section>
  )
}

Projects.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/projects", session!.userid as string, ctx.query)

  if (redirect !== null) return redirect

  return {
    props: {},
  }
}
