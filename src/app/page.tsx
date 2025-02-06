import ApplicationTable from '@/components/table/application-table';
import { sampleApplications } from '@/lib/sample-group-data';

const Home = () => {
  return (
    <div>
      <ApplicationTable applications={sampleApplications} />
    </div>
  );
};

export default Home;
