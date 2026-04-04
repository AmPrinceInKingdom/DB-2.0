import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type FormMessageProps = {
  type: "success" | "error" | "info";
  message: string;
};

export default function FormMessage({
  type,
  message,
}: FormMessageProps) {
  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300",
    error:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
    info:
      "border-border bg-muted/30 text-muted-foreground",
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-[18px] border px-4 py-3 text-sm ${styles[type]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-6">{message}</p>
    </div>
  );
}