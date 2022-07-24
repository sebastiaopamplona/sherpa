import Button from "../../components/button/button"
import Layout from "../../components/layout"
import Sidebar from "../../components/sidebar"
import StoryEntry from "../../components/storyEntry/storyEntry"
import { trpc } from "../../utils/trpc"

export default function Backlog() {
  const stories = trpc.useQuery(["story.getAll"])

  return (
    <section>
      <h2>Backlog</h2>

      <div className="py-4" />

      <div className="px-[300px]">
        <div className="bg-white grid grid-cols-3 gap-y-6 overflow-hidden ">
          <div className="col-span-1 col-start-2">
            <Button label="Create story" onClick={() => {}} />
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
