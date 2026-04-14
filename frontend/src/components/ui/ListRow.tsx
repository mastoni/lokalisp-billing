export default function ListRow({
  left,
  right,
  className = '',
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 ${className}`}>
      <div className="flex-1 min-w-0">{left}</div>
      {right ? <div className="flex items-center space-x-2 ml-4">{right}</div> : null}
    </div>
  );
}
