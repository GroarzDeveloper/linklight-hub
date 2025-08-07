import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export function useCategories(userId?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    if (!userId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  const addCategory = async (categoryData: {
    name: string;
    color: string;
  }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          name: categoryData.name,
          color: categoryData.color
        })
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Category added",
        description: "Your category has been created successfully."
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: {
      name: string;
      color: string;
    }
  ) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          color: categoryData.color
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(cat => 
        cat.id === id ? data : cat
      ).sort((a, b) => a.name.localeCompare(b.name)));
      
      toast({
        title: "Category updated",
        description: "Your category has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Category deleted",
        description: "Your category has been removed."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
}