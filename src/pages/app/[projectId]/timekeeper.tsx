import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import Sidebar from "../../../components/sidebar/sidebar"
import StoryEntry from "../../../components/storyEntry/storyEntry"
import StoryForm from "../../../components/storyForm/storyForm"
import { StoryType } from "../../../server/schemas/schemas"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

// TODO: move this to a module.css
const timekeeperGridCell = "col-span-1 border-2 flex items-center justify-center"

export default function TimeKeeper() {
  const router = useRouter()
  const { projectId } = router.query
  const stories = trpc.useQuery(["story.getAll", { projectId: projectId as string }])

  const [currentStory, setCurrentStory] = useState<StoryType>()
  const [isStoryDetailsOpen, setIsStoryDetailsOpen] = useState<boolean>(false)
  const [isAddingWorklog, setIsAddingWorklog] = useState<boolean>(false)

  // TODO(SP):
  //  - add timeframe to go to prev / next week

  return (
    <section>
      <h2>Time Keeper</h2>

      <div className="h-full px-[100px]">
        <div className="grid grid-cols-11 gap-[2px] content-center">
          <div className="col-span-6 h-6 rounded-sm"></div>
          <div className={`text-sm font-bold ${timekeeperGridCell}`}>25/8</div>
          <div className={`text-sm font-bold ${timekeeperGridCell}`}>26/8</div>
          <div className={`text-sm font-bold ${timekeeperGridCell}`}>27/8</div>
          <div className={`text-sm font-bold ${timekeeperGridCell}`}>28/8</div>
          <div className={`text-sm font-bold ${timekeeperGridCell}`}>29/8</div>
          {/* 
          // TODO: uncomment when we handle capacity
          <div className="col-span-6 h-6 rounded-sm"></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          */}
          {stories.isLoading ? (
            <></>
          ) : (
            <>
              {stories.data?.map((story) => (
                <TimeKeeperEntry
                  key={story.id}
                  story={story}
                  onStoryClick={(story: StoryType) => {
                    setCurrentStory(story)
                    setIsStoryDetailsOpen(true)
                  }}
                  onWorklogCellClick={(story: StoryType) => {
                    setCurrentStory(story)
                    setIsAddingWorklog(true)
                    setIsStoryDetailsOpen(true)
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={isStoryDetailsOpen}
        onClose={() => {
          setIsStoryDetailsOpen(false)
          setIsAddingWorklog(false)
        }}
      >
        <StoryForm
          story={currentStory}
          isAddingWorklog={isAddingWorklog}
          onCreateOrUpdateSuccess={() => {
            setIsStoryDetailsOpen(false)
            alert("story updated")
          }}
          onCreateOrUpdateError={() => {
            alert("story update failed")
          }}
        />
      </Modal>
    </section>
  )
}

const TimeKeeperEntry: React.FC<{
  story: StoryType
  onStoryClick: (story: StoryType) => void
  onWorklogCellClick: (story: StoryType) => void
}> = ({ story, onStoryClick, onWorklogCellClick }) => {
  return (
    <>
      <div
        className="col-span-6 border-2 rounded-sm"
        onClick={() => {
          onStoryClick(story)
        }}
      >
        <StoryEntry story={story} showAssignee={false} />
      </div>
      <TimeKeeperWorklogCell story={story} onWorklogCellClick={onWorklogCellClick} />
      <TimeKeeperWorklogCell story={story} onWorklogCellClick={onWorklogCellClick} />
      <TimeKeeperWorklogCell story={story} onWorklogCellClick={onWorklogCellClick} />
      <TimeKeeperWorklogCell story={story} onWorklogCellClick={onWorklogCellClick} />
      <TimeKeeperWorklogCell story={story} onWorklogCellClick={onWorklogCellClick} />
    </>
  )
}

const TimeKeeperWorklogCell: React.FC<{ story: StoryType; onWorklogCellClick: (story: StoryType) => void }> = ({
  story,
  onWorklogCellClick,
}) => {
  return (
    <div
      className={` hover:cursor-pointer hover:bg-slate-100 ${timekeeperGridCell}`}
      onClick={() => {
        onWorklogCellClick(story)
      }}
    ></div>
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
