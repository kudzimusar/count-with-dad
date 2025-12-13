import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Star, Sparkles } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onComplete: (data: {
    childName: string;
    childAge: number;
    childAvatar: string;
    childGender?: string;
    parentEmail?: string;
    parentRelationship?: string;
  }) => void;
  onClose?: () => void;
  allowClose?: boolean; // Allow closing modal (for guest users)
}

const avatars = ['🦁', '🐻', '🐰', '🐼', '🦊', '🐯', '🐸', '🐨'];

export function RegistrationModal({ isOpen, onComplete, onClose, allowClose = false }: RegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childAvatar, setChildAvatar] = useState('🦁');
  const [childGender, setChildGender] = useState<string>();
  const [parentEmail, setParentEmail] = useState('');
  const [parentRelationship, setParentRelationship] = useState('');

  const handleNext = () => {
    if (step === 1 && childName && childAge) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    onComplete({
      childName,
      childAge: parseInt(childAge),
      childAvatar,
      childGender: childGender || undefined,
      parentEmail: parentEmail || undefined,
      parentRelationship: parentRelationship || undefined,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && allowClose && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={allowClose ? handleOpenChange : undefined}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={allowClose ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={allowClose ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Welcome to Count to 100!
          </DialogTitle>
          <DialogDescription>
            Let's create a profile to personalize your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 w-16 rounded-full transition-colors ${
                  step >= num ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-bold flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  What's your name?
                </Label>
                <Input
                  id="name"
                  placeholder="Enter nickname"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="text-lg"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-lg font-bold">
                  How old are you?
                </Label>
                <Select value={childAge} onValueChange={setChildAge}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7, 8].map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age} years old
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleNext}
                disabled={!childName || !childAge}
                className="w-full text-lg py-6"
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 2: Personalization */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-bold">Choose your avatar</Label>
                <div className="grid grid-cols-4 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setChildAvatar(avatar)}
                      className={`text-4xl p-4 rounded-xl border-4 transition-all ${
                        childAvatar === avatar
                          ? 'border-purple-500 bg-purple-50 scale-110'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-bold">Gender (optional)</Label>
                <Select value={childGender} onValueChange={setChildGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">Boy</SelectItem>
                    <SelectItem value="girl">Girl</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Parent Info (Optional) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Optional:</strong> Parent/guardian info helps us send progress updates and
                  improve the app. You can skip this step.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Child</Label>
                <Select value={parentRelationship} onValueChange={setParentRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  Start Learning! 🎉
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
