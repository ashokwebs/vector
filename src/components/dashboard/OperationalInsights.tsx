"use client";

import { Activity, Clock, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const upcomingProjects = [
  {
    id: 1,
    name: "Project Quantum",
    description: "Next-gen video rendering pipeline",
    status: "In Progress",
    progress: 75,
    dueDate: "Q3 2026",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    progressGradient: "from-blue-500 to-indigo-500",
  },
  {
    id: 2,
    name: "Nexus Redesign",
    description: "Overhaul of the core user dashboard",
    status: "Planning",
    progress: 25,
    dueDate: "Q4 2026",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    progressGradient: "from-purple-500 to-violet-500",
  },
  {
    id: 3,
    name: "Vanguard Launch",
    description: "Global marketing campaign execution",
    status: "Pending",
    progress: 0,
    dueDate: "Q1 2027",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    progressGradient: "from-amber-500 to-orange-500",
  },
  {
    id: 4,
    name: "Ledger API Integration",
    description: "Stripe and PayPal multi-currency support",
    status: "Completed",
    progress: 100,
    dueDate: "Q2 2026",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    progressGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    name: "Atlas Data Lake",
    description: "Enterprise user telemetry aggregation",
    status: "In Progress",
    progress: 60,
    dueDate: "Q3 2026",
    icon: Activity,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    progressGradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 6,
    name: "Prism NLU V2",
    description: "Upgraded Natural Language Understanding",
    status: "Planning",
    progress: 10,
    dueDate: "Q4 2026",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    progressGradient: "from-rose-500 to-pink-500",
  }
];

export function OperationalInsights() {
  return (
    <section className="premium-card rounded-xl p-5 flex-1">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/30">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
          Upcoming Projects
        </h3>
        <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high/50 px-2.5 py-1 rounded-lg border border-outline-variant/50 uppercase tracking-wider">
          6 Active
        </span>
      </div>

      <div className="space-y-3">
        {upcomingProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group flex flex-col p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50 hover:border-outline-variant/60 hover:bg-surface-container-lowest transition-all duration-200 cursor-default"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${project.bg} ${project.color} transition-transform duration-200 group-hover:scale-110`}>
                  <project.icon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50">
                  {project.dueDate}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                  project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                  project.status === 'Planning' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-1.5 bg-surface-container-high/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${project.progressGradient} ${
                    project.progress === 0 ? 'opacity-0' : ''
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold text-on-surface min-w-[3ch] text-right">
                {project.progress}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant text-sm font-semibold hover:bg-surface-container/50 hover:text-on-surface hover:border-outline-variant transition-all duration-200">
        View All Projects
      </button>
    </section>
  );
}
