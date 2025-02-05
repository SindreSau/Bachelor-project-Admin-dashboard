export type Student = {
  firstName: string;
  lastName: string;
  email: string;
  // Optional for now:
  cv?: File;
  grades?: File;
};
