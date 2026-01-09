import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  requestGraduation: (currentAge: number, modeProgress: Record<string, { level: number; accuracy: number }>) => Promise<void>;
  approveGraduation: (request: GraduationRequest) => Promise<{ success: boolean; newAge: number }>;
  denyGraduation: (request: GraduationRequest) => Promise<void>;
  loadPendingRequest: () => Promise<GraduationRequest | null>;
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

  // Load any pending graduation request from the database
  const loadPendingRequest = useCallback(async (): Promise<GraduationRequest | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('yearly_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('graduation_status', 'pending_approval')
        .maybeSingle();

      if (error || !data) return null;

      const request: GraduationRequest = {
        userId,
        currentAge: data.age_year,
        targetAge: data.age_year + 1,
        requestedAt: data.started_at,
        progressSummary: {
          metRequirements: [],
          overallProgress: Number(data.overall_mastery_percentage) || 0,
          modesMastered: data.modes_mastered as Record<string, { level: number; accuracy: number }> || {}
        }
      };

      setStatus(prev => prev ? { ...prev, isRequested: true, request } : {
        isEligible: true,
        isRequested: true,
        isApproved: false,
        request,
        progress: { metRequirements: [], unmetRequirements: [], overallProgress: request.progressSummary.overallProgress }
      });

      return request;
    } catch (e) {
      console.error('Failed to load pending graduation request:', e);
      return null;
    }
  }, [userId]);

  const requestGraduation = useCallback(async (
    currentAge: number,
    modeProgress: Record<string, { level: number; accuracy: number }>
  ) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const eligibility = checkGraduationEligibility(currentAge, modeProgress);
      
      // Upsert yearly_progress with pending_approval status
      const { error } = await supabase
        .from('yearly_progress')
        .upsert({
          user_id: userId,
          age_year: currentAge,
          modes_mastered: modeProgress,
          overall_mastery_percentage: eligibility.overallProgress,
          graduation_status: 'pending_approval',
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,age_year'
        });

      if (error) {
        console.error('Failed to request graduation:', error);
        return;
      }

      setStatus(prev => prev ? {
        ...prev,
        isRequested: true,
        request: {
          userId,
          currentAge,
          targetAge: currentAge + 1,
          requestedAt: new Date().toISOString(),
          progressSummary: {
            metRequirements: eligibility.metRequirements,
            overallProgress: eligibility.overallProgress,
            modesMastered: modeProgress
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
      const newAge = request.targetAge;
      
      // 1. Update profiles.child_age
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ child_age: newAge })
        .eq('user_id', userId);

      if (profileError) {
        console.error('Failed to update child age:', profileError);
        return { success: false, newAge: request.currentAge };
      }

      // 2. Mark current yearly_progress as graduated
      await supabase
        .from('yearly_progress')
        .update({ graduation_status: 'graduated' })
        .eq('user_id', userId)
        .eq('age_year', request.currentAge);

      // 3. Create graduation_history record
      const { error: historyError } = await supabase
        .from('graduation_history')
        .insert({
          user_id: userId,
          from_age: request.currentAge,
          to_age: newAge,
          graduated_at: new Date().toISOString(),
          approved_by: 'parent',
          summary_data: request.progressSummary
        });

      if (historyError) {
        console.error('Failed to record graduation history:', historyError);
        // Don't fail the whole operation for this
      }

      // 4. Create new yearly_progress entry for the new age
      await supabase
        .from('yearly_progress')
        .upsert({
          user_id: userId,
          age_year: newAge,
          modes_mastered: {},
          overall_mastery_percentage: 0,
          graduation_status: 'in_progress',
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,age_year'
        });
      
      setStatus(prev => prev ? {
        ...prev,
        isApproved: true,
        isRequested: false,
        request: undefined
      } : null);
      
      return { success: true, newAge };
    } catch (e) {
      console.error('Graduation approval failed:', e);
      return { success: false, newAge: request.currentAge };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const denyGraduation = useCallback(async (request: GraduationRequest) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Reset graduation_status back to in_progress
      await supabase
        .from('yearly_progress')
        .update({ graduation_status: 'in_progress' })
        .eq('user_id', userId)
        .eq('age_year', request.currentAge);

      setStatus(prev => prev ? {
        ...prev,
        isRequested: false,
        request: undefined
      } : null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Auto-load pending request when userId changes
  useEffect(() => {
    if (userId) {
      loadPendingRequest();
    }
  }, [userId, loadPendingRequest]);

  return {
    status,
    loading,
    checkEligibility,
    requestGraduation,
    approveGraduation,
    denyGraduation,
    loadPendingRequest
  };
}
