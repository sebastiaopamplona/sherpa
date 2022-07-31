import { ButtonDefaultCSS } from "../../../utils/aux"
import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import Sidebar from "../../../components/sidebar/sidebar"
import StoryEntry from "../../../components/storyEntry/storyEntry"
import StoryForm from "../../../components/storyForm/storyForm"
import { StoryType } from "../../../server/schemas/schemas"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Backlog() {
  const router = useRouter()
  const { projectId } = router.query
  const stories = trpc.useQuery(["story.getAll", { projectId: projectId as string }])

  const [currentStory, setCurrentStory] = useState<StoryType>()
  const [isStoryDetailsModalOpen, setIsStoryDetailsModalOpen] = useState<boolean>(false)

  return (
    <section>
      <h2>Backlog</h2>
      <div className="px-[300px]">
        <div className="bg-white grid grid-cols-3 gap-y-6 overflow-hidden ">
          <div className="mt-1 flex items-center justify-center col-span-1 col-start-2">
            <button
              className={ButtonDefaultCSS}
              onClick={() => {
                setIsStoryDetailsModalOpen(true)
              }}
            >
              Create story
            </button>
          </div>
          <div className="col-span-3 border-2 rounded-sm shadow">
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
          onCreateOrUpdateSuccess={() => {
            stories.refetch()
            setIsStoryDetailsModalOpen(false)
          }}
          onCreateOrUpdateError={() => {
            alert("story creation failed")
          }}
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
