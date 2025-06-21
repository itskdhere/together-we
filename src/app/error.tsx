"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-900/30 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Something went wrong!
          </CardTitle>{" "}
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-300">
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="text-left">
              <details className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                <summary className="cursor-pointer text-sm font-medium text-gray-200 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-400 whitespace-pre-wrap overflow-auto">
                  {error.message}
                </pre>
              </details>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
