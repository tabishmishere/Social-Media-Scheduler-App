import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface PlatformPickerModelProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

const PlatformPickerModel = ({
  connectedIds,
  connecting,
  onClose,
  onConnect,
}: PlatformPickerModelProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-medium">Choose a platform</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Platform list */}
        <div className="p-6 flex flex-col gap-2.5">
          {PLATFORMS.map((p) => {
            const isConnected = connectedIds.includes(p.id);
            const isConnecting = connecting === p.id;

            return (
              <button
                key={p.id}
                onClick={() => onConnect(p.id)}
                disabled={isConnected || isConnecting}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${isConnected ? "border-indigo-200 bg-indigo-50/60 cursor-default" : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50 cursor-pointer shadow-2xs"} ${isConnecting ? "opacity-60" : ""}`}
              >
                <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                  <p.icon
                    className={`size-5 ${isConnected ? "text-indigo-600" : "text-slate-600"}`}
                  />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${isConnected ? "text-indigo-950" : "text-slate-800"}`}
                  >
                    {p.name}
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    {isConnected ? "Already connected" : p.description}
                  </div>
                </div>

                {/* Display Status */}
                {isConnected && !isConnecting && (
                  <CheckCircleIcon className="size-4 text-indigo-600 shrink-0" />
                )}
                {isConnecting && (
                  <div className="size-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                {!isConnected && !isConnecting && (
                  <ExternalLinkIcon className="size-3.5 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformPickerModel;
