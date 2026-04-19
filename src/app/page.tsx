import Link from "next/link";
import {
  Mail,
  User,
  BookDashed,
  File,
  ChevronRight,
  CircleCheck,
} from "lucide-react";

const features = [
  {
    icon: User,
    title: "Contact Management",
    description:
      "Organize your contacts with rich profiles, company associations, and smart filtering by role or position type.",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    icon: BookDashed,
    title: "Email Templates",
    description:
      "Build reusable templates with dynamic placeholders like {{firstName}}, {{companyName}}, and custom link fields.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: Mail,
    title: "Scheduled Campaigns",
    description:
      "Compose personalized emails, pick your recipients, and schedule delivery down to the minute.",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    icon: File,
    title: "File Attachments",
    description:
      "Upload resumes, cover letters, and documents once — attach them to any email campaign effortlessly.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const steps = [
  {
    step: "01",
    title: "Add Your Contacts",
    description:
      "Import or manually add contacts with their details, company info, and professional profiles.",
  },
  {
    step: "02",
    title: "Create a Template",
    description:
      "Write your email once using dynamic placeholders that auto-fill per recipient.",
  },
  {
    step: "03",
    title: "Send & Track",
    description:
      "Select recipients, schedule your campaign, and monitor delivery through email records.",
  },
];

const highlights = [
  "Personalized emails at scale",
  "Dynamic placeholder system",
  "Schedule for any date & time",
  "Attach files from your library",
  "Filter contacts by role or company",
  "Dark mode support",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">HopeMailer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-[#09090b] dark:to-blue-950/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <Mail className="w-3 h-3" />
            Outreach made simple
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Mail like a pro,{" "}
            <span className="text-violet-600 dark:text-violet-400">
              every time.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            HopeMailer is your all-in-one email outreach CRM. Manage contacts,
            build templates, and send personalized campaigns — all from one
            clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
            >
              Start for free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for outreach
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            From managing contacts to scheduling campaigns — HopeMailer covers
            the full email outreach workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/20 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Get from zero to personalized campaign in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-violet-200 to-transparent dark:from-violet-800 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-4xl font-black text-violet-200 dark:text-violet-900 mb-4 select-none">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for focused outreach
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
              No bloat, no complexity. HopeMailer keeps the focus on what
              matters — getting your emails in front of the right people, with
              the right message.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <CircleCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Contacts", value: "Unlimited", icon: User, bg: "bg-violet-50 dark:bg-violet-900/20" },
              { label: "Templates", value: "Reusable", icon: BookDashed, bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Campaigns", value: "Scheduled", icon: Mail, bg: "bg-indigo-50 dark:bg-indigo-900/20" },
              { label: "Security", value: "JWT Auth", icon: File, bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            ].map((card) => (
              <div
                key={card.label}
                className={`${card.bg} rounded-2xl p-6 border border-white/50 dark:border-gray-800`}
              >
                <card.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-3" />
                <div className="font-bold text-lg">{card.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-violet-600 dark:bg-violet-700">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start mailing?
          </h2>
          <p className="text-violet-200 mb-10 text-lg">
            Sign in and launch your first campaign in minutes.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-colors shadow-xl"
          >
            Get started <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <Mail className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">HopeMailer</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} HopeMailer. All rights reserved.
          </p>
          <Link
            href="/auth"
            className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
          >
            Sign in &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
