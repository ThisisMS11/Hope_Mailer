"use client";
import Link from "next/link";
import {
  User,
  Mail,
  BookDashed,
  File,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/authentication/hooks/useAuth";

const quickActions = [
  {
    title: "Contacts",
    description: "Manage your contact list, add new profiles, and filter by role or company.",
    href: "/dashboard/contacts",
    icon: User,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-100 dark:border-violet-800/50",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  {
    title: "Email Templates",
    description: "Create reusable templates with dynamic placeholders for personalized outreach.",
    href: "/dashboard/emails/templates",
    icon: BookDashed,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800/50",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  {
    title: "Email Records",
    description: "Review your sent and scheduled campaigns, track delivery status.",
    href: "/dashboard/emails/records",
    icon: Mail,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800/50",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
  {
    title: "Files",
    description: "Upload and manage attachments like resumes, cover letters, and documents.",
    href: "/dashboard/files",
    icon: File,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800/50",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
];

const workflowSteps = [
  { icon: User, label: "Add contacts", color: "text-violet-500" },
  { icon: BookDashed, label: "Pick a template", color: "text-blue-500" },
  { icon: Mail, label: "Schedule it", color: "text-indigo-500" },
  { icon: Mail, label: "Send & track", color: "text-emerald-500" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.username?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {greeting},
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {firstName} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Welcome to your HopeMailer dashboard. Here&apos;s what you can do today.
        </p>
      </div>

      {/* Workflow strip */}
      <div className="bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-lg shadow-black/[0.05] dark:shadow-black/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            Outreach workflow
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {workflowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <step.icon className={`w-4 h-4 ${step.color}`} />
                {step.label}
              </div>
              {i < workflowSteps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex items-start gap-4 p-5 rounded-2xl border bg-white/50 backdrop-blur-sm dark:bg-white/[0.03] dark:border-white/[0.07] hover:shadow-xl hover:shadow-black/[0.06] dark:hover:shadow-black/25 hover:-translate-y-0.5 transition-all duration-200 ${action.hoverBorder}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.bg}`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {action.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 shrink-0 transition-colors" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="bg-white/50 backdrop-blur-md border border-white/70 dark:bg-white/[0.04] dark:border-white/[0.08] shadow-lg shadow-black/[0.05] dark:shadow-black/20 rounded-2xl p-5">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
          Getting started
        </h3>
        <ol className="space-y-2">
          {[
            { text: "Add your first contact", href: "/dashboard/contacts" },
            { text: "Create an email template with placeholders", href: "/dashboard/emails/templates" },
            { text: "Upload any files you want to attach", href: "/dashboard/files" },
            { text: "Go to Contacts, select recipients, and start mailing", href: "/dashboard/contacts" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <Link
                href={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:underline transition-colors"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
