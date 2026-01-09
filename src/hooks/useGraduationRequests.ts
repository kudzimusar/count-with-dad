import { useState, useCallback, useEffect } from 'react';
import { checkGraduationEligibility, getYearlyRequirements, type YearlyMasteryConfig } from '@/config/yearlyMastery';

export interface GraduationRequest {
  userId: string;
  currentAge: number;
  targetAge: number;
  requestedAt: string;
  progressSummary: {
    metRequirements: string[];
    overallProgress: number;
    modesMastered: Record<string, { level: number; accuracy: number }>;
  };
}

export interface GraduationStatus {
  isEligible: boolean;
  isRequested: boolean;
  isApproved: boolean;
  request?: GraduationRequest;
  requirements?: YearlyMasteryConfig;
  progress: {
    metRequirements: string[];
    unmetRequirements: string[];
    overallProgress: number;
  };
}

interface UseGraduationRequestsResult {
  status: GraduationStatus | null;
  loading: boolean;
  checkEligibility: (
    currentAge: number,
    modeProgress: Record<string, { level: number; accuracy: number }>
  ) => GraduationStatus;
  requestGraduation: (currentAge: number) => Promise<void>;
  approveGraduation: (request: GraduationRequest) => Promise<{ success: boolean; newAge: number }>;
  denyGraduation: (request: GraduationRequest) => Promise<void>;
}

export function useGraduationRequests(userId?: string): UseGraduationRequestsResult {
  const [status, setStatus] = useState<GraduationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = useCallback((
    currentAge: number,
    modeProgress: Record<string, { level: number; accuracy: number }>
  ): GraduationStatus => {
    const requirements = getYearlyRequirements(currentAge);
    const eligibility = checkGraduationEligibility(currentAge, modeProgress);

    const graduationStatus: GraduationStatus = {
      isEligible: eligibility.isEligible,
      isRequested: false,
      isApproved: false,
      requirements: requirements || undefined,
      progress: {
        metRequirements: eligibility.metRequirements,
        unmetRequirements: eligibility.unmetRequirements,
        overallProgress: eligibility.overallProgress
      }
    };

    setStatus(graduationStatus);
    return graduationStatus;
  }, []);

  const requestGraduation = useCallback(async (currentAge: number) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would save to Supabase
      // For now, we'll update local state
      setStatus(prev => prev ? {
        ...prev,
        isRequested: true,
        request: {
          userId,
          currentAge,
          targetAge: currentAge + 1,
          requestedAt: new Date().toISOString(),
          progressSummary: {
            metRequirements: prev.progress.metRequirements,
            overallProgress: prev.progress.overallProgress,
            modesMastered: {}
          }
        }
      } : null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const approveGraduation = useCallback(async (
    request: GraduationRequest
  ): Promise<{ success: boolean; newAge: number }> => {
    if (!userId) return { success: false, newAge: request.currentAge };
    
    setLoading(true);
    try {
      // In a real implementation, this would:
      // 1. Update profiles.child_age
      // 2. Create graduation_history record
      // 3. Create new yearly_progress entry
      
      const newAge = request.targetAge;
      
      setStatus(prev => prev ? {
        ...prev,
        isApproved: true,
        isRequested: false,
        request: undefined
      } : null);
      
      return { success: true, newAge };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const denyGraduation = useCallback(async (request: GraduationRequest) => {
    setLoading(true);
    try {
      setStatus(prev => prev ? {
        ...prev,
        isRequested: false,
        request: undefined
      } : null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    status,
    loading,
    checkEligibility,
    requestGraduation,
    approveGraduation,
    denyGraduation
  };
}
