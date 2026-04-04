import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export type DrawerCartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartDrawerItemProps = {
  item: DrawerCartItem;
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

export default function CartDrawerItem({ item }: CartDrawerItemProps) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex gap-3">
        <Link
          href={`/product/${item.id}`}
          className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white dark:bg-zinc-950"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/product/${item.id}`}>
              <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-red-600 dark:text-white dark:hover:text-red-400">
                {item.name}
              </h3>
            </Link>

            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400"
              aria-label="Remove item"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {formatCurrency(item.price)}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}