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
