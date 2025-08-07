import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';

interface LinkCardProps {
  id: string;
  title: string;
  url: string;
  description?: string;
  faviconUrl?: string;
  category?: { name: string; color: string } | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LinkCard({ 
  id, 
  title, 
  url, 
  description, 
  faviconUrl,
  category,
  onEdit, 
  onDelete 
}: LinkCardProps) {
  const handleVisit = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getFaviconUrl = (url: string) => {
    if (faviconUrl) return faviconUrl;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '/placeholder.svg';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={getFaviconUrl(url)}
            alt={`${title} favicon`}
            className="w-8 h-8 rounded-sm flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground truncate">{title}</h3>
              {category && (
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-muted-foreground">{category.name}</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {url}
            </p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVisit}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}