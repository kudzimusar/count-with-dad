interface ArrayDisplayProps {
  rows: number;
  columns: number;
  showGrouping?: boolean;
}

export function ArrayDisplay({ rows, columns, showGrouping = false }: ArrayDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: rows * columns }, (_, i) => (
          <div
            key={i}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center animate-bounce"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary-foreground" />
          </div>
        ))}
      </div>
      {showGrouping && (
        <div className="text-lg font-semibold text-muted-foreground">
          {rows} rows × {columns} columns = {rows * columns}
        </div>
      )}
    </div>
  );
}