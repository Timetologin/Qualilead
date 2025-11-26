import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { dbHelpers } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = dbHelpers.getCategories(true);
    
    // Add lead counts
    const categoriesWithCounts = categories.map(cat => {
      const leads = dbHelpers.getLeads({ category_id: cat.id });
      const userCats = db.data.user_categories.filter(uc => uc.category_id === cat.id);
      
      return {
        ...cat,
        total_leads: leads.length,
        new_leads: leads.filter(l => l.status === 'new').length,
        assigned_users: userCats.length
      };
    });

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get all categories including inactive (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = dbHelpers.getCategories(false);
    
    const categoriesWithCounts = categories.map(cat => {
      const leads = dbHelpers.getLeads({ category_id: cat.id });
      const userCats = db.data.user_categories.filter(uc => uc.category_id === cat.id);
      
      return {
        ...cat,
        total_leads: leads.length,
        assigned_users: userCats.length
      };
    });

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get single category
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const category = dbHelpers.findCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get users assigned to this category
    const userCatIds = db.data.user_categories
      .filter(uc => uc.category_id === req.params.id)
      .map(uc => uc.user_id);
    
    const assignedUsers = db.data.users
      .filter(u => userCatIds.includes(u.id))
      .map(u => ({ id: u.id, name: u.name, email: u.email, company_name: u.company_name }));

    const leads = dbHelpers.getLeads({ category_id: req.params.id });

    res.json({
      ...category,
      assigned_users: assignedUsers,
      total_leads: leads.length,
      new_leads: leads.filter(l => l.status === 'new').length
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name_en, name_he, description_en, description_he, icon } = req.body;

    if (!name_en || !name_he) {
      return res.status(400).json({ error: 'English and Hebrew names are required' });
    }

    const category = await dbHelpers.createCategory({
      name_en,
      name_he,
      description_en: description_en || '',
      description_he: description_he || '',
      icon: icon || 'Tag'
    });

    res.status(201).json({ 
      message: 'Category created successfully',
      categoryId: category.id 
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = dbHelpers.findCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { name_en, name_he, description_en, description_he, icon, is_active } = req.body;

    const updates = {};
    if (name_en !== undefined) updates.name_en = name_en;
    if (name_he !== undefined) updates.name_he = name_he;
    if (description_en !== undefined) updates.description_en = description_en;
    if (description_he !== undefined) updates.description_he = description_he;
    if (icon !== undefined) updates.icon = icon;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length > 0) {
      await dbHelpers.updateCategory(req.params.id, updates);
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = dbHelpers.findCategoryById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has leads
    const leads = dbHelpers.getLeads({ category_id: req.params.id });
    
    if (leads.length > 0) {
      // Soft delete - just deactivate
      await dbHelpers.updateCategory(req.params.id, { is_active: false });
      res.json({ message: 'Category deactivated (has existing leads)' });
    } else {
      // Hard delete
      db.data.categories = db.data.categories.filter(c => c.id !== req.params.id);
      db.data.user_categories = db.data.user_categories.filter(uc => uc.category_id !== req.params.id);
      await db.write();
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get leads in category
router.get('/:id/leads', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let leads = dbHelpers.getLeads({ category_id: req.params.id });

    // Non-admins can only see their own leads
    if (req.user.role !== 'admin') {
      leads = leads.filter(l => l.assigned_to === req.user.id);
    }

    if (status) leads = leads.filter(l => l.status === status);

    const total = leads.length;
    const offset = (page - 1) * limit;
    leads = leads.slice(offset, offset + parseInt(limit));

    res.json({
      leads,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get category leads error:', error);
    res.status(500).json({ error: 'Failed to get category leads' });
  }
});

export default router;
