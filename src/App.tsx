import React, { useState, useEffect } from 'react';
import { CustomerPortal } from './components/CustomerPortal';
import { BankAgentPortal } from './components/BankAgentPortal';
import { SamaGatewayPortal } from './components/SamaGatewayPortal';
import { SlaConfigModal } from './components/SlaConfigModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { Ticket, TicketComment, TriageAuditLog } from './types';
import { Building2, User, ShieldCheck, RefreshCw, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'bank_agent' | 'sama_gateway'>('customer');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [auditLogs, setAuditLogs] = useState<TriageAuditLog[]>([]);
  const [isSlaConfigOpen, setIsSlaConfigOpen] = useState(false);
  const [isRulesGuideOpen, setIsRulesGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets/');
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
        if (!selectedTicketId && data.tickets.length > 0) {
          setSelectedTicketId(data.tickets[0].ticket_id);
        }
      }
    } catch (err) {
      console.error("Error fetching tickets", err);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      if (data.ticket) {
        setSelectedTicket(data.ticket);
        setComments(data.comments || []);
        setAuditLogs(data.audit_trail || []);
      }
    } catch (err) {
      console.error("Error fetching ticket details", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    }
  }, [selectedTicketId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePostReply = async (ticketId: string, authorRole: string, authorName: string, content: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_role: authorRole,
          author_name: authorName,
          content
        })
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        if (data.rule_2_triggered) {
          showToast(`⚠️ Rule 2 Triggered! Customer dissatisfaction detected. Case auto-escalated to Level 2.`);
        } else {
          showToast(`Response posted successfully.`);
        }
        await fetchTickets();
        await fetchTicketDetails(ticketId);
      }
    } catch (err) {
      console.error("Error posting reply", err);
    }
  };

  const handleEscalate = async (ticketId: string, targetLevel: string, reason: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_level: targetLevel, reason })
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        showToast(`Case ${ticketId} escalated to ${targetLevel}.`);
        await fetchTickets();
        await fetchTicketDetails(ticketId);
      }
    } catch (err) {
      console.error("Error escalating case", err);
    }
  };

  const handleSyncSama = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/sama-sync`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        showToast(`✅ Synced with SAMA Gateway! Assigned Ref: ${data.sama_result.sama_reference_id}`);
        await fetchTickets();
        await fetchTicketDetails(ticketId);
      }
    } catch (err) {
      console.error("Error syncing with SAMA", err);
    }
  };

  const handleTriggerSamaWebhook = async (ticketId: string, statusUpdate: string, resolutionNotes: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}/sama-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_update: statusUpdate, resolution_notes: resolutionNotes })
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        showToast(`SAMA Webhook received: Ticket status updated to ${statusUpdate}.`);
        await fetchTickets();
        await fetchTicketDetails(ticketId);
      }
    } catch (err) {
      console.error("Error triggering SAMA webhook", err);
    }
  };

  const handleCheckSLAs = async () => {
    try {
      const res = await fetch('/api/tickets/check-slas', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        showToast(`Dynamic SLA Check Complete! ${data.breached_count} SLA breaches evaluated.`);
        await fetchTickets();
        if (selectedTicketId) await fetchTicketDetails(selectedTicketId);
      }
    } catch (err) {
      console.error("Error checking SLAs", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 glass-panel border border-emerald-500/40 bg-emerald-950/90 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-900/40">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-wide">
                Saudi Central Bank (SAMA) Complaint Management Platform
              </h1>
              <p className="text-xs text-slate-400">Powered by Complaint Triage AI Agent & Mock SAMA Adapter</p>
            </div>
          </div>

          {/* Navigation Role Tabs */}
          <nav className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'customer'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('bank_agent')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'bank_agent'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bank Agent Workstation (L1 / L2)</span>
            </button>

            <button
              onClick={() => setActiveTab('sama_gateway')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'sama_gateway'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>SAMA Regulator Portal</span>
            </button>

            <button
              onClick={() => setIsRulesGuideOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Escalation Rules Guide</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === 'customer' && (
          <CustomerPortal
            tickets={tickets}
            onTicketCreated={fetchTickets}
            onSelectTicket={setSelectedTicketId}
            selectedTicket={selectedTicket}
            comments={comments}
            onPostReply={handlePostReply}
          />
        )}

        {activeTab === 'bank_agent' && (
          <BankAgentPortal
            tickets={tickets}
            selectedTicket={selectedTicket}
            comments={comments}
            auditLogs={auditLogs}
            onSelectTicket={setSelectedTicketId}
            onPostReply={handlePostReply}
            onEscalate={handleEscalate}
            onSyncSama={handleSyncSama}
            onCheckSLAs={handleCheckSLAs}
            onOpenSlaConfig={() => setIsSlaConfigOpen(true)}
          />
        )}

        {activeTab === 'sama_gateway' && (
          <SamaGatewayPortal
            tickets={tickets}
            onTriggerWebhook={handleTriggerSamaWebhook}
          />
        )}
      </main>

      {/* SLA Settings Modal */}
      <SlaConfigModal
        isOpen={isSlaConfigOpen}
        onClose={() => setIsSlaConfigOpen(false)}
        onSaved={() => {
          showToast("SLA Configuration updated.");
          fetchTickets();
        }}
      />

      {/* Escalation Rules Guide Modal */}
      <RulesGuideModal
        isOpen={isRulesGuideOpen}
        onClose={() => setIsRulesGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        Bank CMS & SAMA Integration Framework • AI Agent Compliance Triage Architecture • MVP Mode
      </footer>
    </div>
  );
};
