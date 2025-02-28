import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Comment from './application-comment';

const ApplicationComments = () => {
  // For demo purposes, you would replace this with actual data from your backend
  // feks const user = useAuthUser();
  const currentUser = 'Jens';

  // Hardcoded comments for demo
  const comments = [
    {
      author: 'Jens',
      date: '12. april 2021',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl nec nisl consectetur adipiscing elit. Nulla nec nisl nec nisl.',
    },
    {
      author: 'Daniel',
      date: '12. april 2021',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      author: 'Jens',
      date: '13. april 2021',
      content: 'Nullam quis risus eget urna mollis ornare vel eu leo.',
    },
  ];

  return (
    <Card className='w-full xl:max-w-xs'>
      <CardHeader>
        <CardTitle>Kommentarer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          {comments.map((comment, index) => (
            <Comment
              key={index}
              author={comment.author}
              date={comment.date}
              content={comment.content}
              isCurrentUser={comment.author === currentUser}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationComments;
