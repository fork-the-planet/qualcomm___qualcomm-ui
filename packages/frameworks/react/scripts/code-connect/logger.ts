import {styleText} from "node:util"

export enum LogLevel {
  Nothing = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
}

let currentLogLevel: LogLevel = LogLevel.Info

export const logger = {
  debug(...messages: unknown[]) {
    if (currentLogLevel >= LogLevel.Debug) {
      console.debug(styleText("gray", formatMessages(messages)))
    }
  },

  error(...messages: unknown[]) {
    if (currentLogLevel >= LogLevel.Error) {
      console.error(styleText("red", formatMessages(messages)))
    }
  },

  info(...messages: unknown[]) {
    if (currentLogLevel >= LogLevel.Info) {
      console.info(styleText("white", formatMessages(messages)))
    }
  },

  setLogLevel(level: LogLevel) {
    currentLogLevel = level
  },

  warn(...messages: unknown[]) {
    if (currentLogLevel >= LogLevel.Warn) {
      console.warn(styleText("yellow", formatMessages(messages)))
    }
  },
}

function formatMessages(messages: unknown[]): string {
  return messages.map((m) => (typeof m === "string" ? m : String(m))).join(" ")
}
