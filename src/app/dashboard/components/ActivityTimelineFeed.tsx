'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ACTIVITY_ICONS } from '@/lib/activityLogger';

export default function ActivityTimelineFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activities?limit=50').then(r => r.json());
      if (res.success) {
        setActivities(res.activities);
      }
    } catch (e) {
      console.error('Failed to load activities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 3000); // Live poll every 3s
    return () => clearInterval(interval);
  }, []);

  const filteredActivities = filterChannel === 'all'
    ? activities
    : activities.filter(a => a.channel === filterChannel);

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📜</span> Real-Time Activity Timeline
          </h2>
          <p className="text-sm text-slate-400">Chronological history of outreach, stage changes, and engagements</p>
        </div>

        {/* Filter channel */}
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none"
        >
          <option value="all">All Channels</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="pipeline">Pipeline</option>
          <option value="chatbot">Chatbot</option>
          <option value="appointment">Appointment</option>
        </select>
      </div>

      {loading && activities.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading activity feed...</div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">No activity recorded yet</div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredActivities.map((act) => {
            const config = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS['custom'];
            const formattedTime = new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedDate = new Date(act.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <div key={act.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className="absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm border border-slate-900"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>

                <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{config.label}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{formattedDate} • {formattedTime}</span>
                  </div>

                  <p className="text-slate-300 mt-1">{act.description}</p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      Channel: {act.channel}
                    </span>
                    {act.actor && <span>By: {act.actor}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
