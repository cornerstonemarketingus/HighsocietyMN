import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses = {
  default: "bg-blue-500/20 text-blue-400 border-blue-500/30",

  outline: "border border-white/20 text-gray-300",
  success: "bg-green-500/20 text-green-400 border-green-500/30",

  warning: "bg-blue-500/20 text-blue-300 border-blue-500/30",

  danger: "bg-red-500/20 text-red-400 border-red-500/30",

};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
