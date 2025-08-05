import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, LogOut } from 'lucide-react';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { AddLinkDialog } from '@/components/dashboard/AddLinkDialog';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { useLinks } from '@/hooks/useLinks';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveLink = async (linkData: {
    title: string;
    url: string;
    description: string;
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

  const handleDialogClose = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      setEditingLink(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">LinkHub</h1>
            <div className="flex items-center gap-2">
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
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
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
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>

      <AddLinkDialog
        open={showAddDialog}
        onOpenChange={handleDialogClose}
        onSave={handleSaveLink}
        editingLink={editingLink}
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