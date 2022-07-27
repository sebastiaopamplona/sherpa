import Button from "../../../components/button/button"
import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import Sidebar from "../../../components/sidebar/sidebar"
import StoryEntry from "../../../components/storyEntry/storyEntry"
import StoryForm from "../../../components/storyForm/storyForm"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Backlog() {
  const router = useRouter()
  const { projectId } = router.query
  const stories = trpc.useQuery(["story.getAll", { projectId: projectId as string }])
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState<boolean>(false)

  return (
    <section>
      <h2>Backlog</h2>
      <div className="px-[300px]">
        <div className="bg-white grid grid-cols-3 gap-y-6 overflow-hidden ">
          <div className="mt-1 col-span-1 col-start-2">
            <Button
              label="Create story"
              onClick={() => {
                setIsCreateStoryModalOpen(true)
              }}
            />
          </div>
          <div className="col-span-3 border rounded-md shadow">
            <ul role="list" className="divide-y divide-gray-200">
              {stories.data ? (
                stories.data.map((story) => (
                  <li key={story.id}>
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
        isOpen={isCreateStoryModalOpen}
        onClose={() => {
          setIsCreateStoryModalOpen(false)
        }}
      >
        <StoryForm
          onCreateOrUpdateSuccess={() => {
            stories.refetch()
            setIsCreateStoryModalOpen(false)
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
