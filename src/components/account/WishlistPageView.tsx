import ProductCard from "@/components/shared/ProductCard";

const wishlist = [
  {
    id:1,
    name:"Wireless Headphones",
    price:"Rs 24,500",
    image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category:"Electronics"
  }
]

export default function WishlistPageView(){
  return(
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {wishlist.map(p=>(
        <ProductCard key={p.id} {...p}/>
      ))}
    </div>
  )
}