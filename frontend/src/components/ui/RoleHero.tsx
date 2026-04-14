const accentClasses = {
  primary: {
    gradient: 'from-primary-600 to-primary-700',
    textMuted: 'text-primary-100',
  },
  green: {
    gradient: 'from-green-600 to-green-700',
    textMuted: 'text-green-100',
  },
  orange: {
    gradient: 'from-orange-600 to-orange-700',
    textMuted: 'text-orange-100',
  },
} as const;

export default function RoleHero({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent: keyof typeof accentClasses;
}) {
  return (
    <div className={`bg-gradient-to-r ${accentClasses[accent].gradient} rounded-2xl p-8 mb-8 text-white`}>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className={accentClasses[accent].textMuted}>{description}</p>
    </div>
  );
}
