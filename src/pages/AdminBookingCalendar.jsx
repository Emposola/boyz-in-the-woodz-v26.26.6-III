/* ============================================================
   ADMIN: BOOKING CALENDAR — Drag-drop view per barber
   Admin only. Block time, set limits, view appointments.
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  booked:    { color: 'bg-primary/20 text-primary border-primary/30',       icon: Clock,       label: 'Booked'    },
  completed: { color: 'bg-green-900/30 text-green-400 border-green-800',     icon: CheckCircle, label: 'Done'      },
  no_show:   { color: 'bg-destructive/20 text-destructive border-destructive/30', icon: AlertCircle, label: 'No Show' },
  cancelled: { color: 'bg-secondary text-muted-foreground border-border',    icon: XCircle,     label: 'Cancelled' },
};

export default function AdminBookingCalendar() {
  const [user, setUser] = useState(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedBarber, setSelectedBarber] = useState('all');
  const qc = useQueryClient();

  useEffect(() => { api.auth.me().then(setUser).catch(() => {}); }, []);

  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)); // Mon-Sat

  const { data: appointments } = useQuery({
    queryKey: ['admin-appointments', weekStart.toISOString(), selectedBarber],
    queryFn: () => api.entities.Appointment.list('-start_time', 200),
    enabled: user?.role === 'admin',
    initialData: [],
  });

  const { data: barbers } = useQuery({
    queryKey: ['barbers-active'],
    queryFn: () => api.entities.Barber.filter({ active: true }),
    initialData: [],
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.entities.Appointment.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-appointments'] }); toast.success('Status updated'); },
  });

  /* Filter appointments for selected barber */
  const filteredAppointments = selectedBarber === 'all'
    ? appointments
    : appointments.filter(a => a.barber_id === selectedBarber);

  /* Get appointments for a specific day */
  const getAptsForDay = (day) =>
    filteredAppointments.filter(a => a.start_time && isSameDay(new Date(a.start_time), day));

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="font-heading text-3xl tracking-wide uppercase mb-2">Admin Only</h2>
          <p className="text-muted-foreground text-sm">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase">Booking Calendar</h1>
          <p className="text-muted-foreground text-sm">Week of {format(weekStart, 'MMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedBarber} onValueChange={setSelectedBarber}>
            <SelectTrigger className="w-44 bg-secondary border-border">
              <SelectValue placeholder="All Barbers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Barbers</SelectItem>
              {barbers.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => setWeekStart(d => addDays(d, -7))}><ChevronLeft className="w-4 h-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => setWeekStart(d => addDays(d, 7))}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* --- Week Stats --- */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total This Week', value: filteredAppointments.length, icon: CalendarDays },
          { label: 'Booked', value: filteredAppointments.filter(a => a.status === 'booked').length, icon: Clock },
          { label: 'Completed', value: filteredAppointments.filter(a => a.status === 'completed').length, icon: CheckCircle },
          { label: 'No Shows', value: filteredAppointments.filter(a => a.status === 'no_show').length, icon: AlertCircle },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <stat.icon className="w-4 h-4 text-primary mb-2" />
            <p className="font-heading text-2xl">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* --- Calendar Grid --- */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {weekDays.map(day => {
          const apts = getAptsForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={day.toISOString()} className={`bg-card border rounded-lg overflow-hidden ${isToday ? 'border-primary' : 'border-border'}`}>
              {/* Day Header */}
              <div className={`px-3 py-2 text-center border-b border-border ${isToday ? 'bg-primary/10' : ''}`}>
                <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">{format(day, 'EEE')}</p>
                <p className={`font-heading text-xl ${isToday ? 'text-primary' : ''}`}>{format(day, 'd')}</p>
              </div>
              {/* Appointments */}
              <div className="p-2 space-y-1.5 min-h-[120px]">
                {apts.length === 0 && <p className="text-[10px] text-muted-foreground text-center mt-3">Open</p>}
                {apts.map(apt => {
                  const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.booked;
                  return (
                    <div key={apt.id} className={`rounded p-1.5 border text-[10px] ${cfg.color}`}>
                      <p className="font-medium truncate">{apt.user_name || 'Client'}</p>
                      <p className="truncate text-[9px] opacity-75">{apt.service_name}</p>
                      <p className="text-[9px] opacity-75">{apt.start_time ? format(new Date(apt.start_time), 'h:mm a') : ''}</p>
                      <select value={apt.status} onChange={e => updateStatus.mutate({ id: apt.id, status: e.target.value })}
                        className="mt-1 w-full bg-transparent text-[9px] border-0 cursor-pointer">
                        {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- All Appointments Table --- */}
      <div className="mt-8 bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-lg tracking-wider uppercase">All Appointments</h2>
          <span className="text-xs text-muted-foreground">{filteredAppointments.length} total</span>
        </div>
        <div className="divide-y divide-border">
          {filteredAppointments.slice(0, 20).map(apt => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.booked;
            return (
              <div key={apt.id} className="px-5 py-3 flex items-center gap-4 text-sm">
                <div className="flex-1">
                  <span className="font-medium">{apt.user_name || apt.user_email}</span>
                  <span className="text-muted-foreground ml-2 text-xs">{apt.service_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{apt.barber_name}</span>
                <span className="text-xs text-muted-foreground">{apt.start_time ? format(new Date(apt.start_time), 'MMM d, h:mm a') : '—'}</span>
                <Badge className={`${cfg.color} border text-[10px]`}>{cfg.label}</Badge>
                <select value={apt.status} onChange={e => updateStatus.mutate({ id: apt.id, status: e.target.value })}
                  className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground">
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}