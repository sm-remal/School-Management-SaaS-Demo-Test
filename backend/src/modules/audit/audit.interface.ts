export interface AuditLogListItem {
  id: string;
  action: string;
  metadata: unknown;
  createdAt: Date;
  actor: {
    id: string;
    email: string;
  } | null;
  school: {
    id: string;
    schoolName: string;
    schoolEmail: string;
    status: string;
  } | null;
}
