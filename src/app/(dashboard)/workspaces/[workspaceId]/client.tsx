'use client'

import Analytics from "@/components/analytics"
import DottedSeperator from "@/components/dotted-seperator"
import { PageError } from "@/components/page-error"
import { PageLoader } from "@/components/page-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { MemberAvatar } from "@/features/members/components/member-avatar"
import { Member } from "@/features/members/types"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { Project } from "@/features/projects/types"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal"
import { Task } from "@/features/tasks/types"
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { snakeCaseToTitleCase } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId()

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId })
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId })
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

  const isLoading = 
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers

  if(isLoading) {
    return <PageLoader />
  }

  if(!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to workspace data" />
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  )
}

interface TaskListProps {
  data: Task[]
  total: number
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId()
  const { open: createTask } = useCreateTaskModal()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-neutral-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">
            Upcoming Tasks <span className="text-xs text-muted-foreground">({total})</span>
          </p>
          <Button variant={"ghost"} size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeperator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.slice(0, 4).map(task => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="">
                      <p className="text-base font-medium truncate mb-1">{task.name}</p>
                      <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-2">
                          <ProjectAvatar name={task.project?.name} image={task.project?.imageUrl} />
                          <p className="text-sm">{task.project?.name}</p>
                        </div>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1" />
                          <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={task.status}>{snakeCaseToTitleCase(task.status)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Tasks Found
          </li>
        </ul>
        <Button variant={"secondary"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            See All Tasks
          </Link>
        </Button>
      </div>
    </div>
  )
}

interface ProjectListProps {
  data: Project[]
  total: number
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId()
  const { open: createProject } = useCreateProjectModal()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">
            Projects <span className="text-xs text-muted-foreground">({total})</span>
          </p>
          <Button variant={"ghost"} size={"icon"} onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map(project => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar name={project.name} image={project.imageUrl} className="size-10" fallbackClassName="text-base" />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-start w-full hidden first-of-type:block">
            No Projects Found
          </li>
        </ul>
      </div>
    </div>
  )
}

interface MemberListProps {
  data: Member[]
  total: number
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">
            Members <span className="text-xs text-muted-foreground">({total})</span>
          </p>
          <Button variant={"ghost"} size={"icon"} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map(member => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12 mr-2" />
                  <div className="flex flex-col items-start overflow-hidden">
                    <p className="text-base font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Members Found
          </li>
        </ul>
      </div>
    </div>
  )
}
