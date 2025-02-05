import { Application } from '../types/application';

export const sampleApplications: Application[] = [
  {
    groupId: 'G001',
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
];
