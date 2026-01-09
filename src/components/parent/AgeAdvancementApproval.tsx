import { Trophy, Star, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCertificateForAge, getYearlyRequirements } from '@/config/yearlyMastery';
import type { GraduationRequest } from '@/hooks/useGraduationRequests';

interface AgeAdvancementApprovalProps {
  childName: string;
  request: GraduationRequest;
  onApprove: () => void;
  onDefer: () => void;
  loading?: boolean;
}

export function AgeAdvancementApproval({
  childName,
  request,
  onApprove,
  onDefer,
  loading = false
}: AgeAdvancementApprovalProps) {
  const requirements = getYearlyRequirements(request.currentAge);
  const certificate = getCertificateForAge(request.currentAge);

  return (
    <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-yellow-100">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <CardTitle className="text-xl text-green-700">
              {childName} is Ready to Graduate!
            </CardTitle>
            <CardDescription>
              Completed all Age {request.currentAge} requirements
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Overall Progress</h4>
            <span className="text-lg font-bold text-green-600">
              {Math.round(request.progressSummary.overallProgress)}%
            </span>
          </div>
          <Progress value={request.progressSummary.overallProgress} className="h-3" />
        </div>

        {/* Achievements at This Age */}
        <div className="bg-white p-4 rounded-xl">
          <h4 className="font-semibold mb-3 text-foreground">
            Achievements at Age {request.currentAge}:
          </h4>
          <div className="space-y-2">
            {request.progressSummary.metRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Preview */}
        {certificate && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border border-yellow-300">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">
                Certificate Earned
              </h4>
            </div>
            <p className="text-sm text-yellow-700">
              {certificate.title}: {certificate.description}
            </p>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">
            What's Next at Age {request.targetAge}:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• More challenging problems</li>
            <li>• New learning milestones</li>
            <li>• Advanced skills unlock</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onDefer}
            disabled={loading}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Not Yet
          </Button>
          <Button
            onClick={onApprove}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Approve Graduation 🎓
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You can always adjust your child's age in settings if needed.
        </p>
      </CardContent>
    </Card>
  );
}
