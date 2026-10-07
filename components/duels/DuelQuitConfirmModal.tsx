"use client";

import { Button } from "@/components/ui/Button";
import { LogOut, Swords, X } from "lucide-react";

export function DuelQuitConfirmModal({
  open,
  busy = false,
  mode,
  rivalName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  busy?: boolean;
  mode: "cancel" | "forfeit";
  rivalName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const isCancel = mode === "cancel";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duel-quit-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-500 via-primary-500 to-violet-500 px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold">
                <Swords size={16} />
                {isCancel ? "Cancel duel?" : "Quit duel?"}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {isCancel ? "Your invite will be withdrawn." : "This counts as a forfeit."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg p-1 hover:bg-white/15 disabled:opacity-60"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <p id="duel-quit-title" className="text-sm leading-relaxed text-ink">
            {isCancel ? (
              <>
                Cancel your duel invite to <strong>{rivalName}</strong>? They will not be able to join this
                match anymore.
              </>
            ) : (
              <>
                Leave the duel against <strong>{rivalName}</strong>? They will win the series and your progress in
                this match will end.
              </>
            )}
          </p>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="flex-1" disabled={busy} onClick={onClose}>
              Keep playing
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1"
              disabled={busy}
              onClick={onConfirm}
            >
              <LogOut size={16} />
              {busy ? "Leaving…" : isCancel ? "Yes, cancel" : "Yes, quit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
