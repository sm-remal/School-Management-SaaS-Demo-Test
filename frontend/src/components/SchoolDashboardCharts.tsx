"use client";

import { Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weeklyAttendanceData = [
  { day: "Sun", attendance: 82 },
  { day: "Mon", attendance: 88 },
  { day: "Tue", attendance: 84 },
  { day: "Wed", attendance: 91 },
  { day: "Thu", attendance: 87 },
  { day: "Sat", attendance: 93 },
];

const monthlyAttendanceData = [
  { day: "Jan", attendance: 84 },
  { day: "Feb", attendance: 86 },
  { day: "Mar", attendance: 88 },
  { day: "Apr", attendance: 87 },
  { day: "May", attendance: 90 },
  { day: "Jun", attendance: 92 },
];

const feeData = [
  { month: "Jan", collected: 74, pending: 26 },
  { month: "Feb", collected: 82, pending: 18 },
  { month: "Mar", collected: 78, pending: 22 },
  { month: "Apr", collected: 88, pending: 12 },
  { month: "May", collected: 84, pending: 16 },
  { month: "Jun", collected: 92, pending: 8 },
];

const studentDistributionData = [
  { name: "Class 1-5", value: 5, color: "#2563eb" },
  { name: "Class 6-8", value: 4, color: "#10b981" },
  { name: "Class 9-10", value: 3, color: "#f59e0b" },
];

const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

export default function SchoolDashboardCharts() {
  const [attendanceRange, setAttendanceRange] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const attendanceData =
    attendanceRange === "weekly"
      ? weeklyAttendanceData
      : monthlyAttendanceData;
  const attendanceAverage = (
    attendanceData.reduce((total, item) => total + item.attendance, 0) /
    attendanceData.length
  ).toFixed(1);

  return (
    <section className="grid gap-5 xl:grid-cols-3">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-700" />
              <h3 className="font-semibold text-slate-900">Attendance Trend</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {attendanceRange === "weekly"
                ? "Last six school days"
                : "Monthly attendance average"}
            </p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {attendanceAverage}% avg
          </span>
        </div>

        <div className="mt-4 inline-flex rounded-md bg-slate-100 p-1">
          <button
            className={`h-8 cursor-pointer rounded px-3 text-xs font-semibold transition ${
              attendanceRange === "weekly"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setAttendanceRange("weekly")}
            type="button"
          >
            Weekly
          </button>
          <button
            className={`h-8 cursor-pointer rounded px-3 text-xs font-semibold transition ${
              attendanceRange === "monthly"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setAttendanceRange("monthly")}
            type="button"
          >
            Monthly
          </button>
        </div>

        <div className="mt-4 h-60 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={attendanceData} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
              <YAxis axisLine={false} domain={[70, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#cbd5e1" }} />
              <Line
                activeDot={{ fill: "#ffffff", r: 5, stroke: "#2563eb", strokeWidth: 3 }}
                dataKey="attendance"
                dot={{ fill: "#2563eb", r: 3, strokeWidth: 0 }}
                key={attendanceRange}
                name="Attendance %"
                stroke="#2563eb"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-slate-900">Fee Collection</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">Monthly collection status</p>
          </div>
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            92% latest
          </span>
        </div>

        <div className="mt-5 h-60 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={feeData} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
              <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="collected" fill="#10b981" name="Collected %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#fbbf24" name="Pending %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-slate-900">Student Distribution</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">Students by class group</p>
        </div>

        <div className="relative mt-3 h-48 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                data={studentDistributionData}
                dataKey="value"
                innerRadius={52}
                nameKey="name"
                outerRadius={78}
                paddingAngle={4}
                stroke="none"
              >
                {studentDistributionData.map((entry) => (
                  <Cell fill={entry.color} key={entry.name} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-slate-800">12</span>
            <span className="text-xs text-slate-500">Students</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {studentDistributionData.map((item) => (
            <div className="min-w-0 text-center" key={item.name}>
              <span
                className="mx-auto block h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="mt-1 truncate text-xs text-slate-500">{item.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
