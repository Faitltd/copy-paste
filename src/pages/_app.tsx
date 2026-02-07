import "@/styles/globals.css"

import type { AppProps } from "next/app"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

import { isTauri } from "@/lib/tauri"

const getErrorDetails = (error: unknown) => {
  if (error instanceof Error) {
    return error.stack ?? error.message
  }

  if (typeof error !== "object" || error === null) return undefined
  if (!("stack" in error)) return undefined

  const stack = (error as { stack?: unknown }).stack
  return typeof stack === "string" ? stack : undefined
}

const stringifyUnknown = (value: unknown) => {
  if (typeof value === "string") return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!isTauri()) return

    const send = async (
      level: "debug" | "info" | "warn" | "error",
      message: string,
      details?: string,
    ) => {
      try {
        const { invoke } = await import("@tauri-apps/api/tauri")
        await invoke("frontend_log", { level, message, details })
      } catch {
        // Ignore logging failures.
      }
    }

    const onError = (event: ErrorEvent) => {
      const details =
        getErrorDetails(event.error) ??
        `${event.filename}:${String(event.lineno)}:${String(event.colno)}`
      void send("error", event.message, details)
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason: unknown = event.reason
      const details = getErrorDetails(reason) ?? stringifyUnknown(reason)
      void send("error", "Unhandled promise rejection", details)
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onUnhandledRejection)

    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onUnhandledRejection)
    }
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
