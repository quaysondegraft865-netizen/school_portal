import React, { useState } from 'react';
import { BroadcastMessage } from '../types';
import {
  getStoredBroadcasts,
  sendBroadcastMessage,
} from '../adminAdvancedService';
import { Send, MessageSquare, Radio, CheckCircle, Users, BellRing, Sparkles } from 'lucide-react';

export const BroadcastCenter: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() => getStoredBroadcasts());
  const [title, setTitle] = useState('');
  const [senderId, setSenderId] = useState('NKAS-ADMIN');
  const [targetAudience, setTargetAudience] = useState<BroadcastMessage['target_audience']>(
    'All Students & Parents'
  );
  const [channel, setChannel] = useState<BroadcastMessage['channel']>('SMS Gateway');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  // Recipient counts estimate
  const recipientCountMap: Record<BroadcastMessage['target_audience'], number> = {
    'All Students & Parents': 1330,
    'Form 2 Students Only': 726,
    'Form 3 Finalists Only': 604,
    'Boarding Students': 840,
    'Debtors / Fee Defaulters': 184,
    'Teaching Staff': 42,
  };

  const recipientCount = recipientCountMap[targetAudience] || 1000;
  const smsUnits = Math.ceil(Math.max(1, message.length) / 160);

  // Quick preset templates
  const templates = [
    {
      title: 'First Term Assessment Release',
      audience: 'All Students & Parents' as const,
      text: 'Dear Parent/Guardian, First Term Continuous Assessment marks are now available on the NKAS student portal. Log in with your wards index number to review.',
    },
    {
      title: 'SHS 2 Robotics Lab Practical Schedule',
      audience: 'Form 2 Students Only' as const,
      text: 'Notice: Mandatory Robotics & Coding laboratory sessions for Form 2 begin this week. Check class timetables for your assigned computer lab slot.',
    },
    {
      title: 'WASSCE Registration & Biodata Check',
      audience: 'Form 3 Finalists Only' as const,
      text: 'Urgent: All Form 3 finalists must verify their WAEC biodata and elective subjects at the ICT center before Friday 3:00 PM.',
    },
    {
      title: 'PTA Development Levy Reminder',
      audience: 'Debtors / Fee Defaulters' as const,
      text: 'Dear Guardian, kindly settle outstanding PTA development dues at the school bursary or via official MoMo merchant code before midterm.',
    },
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setTargetAudience(tpl.audience);
    setMessage(tpl.text);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSending(true);

    setTimeout(() => {
      const dispatched = sendBroadcastMessage({
        title,
        sender_id: senderId,
        target_audience: targetAudience,
        channel,
        message,
        recipient_count: recipientCount,
        status: 'Delivered',
      });

      setBroadcasts((prev) => [dispatched, ...prev]);
      setIsSending(false);
      setSuccessAlert(true);
      setTitle('');
      setMessage('');

      setTimeout(() => setSuccessAlert(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 text-[#d9b84a]" />
            Official Communications Desk
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            SMS Gateway & School Notice Broadcaster
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Dispatch urgent updates, exam notifications, and PTA circulars to 1,330+ guardians & students
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SMS Gateway Online (MTN / Telecel Active)</span>
        </div>
      </div>

      {successAlert && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Broadcast message successfully queued and dispatched to <strong>{recipientCount} recipients</strong> via {channel}!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dispatch Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-xs p-6">
          <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-900" />
            <span>Compose New Broadcast</span>
          </h4>

          {/* Quick Templates */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Message Presets:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors text-left"
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Message Title / Subject</label>
              <input
                type="text"
                placeholder="e.g., First Term Terminal Assessment Notice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none font-medium text-gray-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Sender Mask ID</label>
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-mono font-bold"
                >
                  <option value="NKAS-ADMIN">NKAS-ADMIN</option>
                  <option value="NKAS-BURSAR">NKAS-BURSAR</option>
                  <option value="NKAS-STEM">NKAS-STEM</option>
                  <option value="NKAS-HEAD">NKAS-HEAD</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="All Students & Parents">All Students & Parents (1,330)</option>
                  <option value="Form 2 Students Only">Form 2 Students Only (726)</option>
                  <option value="Form 3 Finalists Only">Form 3 Finalists Only (604)</option>
                  <option value="Boarding Students">Boarding Students (840)</option>
                  <option value="Debtors / Fee Defaulters">Fee Defaulters (184)</option>
                  <option value="Teaching Staff">Teaching Staff (42)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="SMS Gateway">SMS Gateway</option>
                  <option value="Student Portal Notice">Student Portal Notice</option>
                  <option value="PTA Executive Broadcast">PTA Executive Broadcast</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-gray-700">Message Content</label>
                <span className="text-[11px] text-gray-500 font-mono">
                  {message.length} chars &bull; {smsUnits} SMS {smsUnits > 1 ? 'units' : 'unit'}
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Type your official announcement here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none text-xs leading-relaxed"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Users className="w-3.5 h-3.5 text-blue-900" />
                <span>Estimated Recipients: <strong>{recipientCount} phone numbers</strong></span>
              </div>

              <button
                type="submit"
                disabled={isSending || !title || !message}
                className="custom-btn px-6 py-2.5 text-xs font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Dispatched Broadcast Feed */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-600" />
              <span>Broadcast Dispatch History</span>
            </h4>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className="p-3.5 rounded-lg border border-gray-200 bg-slate-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 leading-snug">{bc.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                      {bc.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-3">
                    {bc.message}
                  </p>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
                    <span className="font-mono text-blue-900 font-semibold">{bc.sender_id}</span>
                    <span>{bc.recipient_count} Delivered</span>
                    <span className="font-mono">{bc.sent_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
