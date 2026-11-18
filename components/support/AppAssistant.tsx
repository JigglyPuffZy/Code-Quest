"use client";
import dynamic from "next/dynamic";
import { useDevyyyyy } from "@/components/support/DevyyyyyProvider";
import { MessageSquare, X } from "lucide-react";

const Chat = dynamic(() => import("@/components/support/DevyyyyyChat").then((module) => module.DevyyyyyChat), {
  ssr: false,
  loading: () => <p role="status" className="workspace-assistant-loading">Opening coding assistant…</p>,
});
export function AppAssistant() {
  const { open, hasOpened, openChat, closeChat } = useDevyyyyy();
  return <>{hasOpened ? <Chat variant="app" hideLauncher /> : null}<button type="button" className="workspace-assistant-trigger" aria-label={open ? "Close coding assistant" : "Open coding assistant"} aria-expanded={open} onClick={() => open ? closeChat() : openChat()}>{open ? <X size={17} /> : <MessageSquare size={17} />}<span>Assistant</span></button></>;
}
