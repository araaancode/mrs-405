"use client";
import { motion } from "framer-motion";

export default function FormSection({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="py-2"
    >
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100 mb-5">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100/60 text-gold-600 flex items-center justify-center flex-shrink-0 ring-1 ring-gold-200/60">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.section>
  );
}