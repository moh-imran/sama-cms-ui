import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Sliders } from 'lucide-react';
import { SLAConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SlaConfigModal: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [l1Hours, setL1Hours] = useState(72);
  const [l2Hours, setL2Hours] = useState(120);
  const [fraudHours, setFraudHours] = useState(24);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/tickets/sla-config/view')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setL1Hours(data.level_l1_hours || 72);
            setL2Hours(data.level_l2_hours || 120);
            if (data.category_overrides_hours) {
              setFraudHours(data.category_overrides_hours['Credit Cards - Fraud'] || 24);
            }
          }
        })
        .catch(err => console.error("Error fetching SLA config", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/tickets/sla-config/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level_l1_hours: l1Hours,
          level_l2_hours: l2Hours,
          category_overrides_hours: {
            "Credit Cards - Fraud": fraudHours,
            "Transfers - Unauthorized Debit": fraudHours
          }
        })
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save SLA config", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-white/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-bold text-lg">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Configure Bank SLA Timers</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bank Level 1 (L1) Default SLA (Hours)
            </label>
            <input
              type="number"
              value={l1Hours}
              onChange={(e) => setL1Hours(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">{(l1Hours / 24).toFixed(1)} business days</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Bank Level 2 (L2) Default SLA (Hours)
            </label>
            <input
              type="number"
              value={l2Hours}
              onChange={(e) => setL2Hours(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">{(l2Hours / 24).toFixed(1)} business days</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              High Priority Category Override (Credit Card Fraud / Unauthorized Debit) (Hours)
            </label>
            <input
              type="number"
              value={fraudHours}
              onChange={(e) => setFraudHours(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
            <span className="text-[11px] text-amber-400 font-mono mt-1 block">Expedited regulatory window for severe disputes</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save SLA Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
