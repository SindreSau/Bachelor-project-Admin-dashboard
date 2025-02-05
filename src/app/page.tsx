import ApplicationTable from '@/components/table/application-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { sampleGroups } from '@/lib/sample-group-data';

const Home = () => {
  return (
    <div>
      <ApplicationTable groups={sampleGroups} />
    </div>
  );
};

export default Home;
