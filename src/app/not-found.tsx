import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-900/30 rounded-full w-fit">
            <FileQuestion className="h-8 w-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-500">404</h1>
            <p className="text-gray-300">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              asChild
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <p className="text-sm text-gray-400">
              Need help? Contact our support team or return to the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
