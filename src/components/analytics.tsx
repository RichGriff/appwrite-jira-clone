import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { AnalyticsCard } from "./analytics-card"
import DottedSeperator from "./dotted-seperator"

export const Analytics = ({ data } : ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-fll whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard 
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.taskDifference}
          />
          <DottedSeperator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard 
            title="Assigned To Me"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.assignedTaskDifference}
          />
          <DottedSeperator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard 
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeperator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard 
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeperator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard 
            title="Incomplete Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Analytics
