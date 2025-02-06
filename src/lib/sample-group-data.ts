import { Application } from '../types/application';

export const sampleApplications: Application[] = [
  {
    groupId: 'G001',
    coverLetter:
      ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pellentesque at purus sit amet pharetra. Suspendisse sit amet orci at massa cursus dignissim ac a diam. Donec sit amet sem hendrerit, condimentum sapien a, pharetra orci. Morbi vitae nibh sit amet lectus aliquet accumsan. Vestibulum quis augue est. Aliquam semper dolor quis bibendum ultricies. Curabitur vulputate urna est, sit amet suscipit nunc dictum quis. Pellentesque egestas elit at ipsum suscipit, in ullamcorper lectus blandit. Mauris a tincidunt neque. Morbi pellentesque lobortis quam, vel feugiat magna elementum non. Phasellus risus diam, tincidunt at placerat non, iaculis a ligula. Pellentesque vestibulum nisi ut risus laoreet blandit. Vivamus feugiat eget est a pellentesque.Sed lobortis rutrum leo eu aliquet. Nulla dapibus risus eget molestie consequat. Aenean ac rutrum quam. Suspendisse lacinia pellentesque lorem, sodales pulvinar arcu vestibulum a. Nulla quis consequat nunc. Cras hendrerit orci id tortor tempus tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla et placerat tellus, ultricies elementum felis. Sed vulputate, odio ac euismod dignissim, massa turpis aliquam nibh, in maximus augue nisi nec lectus. Proin rutrum leo eu orci bibendum, eu tempor nunc consequat. Nulla ut tellus at augue bibendum placerat vitae luctus ipsum. Morbi a felis sit amet augue finibus aliquam ac vitae est. Morbi posuere tortor at mi volutpat sodales. Maecenas et placerat ligula. Proin id urna elit. Phasellus pulvinar rhoncus nisl, et mollis massa interdum id. Sed tristique sit amet libero id varius. Mauris pulvinar nisi a commodo bibendum. Aliquam arcu dui, pretium at rhoncus a, porta id lorem. Donec pellentesque augue orci. Aliquam ut sollicitudin odio. Praesent a iaculis urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque eget urna et nisl egestas tincidunt vulputate in ligula. Ut rutrum sed lacus sollicitudin. ',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G002',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G003',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G004',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G005',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G006',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G007',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G008',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G009',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G010',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G011',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G012',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G013',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G014',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G015',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G016',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G017',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G018',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G019',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G020',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G021',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G022',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G023',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G024',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G025',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G026',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G027',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
  {
    groupId: 'G028',
    coverLetter:
      'We are a group at the University of Technology and I am interested in your program.',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
        cv: new File([''], 'cv-john-doe.pdf'),
        grades: new File([''], 'grades-john-doe.pdf'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
        cv: new File([''], 'cv-jane-smith.pdf'),
        grades: new File([''], 'grades-jane-smith.pdf'),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
        cv: new File([''], 'cv-mike-johnson.pdf'),
        grades: new File([''], 'grades-mike-johnson.pdf'),
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G029',
    coverLetter:
      'We are a group at the State Technical College and I am interested in your program.',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G030',
    coverLetter: 'We are a group at the Innovation Institute and I am interested in your program.',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
];
