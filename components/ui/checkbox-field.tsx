import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, hint, className, ...props }, ref) => (
    <label className={cn("flex items-start gap-2 text-sm", className)}>
      <input ref={ref} type="checkbox" className="mt-0.5 size-4 rounded border-input accent-foreground" {...props} />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  )
);
CheckboxField.displayName = "CheckboxField";
