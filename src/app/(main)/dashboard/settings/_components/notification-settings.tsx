"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

const DEFAULT_TOGGLES = [
  {
    id: "leave-requests",
    label: "Leave requests",
    description: "Notify me when a leave request needs approval.",
    enabled: true,
  },
  {
    id: "new-candidates",
    label: "New candidates",
    description: "Notify me when a candidate applies to my open roles.",
    enabled: true,
  },
  {
    id: "review-cycles",
    label: "Review cycles",
    description: "Remind me when performance review cycles open or close.",
    enabled: true,
  },
  {
    id: "onboarding",
    label: "Onboarding milestones",
    description: "Notify me when a new hire completes onboarding tasks.",
    enabled: false,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest email",
    description: "A summary of headcount, hiring and attendance changes.",
    enabled: true,
  },
];

export function NotificationSettings() {
  const [toggles, setToggles] = React.useState(DEFAULT_TOGGLES);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Notification Preferences</CardTitle>
        <CardDescription>Choose what you get notified about. Changes apply only to this session.</CardDescription>
      </CardHeader>
      <CardContent>
        {toggles.map((toggle, index) => (
          <React.Fragment key={toggle.id}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={toggle.id}>{toggle.label}</FieldLabel>
                <FieldDescription>{toggle.description}</FieldDescription>
              </FieldContent>
              <Switch
                id={toggle.id}
                checked={toggle.enabled}
                onCheckedChange={(checked) =>
                  setToggles((current) =>
                    current.map((item) => (item.id === toggle.id ? { ...item, enabled: checked } : item)),
                  )
                }
              />
            </Field>
            {index < toggles.length - 1 ? <FieldSeparator /> : null}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
