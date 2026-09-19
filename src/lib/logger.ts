type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
};

type LogSink = (entry: LogEntry) => void;

const consolePrefix = "[app]";

function getConsoleMethod(level: LogLevel): ((...args: unknown[]) => void) | undefined {
  if (typeof console === "undefined") return undefined;

  if (level === "error") {
    return console.error?.bind(console);
  }
  if (level === "warn") {
    return console.warn?.bind(console);
  }
  return console.info?.bind(console) ?? console.log?.bind(console);
}

const consoleSink: LogSink = (entry) => {
  const method = getConsoleMethod(entry.level);
  if (!method) return;

  const payload = entry.error
    ? [entry.message, entry.error, entry.context ?? {}]
    : [entry.message, entry.context ?? {}];

  method(consolePrefix, ...payload);
};

const sinks: LogSink[] = [consoleSink];

/**
 * Adds a custom log sink (e.g. a future backend log transport).
 * Returns an unsubscribe function.
 */
export function addLogSink(sink: LogSink): () => void {
  sinks.push(sink);
  return () => {
    const index = sinks.indexOf(sink);
    if (index !== -1) sinks.splice(index, 1);
  };
}

function dispatch(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error,
  };

  try {
    for (const sink of sinks) {
      try {
        sink(entry);
      } catch {
      }
    }
  } catch {
  }
}

interface Logger {
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, error?: Error, context?: Record<string, unknown>) => void;
}

/**
 * SSR-safe logger. Wraps console methods defensively so a missing or
 * non-configurable console never throws. Sinks make it ready for a
 * future backend log transport without changing call sites.
 */
export const logger: Logger = {
  info: (message, context) => dispatch("info", message, context),
  warn: (message, context) => dispatch("warn", message, context),
  error: (message, error, context) => dispatch("error", message, context, error),
};
