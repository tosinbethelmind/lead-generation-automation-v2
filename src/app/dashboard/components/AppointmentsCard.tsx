'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/lib/appointmentManager';

export default function AppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sector, setSector] = useState<string>('all');

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const url = sector !== 'all' ? `/api/appointments?sector=${sector}` : '/api/appointments';
      const res = await fetch(url).then(r => r.json());
      if (res.success) setAppointments(res.appointments);
    } catch (e) {
      console.error('Failed to load appointments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [sector]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      loadAppointments();
    } catch (e) {
      console.error('Failed to update appointment status:', e);
    }
  };

  return (
    <div className="glassmorphism p-6 rounded-2xl border border-white/10 text-white space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📅</span> Appointment Bookings & Schedule
          </h2>
          <p className="text-sm text-slate-400">Manage client inspection tours, technical surveys, and consultations</p>
        </div>

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none"
        >
          <option value="all">All Sectors</option>
          <option value="solar">Solar Energy</option>
          <option value="real_estate">Real Estate</option>
          <option value="school">Education</option>
          <option value="medical">Healthcare</option>
          <option value="auto">Automotive</option>
          <option value="restaurant">Restaurant</option>
          <option value="legal">Legal</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
          No appointments scheduled yet.
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
          {appointments.map((a) => (
            <div key={a.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{a.service_name}</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded capitalize">{a.sector}</span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>👤 {a.customer_name} ({a.customer_phone})</span>
                  <span>📅 {a.date} at {a.time_slot}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {a.deposit_amount > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Deposit</span>
                    <span className="text-xs font-bold text-emerald-400">₦{Number(a.deposit_amount).toLocaleString()}</span>
                  </div>
                )}

                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
