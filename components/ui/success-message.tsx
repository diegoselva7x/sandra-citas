import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  children: React.ReactNode;
  className?: string;
}

export function SuccessMessage({ children, className }: SuccessMessageProps) {
  return (
    <p
      role="status"
      className={cn(
        "text-sm rounded-md px-3 py-2",
        "text-success-foreground bg-success/10",
        className
      )}
    >
      {children}
    </p>
  );
}
