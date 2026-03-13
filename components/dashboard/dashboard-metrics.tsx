"use client";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - replace with actual API call
const metrics = {
  totalOpen: 42,
  totalOpenChange: 12,
  resolvedToday: 15,
  resolvedTodayChange: 25,
  avgResolutionTime: 4.2,
  avgResolutionTimeChange: -8,
  slaCompliance: 94.5,
  slaComplianceChange: 2.3,
};

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Open Incidents */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="w-1.5 bg-[#5B3765]" />
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Open Incidents</span>
                <div className="rounded-lg bg-[#5B3765]/10 p-2">
                  <AlertCircle className="size-4 text-[#5B3765]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.totalOpen}</div>
              <div className="flex items-center gap-1.5 mt-2">
                {metrics.totalOpenChange > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5 text-red-600 text-xs font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" />
                      +{metrics.totalOpenChange}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5 text-green-600 text-xs font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                      <TrendingDown className="size-3" />
                      {metrics.totalOpenChange}%
                    </div>
                  </>
                )}
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resolved Today */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="w-1.5 bg-[#9E6899]" />
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Resolved Today</span>
                <div className="rounded-lg bg-[#9E6899]/10 p-2">
                  <CheckCircle className="size-4 text-[#9E6899]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.resolvedToday}</div>
              <div className="flex items-center gap-1.5 mt-2">
                {metrics.resolvedTodayChange > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5 text-green-600 text-xs font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" />
                      +{metrics.resolvedTodayChange}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5 text-red-600 text-xs font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                      <TrendingDown className="size-3" />
                      {metrics.resolvedTodayChange}%
                    </div>
                  </>
                )}
                <span className="text-xs text-muted-foreground">vs yesterday</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg Resolution Time */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="w-1.5 bg-[#BA88AE]" />
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Avg. Resolution</span>
                <div className="rounded-lg bg-[#BA88AE]/10 p-2">
                  <Clock className="size-4 text-[#BA88AE]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.avgResolutionTime}h</div>
              <div className="flex items-center gap-1.5 mt-2">
                {metrics.avgResolutionTimeChange < 0 ? (
                  <>
                    <div className="flex items-center gap-0.5 text-green-600 text-xs font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                      <TrendingDown className="size-3" />
                      {metrics.avgResolutionTimeChange}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5 text-red-600 text-xs font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" />
                      +{metrics.avgResolutionTimeChange}%
                    </div>
                  </>
                )}
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Compliance */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-stretch">
            <div className="w-1.5 bg-[#D6A8C4]" />
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">SLA Compliance</span>
                <div className="rounded-lg bg-[#D6A8C4]/10 p-2">
                  <Shield className="size-4 text-[#D6A8C4]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{metrics.slaCompliance}%</div>
              <div className="flex items-center gap-1.5 mt-2">
                {metrics.slaComplianceChange > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5 text-green-600 text-xs font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="size-3" />
                      +{metrics.slaComplianceChange}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5 text-red-600 text-xs font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                      <TrendingDown className="size-3" />
                      {metrics.slaComplianceChange}%
                    </div>
                  </>
                )}
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
