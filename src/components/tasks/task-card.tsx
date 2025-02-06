import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const TaskCard = ({ }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>title</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>desc</CardDescription>
      </CardContent>
      <CardFooter>status</CardFooter>
    </Card>
  )
}

export default TaskCard;