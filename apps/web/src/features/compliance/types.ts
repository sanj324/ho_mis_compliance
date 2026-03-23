export type ComplianceSummary = {
  openEvents: number;
  highSeverityOpen: number;
  overdueCalendarItems: number;
  upcomingCalendarItems: number;
  byModule: Array<{
    moduleName: string;
    count: number;
  }>;
};

export type ComplianceEventItem = {
  id: string;
  moduleName: string;
  entityType: string;
  entityId: string;
  ruleCode: string;
  ruleDescription: string;
  severity: string;
  status: string;
  detectedOn: string;
  dueDate: string | null;
};

export type ComplianceCalendarItem = {
  id: string;
  title: string;
  moduleName: string;
  frequency: string;
  dueDate: string;
  status: string;
};
