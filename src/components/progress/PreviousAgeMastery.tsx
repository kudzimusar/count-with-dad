import { Award, Trophy, Star } from 'lucide-react';
import { getCertificateForAge } from '@/config/yearlyMastery';

export interface GraduationRecord {
  fromAge: number;
  toAge: number;
  graduatedAt: string;
  summaryData?: {
    totalStars: number;
    modesCompleted: number;
  };
}

interface PreviousAgeMasteryProps {
  currentAge: number;
  graduationHistory: GraduationRecord[];
  compact?: boolean;
}

export function PreviousAgeMastery({
  currentAge,
  graduationHistory,
  compact = false
}: PreviousAgeMasteryProps) {
  if (graduationHistory.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {graduationHistory.map((grad) => {
          const certificate = getCertificateForAge(grad.fromAge);
          return (
            <div
              key={grad.fromAge}
              className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
              title={`Graduated from Age ${grad.fromAge} on ${new Date(grad.graduatedAt).toLocaleDateString()}`}
            >
              <Award className="h-4 w-4" />
              <span>Age {grad.fromAge} Master</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Previous Achievements
      </h4>
      
      <div className="grid gap-3">
        {graduationHistory.map((grad) => {
          const certificate = getCertificateForAge(grad.fromAge);
          return (
            <div
              key={grad.fromAge}
              className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Age {grad.fromAge} Master
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {certificate?.title || `Completed Age ${grad.fromAge}`}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                {grad.summaryData && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-4 w-4" fill="currentColor" />
                    <span className="font-bold">{grad.summaryData.totalStars}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(grad.graduatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
