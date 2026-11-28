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
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const MAIN_STEPS = [
  { key: 'Pending Review', label: 'Pending Review', icon: Clock },
  { key: 'Quoted', label: 'Quote Received', icon: FileCheck },
  { key: 'Accepted', label: 'Quote Accepted', icon: CheckCircle2 },
  { key: 'In Progress', label: 'In Progress', icon: Paintbrush },
  { key: 'Completed', label: 'Completed', icon: Sparkles },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Check },
];

export const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isDeclined = currentStatus === 'Declined';
  const isRejected = currentStatus === 'Rejected';
  const isCancelled = currentStatus === 'Cancelled';
  const isSideState = isDeclined || isRejected || isCancelled;

  const currentStepIndex = MAIN_STEPS.findIndex((s) => s.key === currentStatus);

  const historyMap = {};
  statusHistory.forEach((h) => {
    historyMap[h.status] = h;
  });

  return (
    <div className="space-y-6">
      {isSideState && (
        <div
          className={`p-4 rounded-[18px] border flex items-start gap-3 ${
            isCancelled || isRejected
              ? 'bg-[#fff1f2] border-[#fecdd3] text-[#9f1239]'
              : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
          }`}
        >
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-[13px]">
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

      <div className="relative">
        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:flex items-center justify-between relative z-10">
          {MAIN_STEPS.map((step, idx) => {
            const isCompleted =
              currentStepIndex > idx ||
              (currentStatus === 'Delivered' && idx === MAIN_STEPS.length - 1);
            const isCurrent = currentStatus === step.key;
            const historyItem = historyMap[step.key];
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#10b981] text-white shadow-sm ring-4 ring-[#d1fae5]'
                      : isCurrent
                      ? 'bg-[#ff0457] text-white shadow-md ring-4 ring-[#ffe5ee] scale-110'
                      : 'bg-[#f2f1f6] text-[#8e8e93] border border-[#e5e5ea]'
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>

                <div className="mt-3 space-y-0.5 px-1">
                  <p
                    className={`text-[12px] font-bold leading-tight ${
                      isCurrent
                        ? 'text-[#ff0457]'
                        : isCompleted
                        ? 'text-[#111827]'
                        : 'text-[#8e8e93]'
                    }`}
                  >
                    {step.label}
                  </p>
                  {historyItem && (
                    <p className="text-[10px] text-[#8e8e93]">
                      {formatDate(historyItem.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Connecting Line */}
        <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-[#e5e5ea] -z-0">
          <div
            className="h-full bg-[#10b981] transition-all duration-500"
            style={{
              width:
                currentStepIndex >= 0
                  ? `${(currentStepIndex / (MAIN_STEPS.length - 1)) * 100}%`
                  : '0%',
            }}
          />
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-4 border-l-2 border-[#e5e5ea] pl-4 ml-3">
          {MAIN_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStatus === step.key;
            const historyItem = historyMap[step.key];

            return (
              <div key={step.key} className="relative space-y-1">
                <div
                  className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    isCompleted
                      ? 'bg-[#10b981]'
                      : isCurrent
                      ? 'bg-[#ff0457] ring-2 ring-[#ffe5ee]'
                      : 'bg-[#d4d4d8]'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[13px] font-bold ${
                      isCurrent
                        ? 'text-[#ff0457]'
                        : isCompleted
                        ? 'text-[#111827]'
                        : 'text-[#8e8e93]'
                    }`}
                  >
                    {step.label}
                  </p>
                  {historyItem && (
                    <span className="text-[10px] text-[#8e8e93]">
                      {formatDate(historyItem.timestamp)}
                    </span>
                  )}
                </div>
                {historyItem?.note && (
                  <p className="text-[11px] text-[#6e6e73] leading-normal">
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
