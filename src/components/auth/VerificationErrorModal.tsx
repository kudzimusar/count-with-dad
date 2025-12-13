import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VerificationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  errorCode?: string;
}

export function VerificationErrorModal({ isOpen, onClose, email, errorCode }: VerificationErrorModalProps) {
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email address is required to resend verification');
      return;
    }

    setResending(true);
    try {
      const productionUrl = 'https://kudzimusar.github.io/count-with-dad/app';
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: productionUrl
        }
      });

      if (error) {
        toast.error(`Failed to resend email: ${error.message}`);
      } else {
        toast.success('Verification email sent! Please check your inbox.');
        onClose();
      }
    } catch (error) {
      console.error('Resend email error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'otp_expired':
        return 'This verification link has expired. Verification links are valid for a limited time for security reasons.';
      case 'invalid_token':
        return 'This verification link is invalid or has already been used.';
      default:
        return 'This verification link is invalid or has expired.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-6 w-6" />
            Verification Link Expired
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {getErrorMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>What happened?</strong>
            </p>
            <p className="text-sm text-orange-700 mt-2">
              Email verification links expire after a certain time for security. If you didn't click the link right away, it may have expired.
            </p>
          </div>

          {email ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>We'll send a new verification email to: <strong>{email}</strong></span>
              </div>
              
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full"
                size="lg"
              >
                {resending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                To receive a new verification email, please sign up again with your email address.
              </p>
              <Button
                onClick={onClose}
                className="w-full"
                size="lg"
                variant="outline"
              >
                Go to Sign Up
              </Button>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 text-center">
              Need help? Contact support if you continue to have issues.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

