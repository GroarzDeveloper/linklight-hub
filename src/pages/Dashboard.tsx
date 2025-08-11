import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, LogOut, Filter, Folder, Command } from 'lucide-react';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { AddLinkDialog } from '@/components/dashboard/AddLinkDialog';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { CategoryDialog } from '@/components/dashboard/CategoryDialog';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { useLinks } from '@/hooks/useLinks';
import { useCategories } from '@/hooks/useCategories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { links, loading, addLink, updateLink, deleteLink } = useLinks(user?.id);
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  console.log('Dashboard render - showAddDialog:', showAddDialog);

  // Get links with their category info
  const linksWithCategories = links.map(link => ({
    ...link,
    category: link.category_id ? categories.find(cat => cat.id === link.category_id) : null
  }));

  const filteredLinks = linksWithCategories.filter(link => {
    const matchesSearch = 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategoryId === '' || link.category_id === selectedCategoryId;
    
    return matchesSearch && matchesCategory;
  });

  const handleSaveLink = async (linkData: {
    title: string;
    url: string;
    description: string;
    category_id?: string;
  }) => {
    if (editingLink) {
      await updateLink(editingLink.id, linkData);
      setEditingLink(null);
    } else {
      await addLink(linkData);
    }
  };

  const handleEditLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setEditingLink(link);
      setShowAddDialog(true);
    }
  };

  const handleDeleteLink = (id: string) => {
    setDeletingLinkId(id);
  };

  const confirmDelete = async () => {
    if (deletingLinkId) {
      await deleteLink(deletingLinkId);
      setDeletingLinkId(null);
    }
  };

  const handleSaveCategory = async (categoryData: {
    name: string;
    color: string;
  }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    } else {
      await addCategory(categoryData);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      setEditingLink(null);
    }
  };

  const handleCategoryDialogClose = (open: boolean) => {
    setShowCategoryDialog(open);
    if (!open) {
      setEditingCategory(null);
    }
  };

  const isSafeHttpUrl = (input: string) => {
    try {
      const u = new URL(input);
      return u.protocol === 'https:' || u.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const handleOpenLink = (url: string) => {
    if (!isSafeHttpUrl(url)) return;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">LinkHub</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommandPalette(true)}
                className="hidden sm:flex"
              >
                <Command className="h-4 w-4 mr-2" />
                Search
                <Badge variant="secondary" className="ml-2 text-xs">
                  ⌘K
                </Badge>
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  {selectedCategoryId && (
                    <Badge variant="secondary" className="ml-1">
                      {categories.find(cat => cat.id === selectedCategoryId)?.name}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by category</h4>
                  <div className="space-y-1">
                    <Button
                      variant={selectedCategoryId === '' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategoryId('')}
                    >
                      All links
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategoryId === category.id ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategoryId(category.id)}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => setShowCategoryDialog(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Folder className="h-4 w-4" />
              Categories
            </Button>
            <Button
              onClick={() => {
                console.log('Add Link button clicked, setting showAddDialog to true');
                setShowAddDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your links...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No links found matching your search.' : 'No links saved yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddDialog(true)}>
                Add your first link
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                id={link.id}
                title={link.title}
                url={link.url}
                description={link.description}
                faviconUrl={link.favicon_url}
                category={link.category}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>

      <AddLinkDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          console.log('AddLinkDialog onOpenChange called with:', open);
          handleDialogClose(open);
        }}
        onSave={handleSaveLink}
        editingLink={editingLink}
        categories={categories}
      />

      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={handleCategoryDialogClose}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        links={linksWithCategories}
        categories={categories}
        onAddLink={() => setShowAddDialog(true)}
        onAddCategory={() => setShowCategoryDialog(true)}
        onEditLink={handleEditLink}
        onDeleteLink={handleDeleteLink}
        onOpenLink={handleOpenLink}
      />

      <AlertDialog open={!!deletingLinkId} onOpenChange={() => setDeletingLinkId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}