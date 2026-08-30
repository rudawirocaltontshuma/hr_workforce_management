"use client";

import { BookOpen, CircleHelp, Keyboard, LifeBuoy, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { demoActionToast } from "../hr/demo-toast";

const HELP_ITEMS = [
  { icon: BookOpen, label: "Getting started guide", description: "Opens the Nexora People onboarding tour." },
  { icon: Keyboard, label: "Keyboard shortcuts", description: "Shows the shortcut reference sheet." },
  {
    icon: LifeBuoy,
    label: "Contact People Ops support",
    description: "Opens a support ticket with People Operations.",
  },
  { icon: Sparkles, label: "What's new", description: "Shows recent product updates." },
];

export function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Help">
          <CircleHelp />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Help & resources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {HELP_ITEMS.map((item) => (
            <DropdownMenuItem key={item.label} onSelect={() => demoActionToast(item.label, item.description)}>
              <item.icon />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
