export interface IPaginatedResponseMeta {
  cursor: string
  total: string | number
  stats: any
}

export interface IPaginatedResponse {
  meta: IPaginatedResponseMeta
  records: any[]
}
