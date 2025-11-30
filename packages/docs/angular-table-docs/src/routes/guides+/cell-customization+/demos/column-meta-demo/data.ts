export type JobStatus = "Approve" | "Request Information" | "Deny"

export interface Job {
  id: number
  status?: JobStatus
  user: string
}

export interface JobStatusColumnMeta {
  onStatusUpdate: (rowIndex: number, status: JobStatus | undefined) => void
}

export const jobs: Job[] = [
  {id: 1, user: "rsmith"},
  {id: 2, user: "jpete"},
  {id: 3, user: "emartin"},
]
