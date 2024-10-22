import { Loader } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export const PageLoader = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* <div className="flex items-center justify-center h-screen">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div> */}
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-[100px] w-[250px] rounded-xl" />
        <Skeleton className="h-[100px] w-[250px] rounded-xl" />
        <Skeleton className="h-[100px] w-[250px] rounded-xl" />
        <Skeleton className="h-[100px] w-[250px] rounded-xl" />
        <Skeleton className="h-[100px] w-[250px] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[160px] w-full rounded-xl" />
        <Skeleton className="h-[160px] w-full rounded-xl" />
        <Skeleton className="h-[160px] w-full rounded-xl" />
      </div>

    </div>
  )
}
