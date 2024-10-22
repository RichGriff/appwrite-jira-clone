import { Project } from "@/features/projects/types"
import { Task } from "../types"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import Link from "next/link"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { ChevronRightIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDeleteTask } from "../api/use-delete-task"
import { useConfirm } from "@/hooks/use-confirm"
import { useRouter } from "next/navigation"

interface TaskBreadcrumbsProps {
  project: Project
  task: Task
}

export const TaskBreadcrumbs = ({ project, task } : TaskBreadcrumbsProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { mutate: deleteTask, isPending } = useDeleteTask()
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Task',
    'This action cannot be undone.',
    'destructive'
  )

  const handleDeleteTask = async () => {
    const ok = await confirm()
    if(!ok) return

    deleteTask({ param: { taskId: task.$id } }, {
      onSuccess: () => {
        router.push(`/workspaces/${workspaceId}/tasks`)
      }
    })
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar 
        name={project.name} 
        image={project.imageUrl} 
        className="size-4 lg:size-6"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="font-semibold text-muted-foreground hover:opacity-75 transition">{project.name}</p>
      </Link>
      <ChevronRightIcon className="size-2 lg:size-3 text-muted-foreground" />
      <p className="font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        size={"sm"}
        variant={"destructive"}
      >
        <TrashIcon className="szie-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  )
}
