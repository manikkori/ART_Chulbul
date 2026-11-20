import React from 'react';
import {
  Clock,
  FileCheck,
  CheckCircle2,
  Paintbrush,
  Sparkles,
  Truck,
  Check,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MAIN_STEPS = [
  { key: 'Pending Review', label: 'Pending Review', icon: Clock },
  { key: 'Quoted', label: 'Quote Received', icon: FileCheck },
  { key: 'Accepted', label: 'Quote Accepted', icon: CheckCircle2 },
  { key: 'In Progress', label: 'In Progress (Painting)', icon: Paintbrush },
  { key: 'Completed', label: 'Artwork Completed', icon: Sparkles },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Check }
];

export const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isDeclined = currentStatus === 'Declined';
  const isRejected = currentStatus === 'Rejected';
  const isCancelled = currentStatus === 'Cancelled';
  const isSideState = isDeclined || isRejected || isCancelled;

  // Find index of current status in standard flow
  const currentStepIndex = MAIN_STEPS.findIndex((s) => s.key === currentStatus);

  // Map history notes by status
  const historyMap = {};
  statusHistory.forEach((h) => {
    historyMap[h.status] = h;
  });

  return (
    <div className="space-y-6">
      {/* Side state alert if applicable */}
      {isSideState && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isCancelled
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : isRejected
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold">
              {isCancelled
                ? 'Order Cancelled'
                : isRejected
                ? 'Order Rejected by Artist'
                : 'Quote Declined'}
            </p>
            <p className="leading-relaxed">
              {historyMap[currentStatus]?.note ||
                'This order is no longer following the active creation pipeline.'}
            </p>
          </div>
        </div>
      )}

      {/* Visual Step Timeline */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between relative z-10">
          {MAIN_STEPS.map((step, idx) => {
            const isCompleted =
              currentStepIndex > idx ||
              (currentStatus === 'Delivered' && idx === MAIN_STEPS.length - 1);
            const isCurrent = currentStatus === step.key;
            const historyItem = historyMap[step.key];
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 text-center group">
                {/* Circle Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300
                    ${isCompleted
                      ? 'bg-sage-600 text-white shadow-sm ring-4 ring-sage-100'
                      : isCurrent
                      ? 'bg-terracotta-500 text-white shadow-md ring-4 ring-terracotta-100 scale-110'
                      : 'bg-cream-200 text-charcoal-400 border border-cream-300'}
                  `}
                >
                  <StepIcon className="w-4 h-4" />
                </div>

                {/* Label */}
                <div className="mt-3 space-y-0.5 px-1">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-terracotta-600'
                        : isCompleted
                        ? 'text-charcoal-900'
                        : 'text-charcoal-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {historyItem && (
                    <p className="text-[10px] text-charcoal-500">
                      {formatDate(historyItem.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting Progress Bar (Desktop) */}
        <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-cream-300 -z-0">
          <div
            className="h-full bg-sage-500 transition-all duration-500"
            style={{
              width:
                currentStepIndex >= 0
                  ? `${(currentStepIndex / (MAIN_STEPS.length - 1)) * 100}%`
                  : '0%'
            }}
          />
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-4 border-l-2 border-cream-300 pl-4 ml-4">
          {MAIN_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStatus === step.key;
            const historyItem = historyMap[step.key];
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative space-y-1">
                {/* Bullet */}
                <div
                  className={`
                    absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-white
                    ${isCompleted ? 'bg-sage-500' : isCurrent ? 'bg-terracotta-500 ring-2 ring-terracotta-200' : 'bg-cream-300'}
                  `}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-terracotta-600' : isCompleted ? 'text-charcoal-800' : 'text-charcoal-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {historyItem && (
                    <span className="text-[10px] text-charcoal-400">
                      {formatDate(historyItem.timestamp)}
                    </span>
                  )}
                </div>
                {historyItem?.note && (
                  <p className="text-[11px] text-charcoal-500 leading-normal">
                    {historyItem.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;
