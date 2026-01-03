import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Building2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ppaService, CreatePPARequest } from '@/services/ppaService';

export default function CreatePPA() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePPARequest>({
    name: '',
    address: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ppa = await ppaService.createPPA(formData);
      setJoinCode(ppa.joinCode);
      setIsSubmitted(true);
      toast({
        title: 'PPA Created Successfully',
        description: 'Share the join code with your corps members.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create PPA. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinCode);
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Join code copied to clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setJoinCode('');
    setFormData({ name: '', address: '', description: '' });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="form-card text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">PPA Created Successfully!</h2>
          <p className="text-muted-foreground mb-8">
            Share this join code with your corps members so they can register.
          </p>

          <div className="bg-muted rounded-xl p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Join Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold text-foreground tracking-wider">
                {joinCode}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {isCopied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Corps members can use this code on the "Join PPA" page to register under your supervision.
          </p>

          <Button variant="outline" onClick={handleReset} className="w-full">
            Create Another PPA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="form-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Create New PPA</h2>
            <p className="text-sm text-muted-foreground">Register a Place of Primary Assignment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">PPA Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Federal Ministry of Education"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter the full address of the PPA"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional information about this PPA"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create PPA'}
          </Button>
        </form>
      </div>
    </div>
  );
}
