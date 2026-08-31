"use client";

import { useShallow } from "zustand/react/shallow";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fontOptions } from "@/lib/fonts/registry";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function AppearanceSettings() {
  const { values, resolvedThemeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({
      values: state.values,
      resolvedThemeMode: state.resolvedThemeMode,
      setPreference: state.setPreference,
    })),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Appearance</CardTitle>
        <CardDescription>
          Choose how Dimension People looks for you. These preferences are saved to this browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldContent>
            <FieldLabel>Theme mode</FieldLabel>
          </FieldContent>
          <ToggleGroup
            variant="outline"
            type="single"
            value={values.theme_mode}
            onValueChange={(value: ThemeMode | "") => value && setPreference("theme_mode", value)}
          >
            <ToggleGroupItem value="light">Light</ToggleGroupItem>
            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
            <ToggleGroupItem value="system">System</ToggleGroupItem>
          </ToggleGroup>
        </Field>

        <Field>
          <FieldContent>
            <FieldLabel>Color preset</FieldLabel>
          </FieldContent>
          <Select
            value={values.theme_preset}
            onValueChange={(value: ThemePreset) => setPreference("theme_preset", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {THEME_PRESET_OPTIONS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor: resolvedThemeMode === "dark" ? preset.primary.dark : preset.primary.light,
                      }}
                    />
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field className="sm:col-span-2">
          <FieldContent>
            <FieldLabel>Font</FieldLabel>
          </FieldContent>
          <Select
            value={values.font}
            onValueChange={(value) => setPreference("font", value as (typeof fontOptions)[number]["key"])}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {fontOptions.map((font) => (
                  <SelectItem key={font.key} value={font.key}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  );
}
