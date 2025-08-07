import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search, Plus, ExternalLink, Edit, Trash2, Folder } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: any[];
  categories: any[];
  onAddLink: () => void;
  onAddCategory: () => void;
  onEditLink: (id: string) => void;
  onDeleteLink: (id: string) => void;
  onOpenLink: (url: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  links,
  categories,
  onAddLink,
  onAddCategory,
  onEditLink,
  onDeleteLink,
  onOpenLink,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenLink = (url: string) => {
    onOpenLink(url);
    onOpenChange(false);
  };

  const handleAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search links or type a command..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleAction(onAddLink)}>
            <Plus className="mr-2 h-4 w-4" />
            Add new link
          </CommandItem>
          <CommandItem onSelect={() => handleAction(onAddCategory)}>
            <Folder className="mr-2 h-4 w-4" />
            Add new category
          </CommandItem>
        </CommandGroup>

        {filteredLinks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Links">
              {filteredLinks.slice(0, 8).map((link) => (
                <CommandItem
                  key={link.id}
                  onSelect={() => handleOpenLink(link.url)}
                  className="group"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {link.favicon_url && (
                      <img 
                        src={link.favicon_url} 
                        alt="" 
                        className="w-4 h-4 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate">{link.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </span>
                    </div>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(() => onEditLink(link.id));
                      }}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(() => onDeleteLink(link.id));
                      }}
                      className="p-1 hover:bg-accent rounded text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => onOpenChange(false)}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2 shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}