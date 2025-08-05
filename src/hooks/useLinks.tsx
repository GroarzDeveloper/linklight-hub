import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon_url?: string;
  created_at: string;
  updated_at: string;
}

export function useLinks(userId?: string) {
  const [links, setLinks] = useState<UserLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    if (!userId) {
      setLinks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching links",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [userId]);

  const addLink = async (linkData: {
    title: string;
    url: string;
    description: string;
  }) => {
    if (!userId) return;

    try {
      // Try to fetch favicon
      let faviconUrl = null;
      try {
        const domain = new URL(linkData.url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      } catch {
        // Invalid URL, use default
      }

      const { data, error } = await supabase
        .from('user_links')
        .insert({
          user_id: userId,
          title: linkData.title,
          url: linkData.url,
          description: linkData.description || null,
          favicon_url: faviconUrl
        })
        .select()
        .single();

      if (error) throw error;
      
      setLinks(prev => [data, ...prev]);
      toast({
        title: "Link added",
        description: "Your link has been saved successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error adding link",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateLink = async (
    id: string,
    linkData: {
      title: string;
      url: string;
      description: string;
    }
  ) => {
    if (!userId) return;

    try {
      // Try to fetch favicon
      let faviconUrl = null;
      try {
        const domain = new URL(linkData.url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      } catch {
        // Invalid URL, use default
      }

      const { data, error } = await supabase
        .from('user_links')
        .update({
          title: linkData.title,
          url: linkData.url,
          description: linkData.description || null,
          favicon_url: faviconUrl
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      setLinks(prev => prev.map(link => 
        link.id === id ? data : link
      ));
      
      toast({
        title: "Link updated",
        description: "Your link has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error updating link",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteLink = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_links')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Link deleted",
        description: "Your link has been removed."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting link",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    refetch: fetchLinks
  };
}