import AccountLayout from "@/components/account/AccountLayout";
import WishlistPageView from "@/components/account/WishlistPageView";

export default function WishlistPage() {
  return (
    <AccountLayout
      title="Wishlist"
      description="Saved products for later shopping."
    >
      <WishlistPageView />
    </AccountLayout>
  );
}