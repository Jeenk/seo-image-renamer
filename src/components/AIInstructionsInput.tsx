import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AIInstructionsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AIInstructionsInput({ value, onChange }: AIInstructionsInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="aiInstructions">AI Instructions (Optional)</Label>
      <Textarea
        id="aiInstructions"
        placeholder="Enter instructions for AI processing of your images"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24"
      />
      <p className="text-sm text-muted-foreground">
        Provide any specific instructions for processing your images
      </p>
    </div>
  );
} 