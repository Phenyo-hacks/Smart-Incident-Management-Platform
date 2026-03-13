"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API call
const slaData = {
  overall: 94.5,
  byPriority: [
    { priority: "P1", compliance: 100, target: 100, count: 5 },
    { priority: "P2", compliance: 92, target: 98, count: 12 },
    { priority: "P3", compliance: 95, target: 95, count: 18 },
    { priority: "P4", compliance: 97, target: 90, count: 7 },
  ],
  atRisk: [
    {
      id: "1",
      incidentNumber: "INC-2024-0039",
      title: "Cannot access shared drive",
      timeRemaining: "45 min",
      priority: "P2",
    },
    {
      id: "2",
      incidentNumber: "INC-2024-0037",
      title: "Application crashes on startup",
      timeRemaining: "2 hours",
      priority: "P3",
    },
  ],
};

function getComplianceColor(compliance: number, target: number) {
  if (compliance >= target) return "text-green-500";
  if (compliance >= target - 5) return "text-amber-500";
  return "text-destructive";
}

function getProgressColor(compliance: number, target: number) {
  if (compliance >= target) return "bg-green-500";
  if (compliance >= target - 5) return "bg-amber-500";
  return "bg-destructive";
}

export function SLAStatus() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>SLA Status</CardTitle>
          <CardDescription>Service level agreement compliance</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/analytics/sla">
            Details
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className="text-2xl font-bold text-green-500">
              {slaData.overall}%
            </span>
          </div>
          <Progress
            value={slaData.overall}
            className="h-2"
          />
        </div>

        {/* By Priority */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">By Priority</h4>
          {slaData.byPriority.map((item) => (
            <div key={item.priority} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {item.priority}
                  <span className="text-xs text-muted-foreground">
                    ({item.count} incidents)
                  </span>
                </span>
                <span
                  className={`font-medium ${getComplianceColor(
                    item.compliance,
                    item.target
                  )}`}
                >
                  {item.compliance}%
                  {item.compliance >= item.target ? (
                    <CheckCircle className="inline ml-1 size-3" />
                  ) : (
                    <AlertTriangle className="inline ml-1 size-3" />
                  )}
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${getProgressColor(
                    item.compliance,
                    item.target
                  )}`}
                  style={{ width: `${item.compliance}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* At Risk */}
        {slaData.atRisk.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              At Risk
            </h4>
            <div className="space-y-2">
              {slaData.atRisk.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 p-2"
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {incident.incidentNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {incident.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{incident.priority}</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Clock className="size-3" />
                      <span className="text-xs font-medium">
                        {incident.timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
