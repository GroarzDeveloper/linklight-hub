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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (linkData: {
    title: string;
    url: string;
    description: string;
    category_id?: string;
  }) => Promise<void>;
  editingLink?: {
    id: string;
    title: string;
    url: string;
    description?: string;
    category_id?: string;
  } | null;
  categories: Array<{ id: string; name: string; color: string }>;
}

export function AddLinkDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingLink,
  categories
}: AddLinkDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  console.log('AddLinkDialog render - open:', open, 'editingLink:', editingLink);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setDescription(editingLink.description || '');
      setCategoryId(editingLink.category_id || '');
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setCategoryId('');
    }
  }, [editingLink, open]);

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return;
    
    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        category_id: categoryId || undefined
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
          
          <div>
            <Label htmlFor="category">Category (optional)</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val === 'nocat' ? '' : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nocat">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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