import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Task } from "@/types/task"

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{task.taskName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.taskDescription}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 items-start">
        <p className="text-muted-foreground">Opprettet: {task.createdAt.toLocaleDateString()}</p>
        <p className="text-muted-foreground">Oppdatert: {task.updatedAt.toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  )
}

export default TaskCard;