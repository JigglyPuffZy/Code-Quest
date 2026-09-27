import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="h-7 w-40 animate-pulse rounded-lg bg-surface-2" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />
        <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />
        <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-danger/20">
      <p className="tag text-danger">Error</p>
      <p className="mt-2 text-sm leading-6 text-mist">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="ghost" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}
