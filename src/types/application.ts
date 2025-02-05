import { Student } from './student';

export type Application = {
  groupId: string;
  school: string;
  students: Student[];
  appliedAt?: Date;
  coverLetter?: string;
};

export type ApplicationTableProps = {
  applications: Application[];
};