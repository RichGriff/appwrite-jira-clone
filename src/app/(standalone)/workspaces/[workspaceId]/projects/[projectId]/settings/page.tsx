
import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { EditProjectForm } from '@/features/projects/components/edit-project-form'

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string
  }
}

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
  const user = await getCurrent()
  if(!user) redirect('/sign-in')

  const initialValues = await getProject({ projectId: params.projectId })

  return (
    <div className='w-full lg:max-w-xl'>
      <EditProjectForm initalValues={initialValues} />
    </div>
  )
}

export default ProjectIdSettingsPage
