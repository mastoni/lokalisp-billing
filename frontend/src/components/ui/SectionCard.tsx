export default function SectionCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </section>
  );
}
