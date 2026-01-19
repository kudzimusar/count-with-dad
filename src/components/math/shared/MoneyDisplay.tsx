interface Coin {
  type: 'penny' | 'nickel' | 'dime' | 'quarter' | 'dollar';
  count: number;
}

interface MoneyDisplayProps {
  coins?: Coin[];
  totalCents?: number;
  showValues?: boolean;
}

const COIN_INFO: Record<string, { emoji: string; value: number; color: string; label: string }> = {
  penny: { emoji: '🟤', value: 1, color: '#B87333', label: '1¢' },
  nickel: { emoji: '⚪', value: 5, color: '#C0C0C0', label: '5¢' },
  dime: { emoji: '⚫', value: 10, color: '#A8A8A8', label: '10¢' },
  quarter: { emoji: '🔵', value: 25, color: '#B8B8B8', label: '25¢' },
  dollar: { emoji: '💵', value: 100, color: '#85BB65', label: '$1' },
};

export function MoneyDisplay({ coins = [], totalCents, showValues = true }: MoneyDisplayProps) {
  // Flatten coins into individual items for display
  const allCoins = coins.flatMap(coin => 
    Array.from({ length: coin.count }, () => coin.type)
  );

  // Calculate total if not provided
  const calculatedTotal = totalCents ?? coins.reduce(
    (sum, coin) => sum + (COIN_INFO[coin.type]?.value || 0) * coin.count, 
    0
  );

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 w-full">
      {/* Coins grid - responsive */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-sm">
        {allCoins.map((coinType, i) => {
          const info = COIN_INFO[coinType];
          return (
            <div
              key={i}
              className="flex flex-col items-center animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Coin visual */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50"
                style={{ backgroundColor: info.color }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl">{info.emoji}</span>
              </div>
              {/* Value label */}
              {showValues && (
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-0.5 sm:mt-1">
                  {info.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Total display */}
      {calculatedTotal > 0 && (
        <div className="mt-2 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-green-100 rounded-full">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">
            {calculatedTotal >= 100 
              ? `$${(calculatedTotal / 100).toFixed(2)}` 
              : `${calculatedTotal}¢`
            }
          </span>
        </div>
      )}
    </div>
  );
}