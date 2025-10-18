'use client';

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: '🔒',
    title: 'SSL Secured',
    description: 'Bank-level encryption protects your files',
    color: 'text-green-600'
  },
  {
    icon: '🗑️',
    title: 'Auto-Delete',
    description: 'Files removed automatically after 1 hour',
    color: 'text-blue-600'
  },
  {
    icon: '🌍',
    title: 'GDPR Compliant',
    description: 'Full compliance with privacy regulations',
    color: 'text-purple-600'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Average processing time under 30 seconds',
    color: 'text-yellow-600'
  },
  {
    icon: '✨',
    title: 'No Registration',
    description: 'Start converting immediately, no signup required',
    color: 'text-indigo-600'
  },
  {
    icon: '💰',
    title: '100% Free',
    description: 'All tools completely free with no hidden costs',
    color: 'text-emerald-600'
  }
];

interface TrustBadgesProps {
  variant?: 'horizontal' | 'grid';
  showTitle?: boolean;
  limit?: number;
}

export default function TrustBadges({
  variant = 'grid',
  showTitle = true,
  limit = 6
}: TrustBadgesProps) {
  const displayBadges = trustBadges.slice(0, limit);

  if (variant === 'horizontal') {
    return (
      <div className="py-8">
        {showTitle && (
          <h3 className="text-center text-gray-600 text-sm font-medium mb-6 uppercase tracking-wide">
            Trusted by Professionals Worldwide
          </h3>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {displayBadges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-3 group">
              <div className="text-2xl">{badge.icon}</div>
              <div>
                <div className={`font-semibold ${badge.color} group-hover:scale-105 transition-transform`}>
                  {badge.title}
                </div>
                <div className="text-gray-600 text-xs hidden md:block">
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {showTitle && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose FlipFileX?</h3>
          <p className="text-gray-600">Security, privacy, and performance you can trust</p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {displayBadges.map((badge, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <div className="text-3xl mb-3">{badge.icon}</div>
            <h4 className={`font-semibold text-sm ${badge.color} mb-2`}>
              {badge.title}
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { trustBadges };