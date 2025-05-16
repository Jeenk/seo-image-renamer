import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function KeywordInput({ value, onChange }: KeywordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="keywords">SEO Keywords</Label>
      <Input
        id="keywords"
        placeholder="Enter keywords for SEO-friendly filenames"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        Enter keywords separated by spaces (e.g., "coffee shop seattle")
      </p>
    </div>
  );
} 