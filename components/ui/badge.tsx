import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold text-brown-deep",
        secondary: "border-transparent bg-cream-mid text-foreground",
        outline: "border-gold/60 text-gold",
        deep: "border-transparent bg-brown-deep text-cream",
        act1: "border-transparent bg-act1 text-cream",
        act2: "border-transparent bg-act2 text-cream",
        act3: "border-transparent bg-act3 text-cream",
        success: "border-transparent bg-emerald-600 text-white",
        warning: "border-transparent bg-amber-500 text-white",
        destructive: "border-transparent bg-terra text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
