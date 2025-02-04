import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Home = () => {
  return (
    <div>
      <h1>Hello world!</h1>
      <Button>I&apos;m a shadcn button</Button>

      <Card className='mt-4 w-[350px]'>
        <CardHeader>
          <CardTitle>Demo of a Card</CardTitle>
          <CardDescription>This is a simple card demonstration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is an example card component from shadcn/ui.</p>
        </CardContent>
        <CardFooter>
          <Button>Click me!</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
