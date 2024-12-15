export default function ChartContainer({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="container-fluid bg-white p-4 rounded shadow-sm w-100 h-100 d-flex justify-content-center align-items-center flex-column">
      <h5>{label}</h5>

      {children}
    </div>
  );
}
