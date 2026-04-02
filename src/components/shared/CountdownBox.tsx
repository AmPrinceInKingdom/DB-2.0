type CountdownBoxProps = {
  value: string;
  label: string;
};

export default function CountdownBox({
  value,
  label,
}: CountdownBoxProps) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-zinc-300">{label}</div>
    </div>
  );
}