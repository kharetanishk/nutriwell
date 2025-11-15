"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import {
  User,
  ClipboardList,
  Clock,
  CreditCard,
  Check,
  LucideIcon,
} from "lucide-react";

interface Step {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const STEPS: readonly Step[] = [
  { id: "user-details", label: "User", href: "/book/user-details", icon: User },
  { id: "recall", label: "Recall", href: "/book/recall", icon: ClipboardList },
  { id: "slot", label: "Slot", href: "/book/slot", icon: Clock },
  { id: "payment", label: "Payment", href: "/book/payment", icon: CreditCard },
];

const ICON_SIZE = {
  desktop: 18,
  mobile: 14,
} as const;

interface StepButtonProps {
  step: Step;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  isMobile: boolean;
  onNavigate: (href: string) => void;
}

const StepButton = ({
  step,
  index,
  isCompleted,
  isLocked,
  isActive,
  isMobile,
  onNavigate,
}: StepButtonProps) => {
  const Icon = step.icon;
  const size = isMobile ? ICON_SIZE.mobile : ICON_SIZE.desktop;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isLocked) onNavigate(step.href);
    },
    [isLocked, onNavigate, step.href]
  );

  const ariaLabel = `${step.label} step${
    isActive
      ? " - current"
      : isCompleted
      ? " - completed"
      : isLocked
      ? " - locked"
      : ""
  }`;

  const buttonClasses = isMobile
    ? "flex flex-col items-center w-1/4 transition-all cursor-pointer disabled:opacity-50 rounded-lg"
    : "flex-1 flex items-center gap-3 text-left transition-all cursor-pointer disabled:opacity-50 rounded-lg px-2 py-1";

  return (
    <button
      onClick={handleClick}
      disabled={isLocked}
      aria-label={ariaLabel}
      aria-current={isActive ? "step" : undefined}
      className={buttonClasses}
    >
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
          isCompleted
            ? "bg-emerald-600 text-white"
            : "bg-white border border-gray-300 text-slate-600"
        }`}
      >
        {isCompleted ? <Check size={size} /> : <Icon size={size} />}
      </div>

      {isMobile ? (
        <span
          className={`mt-1 text-[10px] font-medium truncate ${
            isCompleted ? "text-emerald-700" : "text-gray-500"
          }`}
        >
          {step.label}
        </span>
      ) : (
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-semibold truncate ${
              isCompleted ? "text-emerald-700" : "text-slate-600"
            }`}
          >
            {step.label}
          </span>
          {isActive && (
            <span className="text-xs text-emerald-600 font-medium">
              Current Step
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default function MasterStepper() {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = useMemo(() => {
    if (!pathname) return 0;

    const normalized = pathname.toLowerCase();
    const index = STEPS.findIndex((s) =>
      normalized.startsWith(s.href.toLowerCase())
    );
    return index === -1 ? 0 : index;
  }, [pathname]);

  const handleNavigation = useCallback(
    (href: string) => router.push(href),
    [router]
  );

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden sm:flex w-full bg-white/70 border border-[#e6efe7] rounded-xl p-4 backdrop-blur-sm shadow-sm">
        <div
          className="flex items-center justify-between w-full gap-6"
          role="progressbar"
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          {STEPS.map((step, i) => (
            <StepButton
              key={step.id}
              step={step}
              index={i}
              isCompleted={i <= activeIndex}
              isLocked={i > activeIndex}
              isActive={i === activeIndex}
              isMobile={false}
              onNavigate={handleNavigation}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden w-full bg-white border border-[#e6efe7] rounded-xl py-2 shadow-sm">
        <div
          className="flex items-center justify-between px-3"
          role="progressbar"
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          {STEPS.map((step, i) => (
            <StepButton
              key={step.id}
              step={step}
              index={i}
              isCompleted={i <= activeIndex}
              isLocked={i > activeIndex}
              isActive={i === activeIndex}
              isMobile={true}
              onNavigate={handleNavigation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
