"use client";

import * as React from "react";

import { Download, FileSpreadsheet, FileText, Lock, Search, Share2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type DocumentCategory, type DocumentRecord, employeeById } from "@/lib/hr";

import { demoActionToast } from "../../_components/hr/demo-toast";
import { EmptyState } from "../../_components/hr/empty-state";
import { formatDate } from "../../_components/hr/format";
import { StatusBadge } from "../../_components/hr/status-badge";

const CATEGORIES: DocumentCategory[] = [
  "Contracts",
  "Policies",
  "Certificates",
  "Training",
  "Identification",
  "Company Documents",
];

function fileIcon(fileType: DocumentRecord["fileType"]) {
  return fileType === "XLSX" ? FileSpreadsheet : FileText;
}

export function DocumentsBrowser({ documents }: { documents: DocumentRecord[] }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<"All" | DocumentCategory>("All");
  const [selected, setSelected] = React.useState<DocumentRecord | null>(null);

  const filtered = documents.filter(
    (doc) => (category === "All" || doc.category === category) && doc.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <Card>
        <CardHeader className="border-b has-data-[slot=card-action]:grid-cols-1 md:has-data-[slot=card-action]:grid-cols-[1fr_auto]">
          <CardTitle className="text-xl leading-none">Document Center</CardTitle>
          <CardDescription>{documents.length.toLocaleString()} documents across every category</CardDescription>
          <CardAction className="col-start-1 flex w-full flex-wrap gap-2 md:col-start-2 md:row-span-2 md:w-auto md:justify-end">
            <InputGroup className="h-8 w-full md:w-64">
              <InputGroupAddon align="inline-start">
                <Search className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
            <Button
              size="sm"
              onClick={() => demoActionToast("Upload document", "This demo does not store real files.")}
            >
              <Upload /> Upload
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs value={category} onValueChange={(value) => setCategory(value as "All" | DocumentCategory)}>
            <div className="scrollbar-none touch-pan-x overflow-x-auto">
              <TabsList className="w-max min-w-full justify-start">
                <TabsTrigger value="All">All</TabsTrigger>
                {CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents found"
              description="Try a different search term or category."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, 60).map((doc) => {
                const Icon = fileIcon(doc.fileType);
                const owner = doc.employeeId ? employeeById.get(doc.employeeId)?.name : doc.owner;
                return (
                  <button
                    type="button"
                    key={doc.id}
                    onClick={() => setSelected(doc)}
                    className="flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium text-sm">{doc.title}</span>
                        {doc.confidential ? <Lock className="size-3 shrink-0 text-muted-foreground" /> : null}
                      </div>
                      <div className="truncate text-muted-foreground text-xs">
                        {owner} · {formatDate(doc.uploadedDate)}
                      </div>
                      <div className="mt-1.5">
                        <StatusBadge status={doc.status} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {filtered.length > 60 ? (
            <p className="text-center text-muted-foreground text-xs">Showing 60 of {filtered.length} documents.</p>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.category} · {selected.fileType} · {(selected.sizeKb / 1024).toFixed(1)} MB
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span>
                    {selected.employeeId
                      ? (employeeById.get(selected.employeeId)?.name ?? selected.owner)
                      : selected.owner}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span>{formatDate(selected.uploadedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidential</span>
                  <span>{selected.confidential ? "Yes" : "No"}</span>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => demoActionToast("Sharing link copied", "This is a demo — no real link was created.")}
                >
                  <Share2 /> Share
                </Button>
                <Button onClick={() => demoActionToast("Download started", "This demo does not generate a real file.")}>
                  <Download /> Download
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
