export function EnsoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="78" fill="none" stroke="var(--ink)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray="430 60" transform="rotate(-115 100 100)" opacity="0.92" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="var(--brass)" strokeWidth="3"
        strokeLinecap="round" strokeDasharray="60 430" transform="rotate(150 100 100)" opacity="0.8" />
    </svg>
  );
}

export function Logo({ size = 40, showWord = true }: { size?: number; showWord?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <EnsoMark size={size} />
      {showWord && (
        <span className="font-display font-semibold" style={{ fontSize: size * 0.42 }}>
          Xcellent
        </span>
      )}
    </div>
  );
}
