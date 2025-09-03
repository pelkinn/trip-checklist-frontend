import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

type DateTime = string | number | Date | Dayjs | null
export const formatDateTime = (
  dateTime?: DateTime,
  { pattern = 'DD.MM.YYYY HH:mm', fallback = '' } = {}
) => {
  return dateTime ? dayjs(dateTime).format(pattern) : fallback
}
