export interface Ticket {
  ticket_id: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  channel: string;
  subject: string;
  description: string;
  case_type: 'Complaint' | 'Inquiry' | 'Suggestion';
  category: string;
  subcategory?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ai_confidence: number;
  ai_rationale?: string;
  status: 'New' | 'In Progress' | 'Pending Customer Confirmation' | 'Escalated - L2' | 'Escalated - SAMA' | 'Closed' | 'Reopened';
  current_level: 'L1' | 'L2' | 'SAMA';
  is_direct_sama_eligible: boolean;
  ai_suggested_response?: string;
  ai_handoff_summary?: string;
  sama_reference_id?: string;
  sama_sync_status: string;
  sama_synced_at?: string;
  sla_hours: number;
  sla_due_at: string;
  is_sla_breached: boolean;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface TicketComment {
  id?: string;
  ticket_id: string;
  author_role: 'customer' | 'agent_l1' | 'agent_l2' | 'ai_agent' | 'sama_system';
  author_name: string;
  content: string;
  action_taken?: string;
  created_at: string;
}

export interface TriageAuditLog {
  id?: string;
  ticket_id: string;
  action: string;
  tool_called: string;
  confidence_score: number;
  reasoning: string;
  payload_snapshot: Record<string, any>;
  timestamp: string;
}

export interface SLAConfig {
  level_l1_hours: number;
  level_l2_hours: number;
  category_overrides_hours: Record<string, number>;
  updated_at?: string;
}
