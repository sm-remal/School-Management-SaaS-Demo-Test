export interface CreateSchoolRequest {
  schoolName: string;
  schoolEmail: string;
  initialAdminPassword: string;
}

export interface SchoolListItem {
  id: string;
  schoolName: string;
  schoolEmail: string;
  status: string;
  errorMessage: string | null;
  databaseName: string | null;
  databaseStatus: string | null;
  createdAt: Date;
}
