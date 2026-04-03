import OrderCard from "./OrderCard";

const orders = [
  {
    id: "DB-10245",
    date: "2026-03-25",
    status: "Delivered",
    total: "Rs 24,500",
  },
  {
    id: "DB-10231",
    date: "2026-03-22",
    status: "Processing",
    total: "Rs 15,200",
  },
  {
    id: "DB-10198",
    date: "2026-03-18",
    status: "Shipped",
    total: "Rs 39,500",
  },
];

export default function OrdersList() {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} {...order} />
      ))}
    </div>
  );
}