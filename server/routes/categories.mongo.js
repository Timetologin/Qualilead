import express from 'express';
import { Category, Lead, User } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { include_inactive } = req.query;
    
    let query = {};
    if (!include_inactive || req.user.role !== 'admin') {
      query.is_active = true;
    }

    const categories = await Category.find(query).sort({ name_en: 1 });

    // Add stats for admin
    if (req.user.role === 'admin') {
      const categoriesWithStats = await Promise.all(categories.map(async (cat) => {
        const leadCount = await Lead.countDocuments({ category_id: cat._id });
        const userCount = await User.countDocuments({ categories: cat._id });
        return {
          ...cat.toObject(),
          lead_count: leadCount,
          user_count: userCount
        };
      }));
      return res.json(categoriesWithStats);
    }

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get single category
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get stats
    const leadCount = await Lead.countDocuments({ category_id: category._id });
    const userCount = await User.countDocuments({ categories: category._id });

    res.json({
      ...category.toObject(),
      lead_count: leadCount,
      user_count: userCount
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

    const category = await Category.create({
      name_en,
      name_he,
      description_en: description_en || '',
      description_he: description_he || '',
      icon: icon || 'Briefcase',
      is_active: true
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete/Deactivate category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if category has leads
    const leadCount = await Lead.countDocuments({ category_id: req.params.id });
    
    if (leadCount > 0) {
      // Soft delete - just deactivate
      await Category.findByIdAndUpdate(req.params.id, { is_active: false });
      return res.json({ message: 'Category deactivated (has associated leads)' });
    }

    // Hard delete if no leads
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
