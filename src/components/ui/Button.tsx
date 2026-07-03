import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "bg-amber-500 text-black hover:bg-amber-400 font-semibold",
  outline:
    "border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black",
  ghost: "text-amber-400 hover:bg-white/10",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  link: "text-amber-400 underline-offset-4 hover:underline",
};

const sizeClasses = {
  default: "h-10 px-6 py-2",
  sm: "h-8 px-4 text-sm",
  lg: "h-12 px-8 text-lg",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
