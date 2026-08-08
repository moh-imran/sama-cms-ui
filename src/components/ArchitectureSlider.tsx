import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Layers, Cpu, ArrowRight, Users, Bot, ShieldCheck, Building2, MessageCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureSlider: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for entrance animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const goTo = (index: number) => {
    if (animating || index === activeSlide) return;
    setAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setAnimating(false), 500);
  };

  const next = () => goTo(activeSlide === 0 ? 1 : 0);
  const prev = () => goTo(activeSlide === 0 ? 1 : 0);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto py-6 md:items-center transition-all duration-500 ${
        visible ? 'bg-slate-950/95 backdrop-blur-xl' : 'bg-slate-950/0 backdrop-blur-none pointer-events-none'
      }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={`absolute top-6 right-6 z-[70] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Slide Container */}
      <div
        className={`w-full max-w-6xl mx-4 transition-all duration-700 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        {/* Slide Content */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          {/* Slide 1: Current Architecture */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeSlide === 0
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-12">
              {/* Slide Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-sky-500/10 text-sky-400 px-4 py-1.5 rounded-full border border-sky-500/30 text-xs font-bold mb-4">
                  <Layers className="w-3.5 h-3.5" />
                  <span>SLIDE 1 OF 2</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  Current Architecture
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                  AI-Assisted Triage with Human Agent Processing at Every Stage
                </p>
              </div>

              {/* Architecture Diagram Image */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img
                  src="/slides/current_architecture.jpg"
                  alt="Current Architecture Diagram"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Flow Description Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { icon: <Users className="w-5 h-5" />, title: 'Customer', desc: 'Submits complaint via any channel', color: 'from-teal-500/20 to-teal-600/5 border-teal-500/30 text-teal-400' },
                  { icon: <Bot className="w-5 h-5" />, title: 'AI Triage', desc: 'Classifies, categorizes & assigns severity', color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400' },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Bank L1 Agent', desc: 'Human reviews AI suggestions & responds', color: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400' },
                  { icon: <AlertTriangle className="w-5 h-5" />, title: 'Bank L2 Specialist', desc: 'Handles escalated complex cases', color: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400' },
                  { icon: <Building2 className="w-5 h-5" />, title: 'CRA Gateway', desc: 'Regulatory body final escalation', color: 'from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400' },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className={`bg-gradient-to-b ${step.color} border rounded-xl p-4 h-full`}>
                      <div className={`mb-2 ${step.color.split(' ').pop()}`}>{step.icon}</div>
                      <h4 className="text-white text-sm font-bold mb-1">{step.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Characteristics */}
              <div className="mt-6 bg-slate-800/40 rounded-xl border border-slate-700/50 p-4">
                <h4 className="text-white text-sm font-bold mb-3">Key Characteristics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-amber-400 mt-0.5">⚡</span>
                    <span><strong className="text-white">Human-in-the-loop at every stage</strong> — Agents review & approve all AI suggestions</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-amber-400 mt-0.5">⚡</span>
                    <span><strong className="text-white">Manual escalation decisions</strong> — L1 → L2 → CRA requires human judgment</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-amber-400 mt-0.5">⚡</span>
                    <span><strong className="text-white">AI assists, humans execute</strong> — Triage Agent provides recommendations only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: Agentic Architecture */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeSlide === 1
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-950 p-8 md:p-12">
              {/* Slide Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold mb-4">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>SLIDE 2 OF 2</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  Agentic Architecture
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
                  Autonomous End-to-End Processing — Human Escalation Only When Needed
                </p>
              </div>

              {/* Architecture Diagram Image */}
              <div className="mb-8 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xl shadow-emerald-900/10">
                <img
                  src="/slides/agentic_architecture.jpg"
                  alt="Agentic Architecture Diagram"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Agentic Flow Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Autonomous Zone */}
                <div className="border border-emerald-500/30 rounded-2xl p-5 bg-emerald-950/10">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-4">
                    <Bot className="w-4 h-4" />
                    <span>Autonomous Agent Pipeline</span>
                    <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">FULLY AUTOMATED</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { agent: 'Intake Agent', action: 'Auto-classifies, validates & creates ticket instantly' },
                      { agent: 'Resolution Agent', action: 'Autonomously drafts responses, applies policy rules, resolves simple cases' },
                      { agent: 'QA Agent', action: 'Validates resolution quality & regulatory compliance automatically' },
                      { agent: 'Notification Agent', action: 'Sends response to customer & monitors satisfaction signals' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div>
                          <span className="text-white text-xs font-bold">{item.agent}</span>
                          <p className="text-slate-400 text-[11px] mt-0.5">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Human Escalation Zone */}
                <div className="border border-amber-500/30 rounded-2xl p-5 bg-amber-950/10">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm mb-4">
                    <Users className="w-4 h-4" />
                    <span>Human Escalation Path</span>
                    <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">WHEN NEEDED</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-xs font-bold">Customer Dissatisfied?</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        If customer rejects the autonomous resolution, the ticket exits the agent pipeline and enters the human escalation track.
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-2 text-amber-400">
                        <div className="w-8 border-t border-dashed border-amber-500/50"></div>
                        <ArrowRight className="w-4 h-4" />
                        <div className="w-8 border-t border-dashed border-amber-500/50"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-500/30 text-center">
                        <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <span className="text-white text-xs font-bold block">L2 Specialist</span>
                        <span className="text-slate-400 text-[10px]">Human expert review</span>
                      </div>
                      <div className="bg-rose-950/30 p-3 rounded-lg border border-rose-500/30 text-center">
                        <Building2 className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                        <span className="text-white text-xs font-bold block">CRA Authority</span>
                        <span className="text-slate-400 text-[10px]">Regulatory escalation</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20 text-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="text-emerald-300 text-[11px] font-semibold">~80% of tickets resolved without human intervention</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Improvements */}
              <div className="mt-6 bg-emerald-950/20 rounded-xl border border-emerald-500/20 p-4">
                <h4 className="text-white text-sm font-bold mb-3">Key Improvements over Current Architecture</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span><strong className="text-white">Autonomous resolution</strong> — Agents handle tickets end-to-end without waiting for humans</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span><strong className="text-white">Faster response times</strong> — No queue wait, instant AI processing pipeline</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-300">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span><strong className="text-white">Human-in-the-loop only for escalation</strong> — Preserves oversight where it matters most</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className={`flex items-center justify-between mt-6 transition-all duration-700 delay-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Prev Button */}
          <button
            onClick={prev}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeSlide === 0
                ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-default'
                : 'bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 shadow-lg'
            }`}
            disabled={activeSlide === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Current Architecture</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-3">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === i
                    ? 'w-8 h-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/40'
                    : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={next}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeSlide === 1
                ? 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-900/40'
            }`}
            disabled={activeSlide === 1}
          >
            <span>Agentic Architecture</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Skip / Dismiss hint */}
        <div className={`text-center mt-4 transition-all duration-700 delay-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
          >
            Press ESC or click ✕ to dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
