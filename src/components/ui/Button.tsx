import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "border-2 border-black bg-green-500 text-black hover:bg-green-400 font-bold",
  outline:
    "border-2 border-black bg-white text-slate-950 hover:bg-green-50 font-bold",
  ghost: "text-green-700 hover:bg-green-50 font-bold",
  destructive: "border-2 border-black bg-red-600 text-white hover:bg-red-500 font-bold",
  link: "text-green-700 underline-offset-4 hover:underline font-bold",
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
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50",
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
