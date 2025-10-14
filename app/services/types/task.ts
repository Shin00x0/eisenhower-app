

type QuadrantKey =
  | 'urgent_important'
  | 'not_urgent_important'
  | 'urgent_not_important'
  | 'not_urgent_not_important'

export type TimePeriod = 
    | 'day'
    | 'week'
    | 'month'


export interface Task {
    id: number
    owner: number,
    title : string
    date : string,
    type_task: QuadrantKey
    period: TimePeriod
}