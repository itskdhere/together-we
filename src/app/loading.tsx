import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-200 opacity-25"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-xl text-gray-900">Loading...</h3>
          <p className="text-gray-600">Please wait while we fetch your data.</p>
        </div>
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
