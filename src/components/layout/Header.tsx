"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(
    () => [
      "All Categories",
      "Electronics",
      "Fashion",
      "Beauty",
      "Home & Living",
      "Gaming",
      "Sports",
      "Automotive",
      "Phones",
      "Accessories",
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    setOpen(false);
  }

  function handleSearchSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedSearch = searchTerm.trim();
    const params = new URLSearchParams();

    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }

    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 lg:w-auto">
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                DB
              </div>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold">DEAL BAZAAR</p>
                <p className="truncate text-xs text-muted-foreground">
                  Shop smart, live better.
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-4 md:flex lg:hidden">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link
                href="/wishlist"
                className="text-sm font-medium hover:text-primary"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="text-sm font-medium hover:text-primary"
              >
                Cart
              </Link>
              <Link
                href="/account"
                className="text-sm font-medium hover:text-primary"
              >
                Account
              </Link>
            </nav>
          </div>

          {/* Search area */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full flex-1 items-stretch"
          >
            {/* Category dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex h-11 items-center gap-2 rounded-l-xl border border-r-0 px-3 text-sm font-medium text-foreground transition hover:bg-muted/50"
              >
                <span className="max-w-[120px] truncate sm:max-w-[160px]">
                  {selectedCategory}
                </span>
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border bg-background shadow-lg">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-muted ${
                        selectedCategory === category
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for anything"
              className="h-11 w-full border-y px-4 text-sm outline-none placeholder:text-muted-foreground"
            />

            {/* Search button */}
            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-r-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 sm:px-5"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Right menu */}
          <nav className="hidden items-center gap-5 lg:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/wishlist"
              className="text-sm font-medium hover:text-primary"
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="text-sm font-medium hover:text-primary"
            >
              Cart
            </Link>
            <Link
              href="/account"
              className="text-sm font-medium hover:text-primary"
            >
              Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}