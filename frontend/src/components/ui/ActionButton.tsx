import Link from 'next/link';

const accentClasses = {
  primary: 'hover:border-primary-500 hover:bg-primary-50',
  green: 'hover:border-green-500 hover:bg-green-50',
  orange: 'hover:border-orange-500 hover:bg-orange-50',
} as const;

export default function ActionButton({
  icon,
  label,
  accent = 'primary',
  href,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: keyof typeof accentClasses;
  href?: string;
}) {
  const className = `flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg transition ${accentClasses[accent]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        <div className="h-6 w-6 text-gray-600 mr-2">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </Link>
    );
  }

  return (
    <button className={className}>
      <div className="h-6 w-6 text-gray-600 mr-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
