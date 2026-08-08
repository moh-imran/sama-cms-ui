import React from 'react';
import { X, BookOpen, AlertTriangle, ShieldCheck, Clock, Zap, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    {
      number: 1,
      name: "Direct Closure (L1 Intake)",
      trigger: "Inquiry or Suggestion resolved by Bank L1",
      result: "Case Closed without escalation",
      agentBehavior: "Classifies case, confirms no dispute keywords, and routes for straightforward L1 resolution.",
      color: "border-sky-500/40 bg-sky-950/20 text-sky-300",
      badge: "Rule 1: Direct Intake"
    },
    {
      number: 2,
      name: "Customer Dissatisfaction / Rejection",
      trigger: "Customer rejects L1's response or expresses dissatisfaction",
      result: "Auto-escalate case to Bank Level 2 (L2)",
      agentBehavior: "Monitors customer replies using sentiment analysis. On rejection signal, triggers L2 escalation & drafts handoff summary.",
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
      badge: "Rule 2: Dissatisfaction"
    },
    {
      number: 3,
      name: "SLA Breach at Level 1 (L1)",
      trigger: "L1 SLA timer expires (e.g., >72 hours) without closure",
      result: "Auto-escalate to Bank Level 2 (L2)",
      agentBehavior: "Evaluates configured SLA due dates against current time; auto-triggers L2 transfer on timer expiry.",
      color: "border-orange-500/40 bg-orange-950/20 text-orange-300",
      badge: "Rule 3: L1 SLA Breach"
    },
    {
      number: 4,
      name: "L2 Unresolved / SLA Breach at Level 2",
      trigger: "L2 timer expires (e.g., >120 hours) or case outside L2 authority",
      result: "Escalate to SAMA (Central Bank Gateway)",
      agentBehavior: "Generates executive regulatory handoff summary and submits complaint payload to SAMA platform.",
      color: "border-rose-500/40 bg-rose-950/20 text-rose-300",
      badge: "Rule 4: L2 SAMA Breach"
    },
    {
      number: 5,
      name: "Direct-to-SAMA Priority Categories",
      trigger: "Category is pre-flagged as direct escalation eligible (e.g. Fraud, Unauthorized Debit)",
      result: "Immediate L1 → SAMA path eligible",
      agentBehavior: "Checks case content against SAMA direct taxonomy during intake; flags case for immediate SAMA pathway.",
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
      badge: "Rule 5: Direct SAMA Flag"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl border border-white/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3 text-white font-bold text-lg">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3>SAMA Complaint Escalation Rules & Triage Logic</h3>
              <p className="text-xs text-slate-400 font-normal">Regulatory Escalation Framework (Rules 1 through 5)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Grid */}
        <div className="space-y-4">
          {rules.map((r) => (
            <div key={r.number} className={`p-4 rounded-xl border ${r.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-white/10">
                  {r.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">Rule #{r.number}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{r.name}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <strong className="text-slate-400">Trigger:</strong> <span className="text-slate-200">{r.trigger}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Result:</strong> <span className="text-slate-200 font-semibold">{r.result}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mt-2">
                <strong className="text-emerald-400">AI Agent Behavior:</strong> {r.agentBehavior}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
