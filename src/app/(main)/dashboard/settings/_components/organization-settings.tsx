"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { demoActionToast } from "../../_components/hr/demo-toast";

export function OrganizationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Organization Profile</CardTitle>
        <CardDescription>Basic information shown across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="org-name">Company name</FieldLabel>
          </FieldContent>
          <Input id="org-name" defaultValue="Solstice Technologies, Inc." />
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="org-domain">Primary domain</FieldLabel>
          </FieldContent>
          <Input id="org-domain" defaultValue="solsticetech.com" />
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="org-hq">Headquarters</FieldLabel>
          </FieldContent>
          <Input id="org-hq" defaultValue="San Francisco, CA" />
        </Field>
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="org-industry">Industry</FieldLabel>
          </FieldContent>
          <Input id="org-industry" defaultValue="Enterprise Software" />
        </Field>
        <Field className="sm:col-span-2">
          <FieldContent>
            <FieldLabel htmlFor="org-about">About</FieldLabel>
          </FieldContent>
          <Textarea
            id="org-about"
            rows={3}
            defaultValue="Solstice Technologies builds cloud infrastructure tools for engineering teams worldwide."
          />
        </Field>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={() => demoActionToast("Organization settings saved", "Changes are not persisted in this demo.")}
        >
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
