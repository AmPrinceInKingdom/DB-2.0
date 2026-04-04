import { MapPin, Plus } from "lucide-react";

export default function AddressesPageView() {
  return (
    <div className="space-y-4">
      <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full">
        <Plus className="h-4 w-4"/> Add new address
      </button>

      <div className="rounded-2xl border p-4 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4"/>
          <h3 className="font-semibold">Home</h3>
        </div>

        <p className="text-sm text-zinc-500 mt-2">
          Tangalle, Sri Lanka
        </p>
      </div>
    </div>
  );
}