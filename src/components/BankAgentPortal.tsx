import React, { useState } from 'react';
import { 
  ShieldCheck, AlertOctagon, Clock, UserCheck, ArrowUpRight, 
  Check, FileText, Activity, Settings, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Ticket, TicketComment, TriageAuditLog } from '../types';

interface Props {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  comments: TicketComment[];
  auditLogs: TriageAuditLog[];
  onSelectTicket: (ticketId: string) => void;
  onPostReply: (ticketId: string, role: string, name: string, content: string) => void;
  onEscalate: (ticketId: string, targetLevel: string, reason: string) => void;
  onSyncSama: (ticketId: string) => void;
  onCheckSLAs: () => void;
  onOpenSlaConfig: () => void;
}

export const BankAgentPortal: React.FC<Props> = ({
  tickets,
  selectedTicket,
  comments,
  auditLogs,
  onSelectTicket,
  onPostReply,
  onEscalate,
  onSyncSama,
  onCheckSLAs,
  onOpenSlaConfig
}) => {
  const [levelFilter, setLevelFilter] = useState<'All' | 'L1' | 'L2' | 'SAMA'>('L1');
  const [agentResponse, setAgentResponse] = useState('');
  const [agentRole, setAgentRole] = useState<'agent_l1' | 'agent_l2'>('agent_l1');
  const [escalateReason, setEscalateReason] = useState('');

  const filteredTickets = tickets.filter(t => {
    if (levelFilter === 'All') return true;
    return t.current_level === levelFilter;
  });

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentResponse || !selectedTicket) return;
    onPostReply(selectedTicket.ticket_id, agentRole, `Bank Agent (${agentRole.toUpperCase()})`, agentResponse);
    setAgentResponse('');
  };

  const useAiSuggestedResponse = () => {
    if (selectedTicket?.ai_suggested_response) {
      setAgentResponse(selectedTicket.ai_suggested_response);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLevelFilter('L1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              levelFilter === 'L1'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Level 1 Queue ({tickets.filter(t => t.current_level === 'L1').length})
          </button>
          <button
            onClick={() => setLevelFilter('L2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              levelFilter === 'L2'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Level 2 Queue ({tickets.filter(t => t.current_level === 'L2').length})
          </button>
          <button
            onClick={() => setLevelFilter('SAMA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              levelFilter === 'SAMA'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            SAMA Escalated ({tickets.filter(t => t.current_level === 'SAMA').length})
          </button>
          <button
            onClick={() => setLevelFilter('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              levelFilter === 'All'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Cases ({tickets.length})
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onCheckSLAs}
            className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Dynamic SLA Check</span>
          </button>
          <button
            onClick={onOpenSlaConfig}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure SLAs</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Queue List, Right Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Queue List */}
        <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredTickets.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-sm">
              No cases in {levelFilter} queue.
            </div>
          ) : (
            filteredTickets.map(t => (
              <div
                key={t.ticket_id}
                onClick={() => onSelectTicket(t.ticket_id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedTicket?.ticket_id === t.ticket_id
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-400">{t.ticket_id}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    t.case_type === 'Complaint' ? 'badge-complaint' : t.case_type === 'Inquiry' ? 'badge-inquiry' : 'badge-suggestion'
                  }`}>
                    {t.case_type}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">{t.subject}</h4>
                <p className="text-xs text-slate-400 mt-1">{t.customer_name} • {t.channel}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                  <span className="truncate max-w-[150px]">{t.category}</span>
                  <span className={`font-semibold ${t.is_sla_breached ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {t.is_sla_breached ? '⚠️ SLA Breached' : `SLA: ${t.sla_hours}h`}
                  </span>
                </div>

                {t.is_direct_sama_eligible && (
                  <div className="mt-2 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Rule 5 Direct SAMA Eligible</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Workstation: Selected Case Triage & Actions */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTicket ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-emerald-400">{selectedTicket.ticket_id}</span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                        {selectedTicket.current_level} Queue
                      </span>
                      <span className="text-xs text-slate-400">Severity: {selectedTicket.severity}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedTicket.subject}</h2>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Status: <strong className="text-emerald-400">{selectedTicket.status}</strong></div>
                    <div className="text-xs text-slate-400 mt-0.5">SLA Due: {new Date(selectedTicket.sla_due_at).toLocaleString()}</div>
                  </div>
                </div>

                {/* AI Complaint Triage Agent Insights Card */}
                <div className="glass-card p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <Activity className="w-4 h-4" />
                      <span>Complaint Triage Agent Insights</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Confidence: {(selectedTicket.ai_confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div><strong className="text-slate-400">SAMA Taxonomy Category:</strong> {selectedTicket.category}</div>
                    <div><strong className="text-slate-400">Rule 5 Direct SAMA Eligible:</strong> {selectedTicket.is_direct_sama_eligible ? 'Yes (Flagged)' : 'No'}</div>
                  </div>

                  {/* Active Regulatory Rule Indicator */}
                  <div className="text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Governance Rule:</span>
                    <span className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedTicket.is_direct_sama_eligible ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      selectedTicket.is_sla_breached ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      selectedTicket.status.includes('Escalated') ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-sky-500/20 text-sky-300 border-sky-500/30'
                    }`}>
                      {selectedTicket.is_direct_sama_eligible ? 'Rule 5: Direct SAMA Pathway' :
                       selectedTicket.is_sla_breached ? (selectedTicket.current_level === 'L1' ? 'Rule 3: L1 SLA Exceeded' : 'Rule 4: L2 SLA Exceeded') :
                       selectedTicket.status === 'Escalated - L2' ? 'Rule 2: Customer Dissatisfaction Signal' :
                       'Rule 1: Standard Intake & L1 Closure'}
                    </span>
                  </div>

                  {selectedTicket.ai_rationale && (
                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400">Agent Decision Rationale:</strong> {selectedTicket.ai_rationale}
                    </div>
                  )}

                  {selectedTicket.ai_handoff_summary && (
                    <div className="text-xs text-amber-200 bg-amber-950/30 p-3 rounded-lg border border-amber-500/30">
                      <strong className="text-amber-400 block mb-1">Escalation Handoff Summary:</strong>
                      <p className="whitespace-pre-wrap font-mono text-[11px]">{selectedTicket.ai_handoff_summary}</p>
                    </div>
                  )}
                </div>

                {/* Customer Complaint Description */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Original Customer Submission ({selectedTicket.customer_name}):</span>
                  <p className="text-sm text-slate-200">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Action Toolbar & Response Box */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-md font-bold text-white flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>Agent Action Panel</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={useAiSuggestedResponse}
                    className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                  >
                    ✨ Insert AI Suggested Draft Response
                  </button>

                  <button
                    onClick={() => onEscalate(selectedTicket.ticket_id, 'L2', 'L1 agent escalated complex case')}
                    className="bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                  >
                    Escalate to Level 2 (L2)
                  </button>

                  <button
                    onClick={() => onSyncSama(selectedTicket.ticket_id)}
                    className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                  >
                    Escalate & Sync to SAMA Gateway (Mock)
                  </button>
                </div>

                {/* Response Input */}
                <form onSubmit={handleSendResponse} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Agent Response (Approved by Human Agent)</label>
                    <textarea
                      rows={3}
                      value={agentResponse}
                      onChange={(e) => setAgentResponse(e.target.value)}
                      placeholder="Type response or click AI draft above..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>Acting as:</span>
                      <select
                        value={agentRole}
                        onChange={(e) => setAgentRole(e.target.value as any)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      >
                        <option value="agent_l1">Bank L1 Agent</option>
                        <option value="agent_l2">Bank L2 Specialist</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                    >
                      Send Response to Customer
                    </button>
                  </div>
                </form>
              </div>

              {/* Timeline Comments & Immutable AI Audit Log Tabs */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-md font-bold text-white">Case Audit Trail & Communication History</h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {comments.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-400">
                        <span>{c.author_name} ({c.author_role.toUpperCase()})</span>
                        <span>{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-2xl border border-white/10 text-slate-400">
              Select a case from the queue on the left to inspect AI triage, agent actions, and regulatory escalation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
