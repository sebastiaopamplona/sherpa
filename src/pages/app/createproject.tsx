import ProjectForm from "../../components/ProjectForm/ProjectForm"
import { pathWithParams } from "../../utils/aux"
import { useRouter } from "next/router"

export default function CreateProject() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-5 content-start ">
      <ProjectForm
        onCreateOrUpdateSuccess={(projectId: string) => {
          router.push(pathWithParams("/app/timekeeper", new Map([["projectId", projectId]])))
        }}
        onCreateOrUpdateError={() => {}}
      />
    </div>
  )
}
