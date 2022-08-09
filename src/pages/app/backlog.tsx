import { ButtonDefaultCSS, classNames } from "../../utils/aux"

import EmptyResources from "../../components/emptyResources/emptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/layout/layout"
import Modal from "../../components/modal/modal"
import Sidebar from "../../components/sidebar/sidebar"
import StoryEntry from "../../components/storyEntry/storyEntry"
import StoryForm from "../../components/storyForm/storyForm"
import { StoryInput } from "../../server/schemas/schemas"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Backlog() {
  const router = useRouter()
  const { projectId } = router.query
  const stories = trpc.useQuery(["story.getAll", { projectId: projectId as string }])

  const [currentStory, setCurrentStory] = useState<StoryInput>()
  const [isStoryDetailsModalOpen, setIsStoryDetailsModalOpen] = useState<boolean>(false)

  if (stories.isLoading) return null

  return (
    <section>
      <div className="px-[300px]">
        <div className={classNames(stories.data && stories.data.length === 0 ? "" : "hidden")}>
          <EmptyResources message="You have no stories in your backlog. Get started by creating one." />
        </div>
        <div className="grid grid-cols-3 gap-y-6 overflow-hidden bg-white pb-2">
          <div className="col-span-1 col-start-2 mt-1 flex items-center justify-center">
            <button
              className={ButtonDefaultCSS}
              onClick={() => {
                setIsStoryDetailsModalOpen(true)
              }}
            >
              Create story
            </button>
          </div>
          <div
            className={classNames(
              stories.data && stories.data.length === 0 ? "hidden" : "",
              "col-span-3 rounded-sm border-2 shadow"
            )}
          >
            <ul role="list" className="divide-y divide-gray-200">
              {stories.data ? (
                stories.data.map((story) => (
                  <li
                    key={story.id}
                    onClick={() => {
                      setCurrentStory(story)
                      setIsStoryDetailsModalOpen(true)
                    }}
                  >
                    <StoryEntry story={story} />
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isStoryDetailsModalOpen}
        onClose={() => {
          setIsStoryDetailsModalOpen(false)
          setTimeout(function () {
            setCurrentStory(undefined)
          }, 200)
        }}
      >
        <StoryForm
          story={currentStory}
          onCreateOrUpdateStorySuccess={() => {
            stories.refetch()
            setIsStoryDetailsModalOpen(false)
          }}
          onCreateOrUpdateStoryError={() => {
            alert("story creation failed")
          }}
          onCreateOrUpdateWorklogSuccess={() => {}}
          onCreateOrUpdateWorklogError={() => {}}
        />
      </Modal>
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/backlog", session!.userid as string, ctx.query)

  if (redirect !== null) return redirect

  return {
    props: {},
  }
}
