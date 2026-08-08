import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight, Code, ShieldCheck, Zap } from 'lucide-react';
import { Ticket } from '../types';

interface Props {
  tickets: Ticket[];
  onTriggerWebhook: (ticketId: string, statusUpdate: string, resolutionNotes: string) => void;
}

export const SamaGatewayPortal: React.FC<Props> = ({ tickets, onTriggerWebhook }) => {
  const samaEscalatedTickets = tickets.filter(t => t.current_level === 'SAMA' || t.sama_reference_id);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(samaEscalatedTickets[0]?.ticket_id || '');
  const [statusUpdate, setStatusUpdate] = useState<'Closed' | 'In Progress at SAMA' | 'Resolved'>('Resolved');
  const [resolutionNotes, setResolutionNotes] = useState('SAMA Committee resolved case in favor of customer. Bank to refund unauthorized fees within 48h.');

  const selectedTicket = samaEscalatedTickets.find(t => t.ticket_id === selectedTicketId);

  const handleWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId) return;
    onTriggerWebhook(selectedTicketId, statusUpdate, resolutionNotes);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Saudi Central Bank (SAMA) Regulator Integration Gateway</h2>
            <p className="text-xs text-slate-300">Simulates regulatory complaint intake, audit snapshots, and asynchronous status webhooks</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Mock API Adapter Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SAMA Escalated Complaints List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-md font-bold text-white mb-3">SAMA Escalated Inbox ({samaEscalatedTickets.length})</h3>

            {samaEscalatedTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No tickets currently escalated to SAMA. Escalate a ticket from the Bank Agent portal to view it here.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {samaEscalatedTickets.map((t) => (
                  <div
                    key={t.ticket_id}
                    onClick={() => setSelectedTicketId(t.ticket_id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedTicketId === t.ticket_id
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-400">{t.sama_reference_id || 'PENDING SYNC'}</span>
                      <span className="text-xs text-slate-400">{t.ticket_id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{t.subject}</h4>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                      <span>Category: {t.category}</span>
                      <span className="text-emerald-300 font-semibold">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: SAMA Inspector & Webhook Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {selectedTicket ? (
            <div className="space-y-6">
              {/* SAMA Payload Viewer */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-emerald-400">SAMA REF: {selectedTicket.sama_reference_id}</span>
                    <h3 className="text-lg font-bold text-white">{selectedTicket.subject}</h3>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                    Sync Status: {selectedTicket.sama_sync_status}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                    <Code className="w-3.5 h-3.5" />
                    <span>SAMA Gateway API Payload Snapshot (REST POST /cases):</span>
                  </span>

                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{JSON.stringify({
  sama_reference_id: selectedTicket.sama_reference_id,
  bank_code: "SA-BANK-001",
  bank_ticket_id: selectedTicket.ticket_id,
  customer_info: {
    customer_id: selectedTicket.customer_id,
    full_name: selectedTicket.customer_name,
    channel: selectedTicket.channel
  },
  complaint_details: {
    category: selectedTicket.category,
    severity: selectedTicket.severity,
    original_complaint: selectedTicket.description,
    ai_handoff_summary: selectedTicket.ai_handoff_summary || "Automated escalation by CMS"
  },
  compliance_flags: {
    is_direct_escalation: selectedTicket.is_direct_sama_eligible,
    is_sla_breached: selectedTicket.is_sla_breached,
    customer_consent_confirmed: true
  }
}, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Webhook Callback Simulator Form */}
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Simulate SAMA Asynchronous Webhook Callback (SAMA → Bank CMS)</span>
                </div>

                <form onSubmit={handleWebhookSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">New Regulatory Status</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="Resolved">Resolved (Order Bank Resolution)</option>
                      <option value="Closed">Closed by Regulator</option>
                      <option value="In Progress at SAMA">In Progress at Regulatory Committee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">SAMA Official Resolution Notes</label>
                    <textarea
                      rows={3}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40"
                  >
                    <span>Trigger Webhook Notification to Bank CMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-2xl border border-white/10 text-slate-400">
              Select an escalated case from the inbox on the left to inspect SAMA gateway payloads and trigger simulated regulator webhook callbacks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
