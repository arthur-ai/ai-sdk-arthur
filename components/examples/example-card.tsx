import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { LucideIcon } from 'lucide-react';

interface ExampleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  code: string;
  language?: string;
  tags?: string[];
  onAction?: () => void;
  actionLabel?: string;
  children?: React.ReactNode;
}

export function ExampleCard({
  title,
  description,
  icon: Icon,
  code,
  language = 'typescript',
  tags = [],
  onAction,
  actionLabel,
  children
}: ExampleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <CodeExample code={code} language={language} />
        {onAction && actionLabel && (
          <Button onClick={onAction} className="w-full">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 