import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (linkData: {
    title: string;
    url: string;
    description: string;
  }) => Promise<void>;
  editingLink?: {
    id: string;
    title: string;
    url: string;
    description?: string;
  } | null;
}

export function AddLinkDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingLink 
}: AddLinkDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setDescription(editingLink.description || '');
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
    }
  }, [editingLink, open]);

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return;
    
    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        url: url.trim(),
        description: description.trim()
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const formatUrl = (inputUrl: string) => {
    let formattedUrl = inputUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    return formattedUrl;
  };

  const handleUrlChange = (value: string) => {
    setUrl(formatUrl(value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </DialogTitle>
          <DialogDescription>
            {editingLink 
              ? 'Update your link details below.' 
              : 'Add a new website to your collection.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Website title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the website"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !url.trim() || loading}
            >
              {loading ? 'Saving...' : (editingLink ? 'Update' : 'Save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}