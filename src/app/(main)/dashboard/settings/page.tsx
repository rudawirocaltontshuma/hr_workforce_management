import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PageHeader } from "../_components/hr/page-header";
import { AppearanceSettings } from "./_components/appearance-settings";
import { DisplaySettings } from "./_components/display-settings";
import { NotificationSettings } from "./_components/notification-settings";
import { OrganizationSettings } from "./_components/organization-settings";
import { PreferencesSettings } from "./_components/preferences-settings";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage organization, appearance, notification and display preferences."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]}
      />

      <Tabs defaultValue="organization" className="gap-4">
        <div className="scrollbar-none touch-pan-x overflow-x-auto">
          <TabsList className="w-max min-w-full justify-start">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="organization">
          <OrganizationSettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>
        <TabsContent value="display">
          <DisplaySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
