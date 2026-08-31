"use client";

import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/lib/preferences/layout";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function DisplaySettings() {
  const { values, setPreference, resetPreferences } = usePreferencesStore(
    useShallow((state) => ({
      values: state.values,
      setPreference: state.setPreference,
      resetPreferences: state.resetPreferences,
    })),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Display</CardTitle>
        <CardDescription>Adjust density and layout for the dashboard shell.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldContent>
            <FieldLabel>Page layout</FieldLabel>
          </FieldContent>
          <ToggleGroup
            variant="outline"
            type="single"
            value={values.content_layout}
            onValueChange={(value: ContentLayout | "") => value && setPreference("content_layout", value)}
          >
            <ToggleGroupItem value="centered">Centered</ToggleGroupItem>
            <ToggleGroupItem value="full-width">Full width</ToggleGroupItem>
          </ToggleGroup>
        </Field>

        <Field>
          <FieldContent>
            <FieldLabel>Navbar behavior</FieldLabel>
          </FieldContent>
          <ToggleGroup
            variant="outline"
            type="single"
            value={values.navbar_style}
            onValueChange={(value: NavbarStyle | "") => value && setPreference("navbar_style", value)}
          >
            <ToggleGroupItem value="sticky">Sticky</ToggleGroupItem>
            <ToggleGroupItem value="scroll">Scroll</ToggleGroupItem>
          </ToggleGroup>
        </Field>

        <Field>
          <FieldContent>
            <FieldLabel>Sidebar style</FieldLabel>
          </FieldContent>
          <ToggleGroup
            variant="outline"
            type="single"
            value={values.sidebar_variant}
            onValueChange={(value: SidebarVariant | "") => value && setPreference("sidebar_variant", value)}
          >
            <ToggleGroupItem value="sidebar">Sidebar</ToggleGroupItem>
            <ToggleGroupItem value="inset">Inset</ToggleGroupItem>
            <ToggleGroupItem value="floating">Floating</ToggleGroupItem>
          </ToggleGroup>
        </Field>

        <Field>
          <FieldContent>
            <FieldLabel>Sidebar collapse mode</FieldLabel>
          </FieldContent>
          <ToggleGroup
            variant="outline"
            type="single"
            value={values.sidebar_collapsible}
            onValueChange={(value: SidebarCollapsible | "") => value && setPreference("sidebar_collapsible", value)}
          >
            <ToggleGroupItem value="icon">Icon</ToggleGroupItem>
            <ToggleGroupItem value="offcanvas">Off-canvas</ToggleGroupItem>
          </ToggleGroup>
        </Field>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={resetPreferences}>
          Restore defaults
        </Button>
      </CardFooter>
    </Card>
  );
}
