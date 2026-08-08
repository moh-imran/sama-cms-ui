import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, Clock, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Ticket, TicketComment } from '../types';

interface Props {
  tickets: Ticket[];
  onTicketCreated: () => void;
  onSelectTicket: (ticketId: string) => void;
  selectedTicket: Ticket | null;
  comments: TicketComment[];
  onPostReply: (ticketId: string, role: string, name: string, content: string) => void;
}

export const CustomerPortal: React.FC<Props> = ({
  tickets,
  onTicketCreated,
  onSelectTicket,
  selectedTicket,
  comments,
  onPostReply
}) => {
  const [customerName, setCustomerName] = useState('Tariq Al-Mansoor');
  const [channel, setChannel] = useState('Mobile App');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [lastCreated, setLastCreated] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          channel,
          subject,
          description
        })
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setLastCreated(data);
        setSubject('');
        setDescription('');
        onTicketCreated();
        if (data.ticket && data.ticket.ticket_id) {
          onSelectTicket(data.ticket.ticket_id);
        }
      }
    } catch (err) {
      console.error("Failed to submit complaint", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;
    onPostReply(selectedTicket.ticket_id, 'customer', selectedTicket.customer_name, replyText);
    setReplyText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Intake Form */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Submit Complaint / Request</h2>
              <p className="text-xs text-slate-400">Directly monitored by AI Complaint Triage Agent</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Mobile App">Mobile App</option>
                <option value="Online Banking">Online Banking</option>
                <option value="Branch">Branch</option>
                <option value="Call Center">Call Center</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Summary</label>
              <input
                type="text"
                placeholder="e.g., Unauthorized $500 debit on my card"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
              <textarea
                rows={4}
                placeholder="Provide detailed information regarding your dispute or inquiry..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30"
            >
              {submitting ? (
                <span>Triage Agent Processing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Ticket to Bank</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live AI Intake Result Notification */}
        {lastCreated && (
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Ticket Created ({lastCreated.ticket.ticket_id})</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                AI Triaged
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p><strong className="text-slate-400">Classified Category:</strong> {lastCreated.ai_insights.category}</p>
              <p><strong className="text-slate-400">Type:</strong> {lastCreated.ai_insights.case_type} ({lastCreated.ai_insights.severity} Severity)</p>
              {lastCreated.ai_insights.is_direct_sama_eligible && (
                <div className="flex items-center space-x-1.5 text-amber-400 pt-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-semibold">Flagged for Direct SAMA Escalation (Rule 5)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Customer Case Tracker & Interactive Thread */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">My Submitted Cases</h2>

          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
            {tickets.map((t) => (
              <div
                key={t.ticket_id}
                onClick={() => onSelectTicket(t.ticket_id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedTicket?.ticket_id === t.ticket_id
                    ? 'bg-emerald-950/40 border-emerald-500/60'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-400">{t.ticket_id}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      t.case_type === 'Complaint' ? 'badge-complaint' : t.case_type === 'Inquiry' ? 'badge-inquiry' : 'badge-suggestion'
                    }`}>
                      {t.case_type}
                    </span>
                    <span className="text-xs text-slate-400">{t.current_level}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{t.subject}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>Category: {t.category}</span>
                  <span className="text-emerald-300 font-medium">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Ticket Conversation Thread */}
        {selectedTicket && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">{selectedTicket.ticket_id}</span>
                  <h3 className="text-lg font-bold text-white">{selectedTicket.subject}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    Status: {selectedTicket.status}
                  </span>
                  {selectedTicket.sama_reference_id && (
                    <div className="text-xs text-emerald-400 font-mono mt-1">
                      SAMA Ref: {selectedTicket.sama_reference_id}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment History */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    c.author_role === 'customer'
                      ? 'bg-slate-900/80 border-slate-800 ml-6'
                      : c.author_role === 'ai_agent'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : c.author_role === 'sama_system'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-emerald-950/20 border-emerald-800/50 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-300">{c.author_name} ({c.author_role.toUpperCase()})</span>
                    <span className="text-slate-500">{new Date(c.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Box (Customer Response) */}
            <form onSubmit={handleReplySubmit} className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Reply to Bank (Test Rule 2: Express dissatisfaction to trigger auto-escalation)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g., I reject this resolution, it did not fix my issue!"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
