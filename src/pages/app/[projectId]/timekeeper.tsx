import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { addDays, format, getWeek, startOfWeek, subDays } from "date-fns"

import { IoTodayOutline } from "react-icons/io5"
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

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentDayRange, setCurrentDayRange] = useState<Date[]>(getWeekBusinessDays(new Date()))

  return (
    <section>
      <h2>Time Keeper</h2>

      <div className="h-full px-[100px]">
        <div className="grid grid-cols-11 gap-[2px] content-center">
          <div className="col-span-11 flex items-end justify-end py-2">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <div
                className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => {
                  const newCurrDate = new Date()
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                }}
              >
                <span className="sr-only">Previous</span>
                <IoTodayOutline className="h-5 w-5" />
              </div>
              <div className="pr-2" />
              <div
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => {
                  const newCurrDate = subDays(currentDate, 7)
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                }}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <a
                href="#"
                aria-current="page"
                className="z-10 border-gray-300 relative inline-flex items-center px-3 py-2 border text-sm font-medium"
              >
                {`Week ${getWeek(currentDate)}`}
              </a>
              <div
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => {
                  const newCurrDate = addDays(currentDate, 7)
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                }}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </nav>
          </div>
          <div className="col-span-6 h-6 rounded-sm"></div>
          {currentDayRange.map((d) => (
            <div key={d.toUTCString()} className={`text-sm font-semibold ${timekeeperGridCell}`}>
              {`${format(d, "eeeeee")}, ${format(d, "d/M")}`}
            </div>
          ))}
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

const getWeekBusinessDays = (currentDate: Date): Date[] => {
  let curr: Date = startOfWeek(currentDate)
  let days: Date[] = []
  for (let i = 0; i < 5; i++) {
    curr = addDays(curr, 1)
    days.push(curr)
  }
  return days
}
