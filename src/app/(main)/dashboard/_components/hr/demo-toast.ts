"use client";

import { toast } from "sonner";

/**
 * Every "export", "download" or other backend-shaped action in this demo funnels through here so the
 * behavior stays honest: nothing is generated, sent or persisted, we just confirm the click landed.
 */
export function demoActionToast(message: string, description?: string) {
  toast(message, {
    description: description ?? "This is a front-end demo — no file was generated and no data changed.",
  });
}
