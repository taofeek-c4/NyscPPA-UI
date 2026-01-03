import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const { register, registerSupervisor } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<'corps_member' | 'supervisor'>('corps_member');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stateCode: '',
    callUpNumber: '',
    joinCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'corps_member') {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.stateCode,
          formData.callUpNumber,
          formData.joinCode
        );
        toast({
          title: 'Registration Successful!',
          description: 'Your account has been created.',
        });
        navigate('/');
      } else {
        await registerSupervisor(
          formData.name,
          formData.email,
          formData.password
        );
        toast({
          title: 'Registration Successful!',
          description: 'Your supervisor account has been created.',
        });
        navigate('/');
      }
    } catch (error: unknown) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Registration</h1>
            <p className="text-muted-foreground">Create your account to start</p>
          </div>

          <div className="flex p-1 bg-muted rounded-lg mb-8">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'corps_member'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setRole('corps_member')}
            >
              Corps Member
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'supervisor'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setRole('supervisor')}
            >
              Supervisor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            {role === 'corps_member' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="joinCode">PPA Join Code *</Label>
                  <Input
                    id="joinCode"
                    type="text"
                    placeholder="Enter PPA Join Code (e.g., PPA-123456)"
                    value={formData.joinCode}
                    onChange={(e) => setFormData({ ...formData, joinCode: e.target.value.toUpperCase() })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateCode">State Code *</Label>
                  <Input
                    id="stateCode"
                    type="text"
                    placeholder="e.g., AB/21A/1234"
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="callUpNumber">Call-Up Number *</Label>
                  <Input
                    id="callUpNumber"
                    type="text"
                    placeholder="Enter your call-up number"
                    value={formData.callUpNumber}
                    onChange={(e) => setFormData({ ...formData, callUpNumber: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

