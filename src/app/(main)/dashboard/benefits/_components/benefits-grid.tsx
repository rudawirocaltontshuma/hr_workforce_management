"use client";

import { HeartPulse, PiggyBank, ShieldCheck, Sparkles, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BenefitCategory, benefitsByCategory } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { StatusBadge } from "../../_components/hr/status-badge";

const CATEGORY_ICON: Record<BenefitCategory, typeof HeartPulse> = {
  Health: HeartPulse,
  Retirement: PiggyBank,
  Insurance: ShieldCheck,
  Allowances: Wallet,
  Wellness: Sparkles,
};

export function BenefitsGrid({ groups }: { groups: ReturnType<typeof benefitsByCategory> }) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ category, plans }) => {
        const Icon = CATEGORY_ICON[category];
        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-muted-foreground" />
              <h2 className="font-medium text-sm">{category}</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={plan.status} />
                      <Badge variant="outline" className="rounded-sm">
                        {Math.round(plan.participationRate * 100)}% enrolled
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-snug">{plan.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={plan.participationRate * 100} className="h-1.5" />
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">Eligibility</div>
                        <div className="text-foreground">{plan.eligibility}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Enrolled</div>
                        <div className="text-foreground">{plan.enrolledCount.toLocaleString()} employees</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-muted-foreground text-xs">
                      {plan.monthlyCost > 0 ? `$${plan.monthlyCost}/mo company cost` : "No direct monthly cost"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        demoActionToast(`Viewing "${plan.name}"`, "Plan documents are illustrative demo content.")
                      }
                    >
                      Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
