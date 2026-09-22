export interface AuditLog {
  id: number;
  user_id: number | null;
  user_email: string | null;
  action: string;
  entite: string;
  entite_id: number | null;
  details: string | null;
  ip_address: string | null;
  date_action: string;
}