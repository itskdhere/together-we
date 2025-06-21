import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-400 opacity-25"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-xl text-white">Loading...</h3>
          <p className="text-gray-300">Please wait while we fetch your data.</p>
        </div>
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
