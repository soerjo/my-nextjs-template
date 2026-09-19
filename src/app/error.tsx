"use client";

import { useEffect } from "react";
import { Button, Card, CardContent, CardHeader } from "@heroui/react";
import { logger } from "@/lib/logger";
import { cn } from "@/utils";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled application error", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full items-center justify-center px-4",
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-danger"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-center text-sm text-default-400">
            An unexpected error occurred. Please try again.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button variant="primary" onPress={retry}>
            Try again
          </Button>
          {error.digest ? (
            <p className="text-xs text-default-300">Error ID: {error.digest}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
