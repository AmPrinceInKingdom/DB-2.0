import Link from "next/link";
import { Package } from "lucide-react";

type Props = {
  id: string;
  date: string;
  status: string;
  total: string;
};

export default function OrderCard({ id, date, status, total }: Props) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Package className="h-5 w-5 text-red-600"/>
          </div>

          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {id}
            </p>
            <p className="text-sm text-zinc-500">
              Date: {date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              status === "Delivered"
                ? "bg-green-100 text-green-600"
                : status === "Processing"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {status}
          </span>

          <span className="font-semibold text-zinc-900 dark:text-white">
            {total}
          </span>

          <Link
            href={`/orders/${id}`}
            className="text-sm font-semibold text-red-600"
          >
            View
          </Link>

        </div>

      </div>

    </div>
  );
}