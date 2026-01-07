import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { ppaService } from '@/services/ppaService';
import { useAuth } from '@/contexts/AuthContext';

export default function JoinPPA() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if user already has PPA
    if (user?.ppaId) {
      navigate('/dashboard');
    }
    // Redirect non-corps members
    if (user && user.role !== 'corps_member') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Validate code format and check with backend
  useEffect(() => {
    const codePattern = /^PPA-[A-Z0-9]{6}$/;
    const formattedCode = joinCode.toUpperCase();

    if (codePattern.test(formattedCode)) {
      validateJoinCode(formattedCode);
    } else {
      setIsValid(false);
      setIsValidating(false);
    }
  }, [joinCode]);

  const validateJoinCode = async (code: string) => {
    setIsValidating(true);
    try {
      const response = await ppaService.validateJoinCode(code);
      setIsValid(response.isValid);
    } catch (error) {
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid join code.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.joinPPA({ joinCode: joinCode.toUpperCase() });
      await refreshUser();
      setIsJoined(true);
      toast({
        title: 'Successfully Joined!',
        description: 'You have been registered to the PPA.',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to join PPA. Please check the join code.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and limit to 10 characters (PPA-XXXXXX)
    const value = e.target.value.toUpperCase().slice(0, 10);
    setJoinCode(value);
  };

  if (isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Aboard!</h2>
            <p className="text-muted-foreground mb-6">
              You have successfully joined the PPA. You can now start logging your daily activities.
            </p>

            <Button asChild className="w-full">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Join a PPA</h2>
            <p className="text-muted-foreground">
              Enter the join code provided by your supervisor to register
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="joinCode">Join Code</Label>
              <div className="relative">
                <Input
                  id="joinCode"
                  placeholder="PPA-XXXXXX"
                  value={joinCode}
                  onChange={handleInputChange}
                  className="text-center text-lg font-mono tracking-widest uppercase pr-10"
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!isValidating && isValid && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Format: PPA-XXXXXX (e.g., PPA-9F3A21)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join PPA'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
