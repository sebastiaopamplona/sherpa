import EmptyResources from "../../components/EmptyResources/EmptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout/Layout"
import StoryDetails from "../../components/StoryDetails/StoryDetails"
import StoryEntry from "../../components/StoryEntry/StoryEntry"
import { StoryInput } from "../../server/schemas/schemas"
import { checkIfShouldRedirect } from "../../server/aux"
import { classNames } from "../../utils/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Backlog() {
  const router = useRouter()
  const { projectId } = router.query
  const stories = trpc.story.getAll.useQuery({ projectId: projectId as string })

  const [currentStory, setCurrentStory] = useState<StoryInput>()
  const [isSlideOverOpen, setIsSlideOverOpen] = useState<boolean>(false)

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
              className="s-btn-base s-btn-default"
              onClick={() => {
                setCurrentStory(undefined)
                setIsSlideOverOpen(true)
              }}
            >
              Create story
            </button>
            <div className="px-2" />
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
                      setIsSlideOverOpen(true)
                    }}
                  >
                    <StoryEntry story={story} showAssignee={true} />
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </div>
      <StoryDetails
        story={currentStory}
        isOpen={isSlideOverOpen}
        onClose={() => {
          setIsSlideOverOpen(false)
        }}
        storyCrudEventWrapper={{
          onCreate: {
            onSuccess: () => {
              setIsSlideOverOpen(false)
              stories.refetch()
            },
          },
          onUpdate: {
            onSuccess: () => {
              setIsSlideOverOpen(false)
              stories.refetch()
            },
          },
          onDelete: {
            onSuccess: () => {
              setIsSlideOverOpen(false)
              stories.refetch()
            },
          },
        }}
        // FIXME(SP): fetch single story intead of all stories
        worklogCrudEventWrapper={{
          onCreate: {
            onSuccess: () => {
              stories.refetch()
            },
          },
          onUpdate: {
            onSuccess: () => {
              stories.refetch()
            },
          },
          onDelete: {
            onSuccess: () => {
              stories.refetch()
            },
          },
        }}
      />
    </section>
  )
}

Backlog.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/backlog", session!.userid as string, ctx.query)
  if (redirect !== null) return redirect
  return { props: {} }
}
