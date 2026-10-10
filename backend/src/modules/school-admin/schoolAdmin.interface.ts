export interface SchoolAdminProfile {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
  school: {
    id: string;
    name: string;
    email: string;
    databaseName: string;
  };
}
