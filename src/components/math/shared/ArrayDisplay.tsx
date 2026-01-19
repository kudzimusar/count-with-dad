interface ArrayDisplayProps {
  rows: number;
  columns: number;
  showGrouping?: boolean;
}

export function ArrayDisplay({ rows, columns, showGrouping = false }: ArrayDisplayProps) {
  // Limit columns for mobile to prevent overflow
  const maxVisibleColumns = Math.min(columns, 10);
  const dotSize = columns > 6 ? 'w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10';
  const innerDotSize = columns > 6 ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3' : 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4';
  const gapSize = columns > 6 ? 'gap-1 sm:gap-1.5 md:gap-2' : 'gap-1.5 sm:gap-2';

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 w-full max-w-full overflow-x-auto">
      <div
        className={`grid ${gapSize}`}
        style={{
          gridTemplateColumns: `repeat(${maxVisibleColumns}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: rows * maxVisibleColumns }, (_, i) => (
          <div
            key={i}
            className={`${dotSize} rounded-full bg-primary flex items-center justify-center animate-bounce`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`${innerDotSize} rounded-full bg-primary-foreground`} />
          </div>
        ))}
      </div>
      {showGrouping && (
        <div className="text-sm sm:text-base md:text-lg font-semibold text-muted-foreground">
          {rows} rows × {columns} columns = {rows * columns}
        </div>
      )}
    </div>
  );
}