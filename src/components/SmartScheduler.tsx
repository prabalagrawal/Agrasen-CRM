/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, PlusCircle, CheckCircle2, User } from 'lucide-react';

interface SchedulerTask {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'installation' | 'delivery' | 'followup' | 'deadline';
  assignee: string;
}

const INITIAL_TASKS: SchedulerTask[] = [
  { id: '1', title: 'Sharma Glow Sign Board Fitment', date: '2026-07-20', time: '11:00 AM', type: 'installation', assignee: 'Sanjay Dutt' },
  { id: '2', title: 'Mittal Festive Door Wrapping', date: '2026-07-19', time: '03:00 PM', type: 'installation', assignee: 'Sanjay Dutt' },
  { id: '3', title: 'Gupta Medical Flex Delivery', date: '2026-07-17', time: '10:00 AM', type: 'delivery', assignee: 'Ramu Logistics' },
  { id: '4', title: 'Apex Academy Leaflet Printing Deadline', date: '2026-07-16', time: '05:00 PM', type: 'deadline', assignee: 'Rahul Operator' },
];

interface SmartSchedulerProps {
  lang: 'EN' | 'HI';
}

export default function SmartScheduler({ lang }: SmartSchedulerProps) {
  const [tasks, setTasks] = useState<SchedulerTask[]>(INITIAL_TASKS);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-07-16'));
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Task states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('2026-07-16');
  const [taskTime, setTaskTime] = useState('11:00 AM');
  const [taskType, setTaskType] = useState<'installation' | 'delivery' | 'followup' | 'deadline'>('installation');
  const [taskAssignee, setTaskAssignee] = useState('');

  // Handle adding new schedule task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: SchedulerTask = {
      id: `TSK-${Date.now()}`,
      title: taskTitle,
      date: taskDate,
      time: taskTime,
      type: taskType,
      assignee: taskAssignee || 'Unassigned',
    };

    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    setTaskTitle('');
  };

  // Get days of month helper
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate calendar grid array
  const generateGridDays = () => {
    const daysCount = getDaysInMonth(currentDate);
    const startDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const grid: (number | null)[] = [];

    // Empty paddings for first week
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

    // Days count
    for (let day = 1; day <= daysCount; day++) {
      grid.push(day);
    }

    return grid;
  };

  const gridDays = generateGridDays();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get tasks for a specific calendar day
  const getTasksForDay = (day: number) => {
    const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.date === dayStr);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Calendar Grid card */}
      <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider font-display">{monthName}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-mono text-[10px] font-bold cursor-pointer transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid layout */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-black text-slate-400 mb-2 uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 bg-slate-100 p-1 rounded-2xl overflow-hidden">
          {gridDays.map((day, idx) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isToday = day === 16 && currentDate.getMonth() === 6 && currentDate.getFullYear() === 2026;
            return (
              <div
                key={idx}
                className={`min-h-[75px] bg-white p-2 flex flex-col justify-between border border-slate-100 hover:bg-slate-50 transition-colors ${
                  isToday ? 'bg-red-50/40 font-bold border-red-300' : ''
                }`}
              >
                {day ? (
                  <>
                    <span className={`text-[10px] font-mono text-left font-black ${isToday ? 'text-red-650' : 'text-slate-500'}`}>
                      {day}
                    </span>
                    {/* Task flags */}
                    <div className="space-y-1 mt-1.5">
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          title={`${t.title} - ${t.assignee}`}
                          className={`text-[8px] px-1.5 py-0.5 rounded-sm truncate text-left font-mono leading-none ${
                            t.type === 'installation'
                              ? 'bg-red-50 border border-red-100 text-red-700 font-extrabold'
                              : t.type === 'delivery'
                              ? 'bg-blue-50 border border-blue-100 text-blue-700 font-bold'
                              : t.type === 'deadline'
                              ? 'bg-amber-50 border border-amber-100 text-amber-700 font-bold'
                              : 'bg-slate-100 text-slate-750 font-bold'
                          }`}
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduler tasks listing */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Clock className="w-4.5 h-4.5 text-red-600" />
              Upcoming Schedules
            </h4>
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-black cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Book Run
            </button>
          </div>

          {showAddModal && (
            <form onSubmit={handleAddTask} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-4.5 animate-fadeIn">
              <h5 className="font-black text-[10px] uppercase font-mono text-slate-800 tracking-wider">Add Calendar Entry</h5>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Sector 15 Board Fitment"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Time</label>
                  <input
                    type="text"
                    required
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 cursor-pointer focus:ring-2 focus:ring-red-500"
                  >
                    <option value="installation">Installation</option>
                    <option value="delivery">Delivery Run</option>
                    <option value="followup">Follow-up Call</option>
                    <option value="deadline">Core Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Assignee</label>
                  <input
                    type="text"
                    placeholder="e.g. Sanjay Dutt"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors">
                  Book Run
                </button>
              </div>
            </form>
          )}

          {/* List display */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {tasks
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((t) => (
                <div key={t.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 text-xs transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900 text-sm font-display">{t.title}</span>
                    <span
                      className={`text-[8px] px-2 py-0.5 rounded font-mono font-extrabold uppercase tracking-wider ${
                        t.type === 'installation'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : t.type === 'delivery'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {t.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-2.5 font-mono font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {t.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {t.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-800 mt-2 font-bold bg-slate-100/80 px-2.5 py-1 rounded-lg w-max border border-slate-200/50">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Assignee: {t.assignee}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
