export enum LoaderStatus {
  PRELOAD,
  LOAD,
  READY,
  ERROR
}

export class LoaderState {
  status: LoaderStatus
  errorStatus: boolean
  error: string
  done: number
  total: number

  constructor() {
    this.status = LoaderStatus.PRELOAD
    this.errorStatus = false
    this.error = ''
    this.done = 0
    this.total = 0
  }

  getProgress() {
    if (this.total === 0) return 0
    return Math.max(0, Math.min(100, Math.floor(100 * this.done / this.total)))
  }
}