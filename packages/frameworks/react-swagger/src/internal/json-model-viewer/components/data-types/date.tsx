import {defineEasyType} from "./define-easy-type"

const displayOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  weekday: "short",
  year: "numeric",
}

export const dateType = defineEasyType<Date>({
  Renderer: ({value}) => (
    <>{value.toLocaleTimeString("en-us", displayOptions)}</>
  ),
  colorKey: "base0D",
  is: (value) => value instanceof Date,
  type: "date",
})
