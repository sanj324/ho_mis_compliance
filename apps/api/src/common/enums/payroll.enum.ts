export enum AttendanceStatusEnum {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  HALF_DAY = "HALF_DAY",
  WEEK_OFF = "WEEK_OFF",
  HOLIDAY = "HOLIDAY",
  PAID_LEAVE = "PAID_LEAVE"
}

export enum LeaveStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum PayrollRunStatusEnum {
  CALCULATED = "CALCULATED",
  FINALIZED = "FINALIZED"
}

export enum PayrollExceptionSeverityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}
