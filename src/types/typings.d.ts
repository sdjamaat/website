export interface HijriYearDocument {
  activeMenu: string
  lastActiveMenu: string
  finished: string[]
}

export interface FamilySubmissionData {
  submittedBy: {
    uid: string
    firstname: string
    lastname: string
  }
  code: string
  selections: Map<string, string>
  familyDisplayName: string
}

export interface ThaaliItem {
  reasonNoThaali: string | null
  id: string
  nothaali: boolean
  date: string
  name: string
}

export interface MenuData {
  timestamp: {
    seconds: number
    nanoseconds: number
  }
  displayYear: number
  status: "active" | "queued" | "deactivated"
  displayMonthName: string
  submissions: string[]
  items: ThaaliItem[]
}

export interface DistributionDateMetadata {
  distDate: string
  isFirstItem: Boolean
}

export type SelectToggleType =
  | "individual"
  | "Full"
  | "Half"
  | "Quarter"
  | "No Thaali"

export type GroupToggle = "distribution-date" | "calendar-date"

export interface FormValues {
  items?: Map<string, SelectToggleType>
  [`select-toggle`]?: SelectToggleType
  [`group-toggle`]?: GroupToggle
}

export interface ValuesFromSelectItems extends FormValues {
  distDateMap: Map<string, DistributionDateMetadata>
}
