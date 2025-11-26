import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Database file path
const file = join(__dirname, 'db.json');

// Default data structure
const defaultData = {
  users: [],
  categories: [],
  leads: [],
  lead_history: [],
  notifications: [],
  user_categories: [],
  monthly_usage: [],
  delivery_log: [],
  settings: {}
};

// Create database instance
const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

// Initialize database
export async function initializeDatabase() {
  await db.read();
  
  // Initialize with defaults if empty
  db.data ||= defaultData;
  
  // Ensure all arrays exist
  db.data.users ||= [];
  db.data.categories ||= [];
  db.data.leads ||= [];
  db.data.lead_history ||= [];
  db.data.notifications ||= [];
  db.data.user_categories ||= [];
  db.data.monthly_usage ||= [];
  db.data.delivery_log ||= [];
  db.data.settings ||= {};

  // Add default categories if none exist
  if (db.data.categories.length === 0) {
    const defaultCategories = [
      { id: uuidv4(), name_en: 'Beauticians & Aesthetics', name_he: 'קוסמטיקאיות ואסתטיקה', description_en: 'Beauty services, skincare, cosmetics', description_he: 'שירותי יופי, טיפוח עור, קוסמטיקה', icon: 'Sparkles', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Hair Salons & Barbers', name_he: 'מספרות וספרים', description_en: 'Haircuts, styling, grooming', description_he: 'תספורות, עיצוב שיער, טיפוח', icon: 'Scissors', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'AC Technicians', name_he: 'טכנאי מזגנים', description_en: 'Installation, repair, maintenance', description_he: 'התקנה, תיקון, תחזוקה', icon: 'Wind', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Renovation Contractors', name_he: 'קבלני שיפוצים', description_en: 'Home improvement, remodeling', description_he: 'שיפור בתים, שיפוץ', icon: 'Hammer', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Electricians', name_he: 'חשמלאים', description_en: 'Electrical services, repairs', description_he: 'שירותי חשמל, תיקונים', icon: 'Plug', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Plumbers', name_he: 'אינסטלטורים', description_en: 'Plumbing services, repairs', description_he: 'שירותי אינסטלציה, תיקונים', icon: 'Droplet', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Small Businesses', name_he: 'עסקים קטנים', description_en: 'Various local services', description_he: 'שירותים מקומיים מגוונים', icon: 'Store', is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), name_en: 'Local Services', name_he: 'שירותים מקומיים', description_en: 'Community-based businesses', description_he: 'עסקים קהילתיים', icon: 'Building', is_active: true, created_at: new Date().toISOString() },
    ];
    db.data.categories.push(...defaultCategories);
  }

  // Create default admin if none exists
  const adminExists = db.data.users.find(u => u.role === 'admin');
  if (!adminExists) {
    const adminId = uuidv4();
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.data.users.push({
      id: adminId,
      email: 'admin@qualilead.com',
      password: hashedPassword,
      name: 'System Admin',
      phone: '',
      company_name: 'QualiLead',
      role: 'admin',
      package_type: 'enterprise',
      monthly_lead_limit: -1,
      leads_received_this_month: 0,
      categories_allowed: -1,
      dedicated_manager_id: null,
      is_vip: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null
    });
    console.log('✅ Default admin created: admin@qualilead.com / admin123');
  }

  // Create demo client if none exists
  const clientExists = db.data.users.find(u => u.role === 'client');
  if (!clientExists) {
    const clientId = uuidv4();
    const hashedPassword = bcrypt.hashSync('demo123', 10);
    
    // Get admin ID for dedicated manager
    const adminId = db.data.users.find(u => u.role === 'admin')?.id;
    
    // Get first 3 categories for demo client
    const clientCategories = db.data.categories.slice(0, 3);
    
    db.data.users.push({
      id: clientId,
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo Client',
      phone: '050-123-4567',
      company_name: 'Demo Beauty Salon',
      role: 'client',
      package_type: 'professional',
      monthly_lead_limit: 50,
      leads_received_this_month: 0,
      categories_allowed: 3,
      dedicated_manager_id: adminId,
      is_vip: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null
    });

    // Assign categories to demo client
    clientCategories.forEach(cat => {
      db.data.user_categories.push({
        id: uuidv4(),
        user_id: clientId,
        category_id: cat.id,
        created_at: new Date().toISOString()
      });
    });

    // Add welcome notification
    db.data.notifications.push({
      id: uuidv4(),
      user_id: clientId,
      title: 'Welcome to QualiLead!',
      message: 'Your account has been created. You can now start receiving leads.',
      type: 'info',
      is_read: false,
      created_at: new Date().toISOString()
    });

    console.log('✅ Demo client created: demo@example.com / demo123');
  }

  // Add sample leads if none exist
  if (db.data.leads.length === 0) {
    const categories = db.data.categories;
    const adminId = db.data.users.find(u => u.role === 'admin')?.id;
    const clientId = db.data.users.find(u => u.role === 'client')?.id;
    
    const sampleLeads = [
      { customer_name: 'שרה כהן', customer_phone: '050-111-2222', customer_email: 'sarah@example.com', status: 'new', priority: 'high' },
      { customer_name: 'דוד לוי', customer_phone: '052-333-4444', customer_email: 'david@example.com', status: 'new', priority: 'normal' },
      { customer_name: 'מיכל אברהם', customer_phone: '054-555-6666', customer_email: 'michal@example.com', status: 'sent', assigned_to: clientId, sent_at: new Date().toISOString(), priority: 'normal' },
      { customer_name: 'יוסי בן דוד', customer_phone: '053-777-8888', customer_email: 'yossi@example.com', status: 'sent', assigned_to: clientId, sent_at: new Date(Date.now() - 86400000).toISOString(), priority: 'hot' },
      { customer_name: 'רונית שמיר', customer_phone: '058-999-0000', customer_email: 'ronit@example.com', status: 'converted', assigned_to: clientId, sent_at: new Date(Date.now() - 172800000).toISOString(), priority: 'normal' },
      { customer_name: 'אבי גולן', customer_phone: '050-123-9876', customer_email: 'avi@example.com', status: 'new', priority: 'low' },
      { customer_name: 'נועה ישראלי', customer_phone: '052-456-7890', customer_email: 'noa@example.com', status: 'returned', assigned_to: clientId, sent_at: new Date(Date.now() - 259200000).toISOString(), priority: 'normal' },
      { customer_name: 'עומר כץ', customer_phone: '054-321-6543', customer_email: 'omer@example.com', status: 'new', priority: 'high' },
    ];

    sampleLeads.forEach((lead, index) => {
      const category = categories[index % categories.length];
      db.data.leads.push({
        id: uuidv4(),
        ...lead,
        category_id: category.id,
        service_area: 'מרכז',
        notes: '',
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    // Update demo client lead count
    if (clientId) {
      const clientLeads = db.data.leads.filter(l => l.assigned_to === clientId);
      const userIndex = db.data.users.findIndex(u => u.id === clientId);
      if (userIndex !== -1) {
        db.data.users[userIndex].leads_received_this_month = clientLeads.length;
      }
    }

    console.log('✅ Sample leads created');
  }

  await db.write();
  console.log('✅ Database initialized successfully!');
}

// Helper functions to mimic SQL-like operations
export const dbHelpers = {
  // Users
  findUserById: (id) => db.data.users.find(u => u.id === id),
  findUserByEmail: (email) => db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUsers: (filter = {}) => {
    let users = [...db.data.users];
    if (filter.role) users = users.filter(u => u.role === filter.role);
    if (filter.is_active !== undefined) users = users.filter(u => u.is_active === filter.is_active);
    return users;
  },
  createUser: async (userData) => {
    const user = { ...userData, id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.data.users.push(user);
    await db.write();
    return user;
  },
  updateUser: async (id, updates) => {
    const index = db.data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      db.data.users[index] = { ...db.data.users[index], ...updates, updated_at: new Date().toISOString() };
      await db.write();
      return db.data.users[index];
    }
    return null;
  },

  // Categories
  getCategories: (activeOnly = true) => {
    if (activeOnly) return db.data.categories.filter(c => c.is_active);
    return db.data.categories;
  },
  findCategoryById: (id) => db.data.categories.find(c => c.id === id),
  createCategory: async (catData) => {
    const category = { ...catData, id: uuidv4(), is_active: true, created_at: new Date().toISOString() };
    db.data.categories.push(category);
    await db.write();
    return category;
  },
  updateCategory: async (id, updates) => {
    const index = db.data.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      db.data.categories[index] = { ...db.data.categories[index], ...updates };
      await db.write();
      return db.data.categories[index];
    }
    return null;
  },

  // User Categories
  getUserCategories: (userId) => {
    const userCatIds = db.data.user_categories.filter(uc => uc.user_id === userId).map(uc => uc.category_id);
    return db.data.categories.filter(c => userCatIds.includes(c.id));
  },
  setUserCategories: async (userId, categoryIds) => {
    // Remove existing
    db.data.user_categories = db.data.user_categories.filter(uc => uc.user_id !== userId);
    // Add new
    categoryIds.forEach(catId => {
      db.data.user_categories.push({
        id: uuidv4(),
        user_id: userId,
        category_id: catId,
        created_at: new Date().toISOString()
      });
    });
    await db.write();
  },
  userHasCategory: (userId, categoryId) => {
    return db.data.user_categories.some(uc => uc.user_id === userId && uc.category_id === categoryId);
  },

  // Leads
  getLeads: (filter = {}) => {
    let leads = [...db.data.leads];
    if (filter.status) leads = leads.filter(l => l.status === filter.status);
    if (filter.category_id) leads = leads.filter(l => l.category_id === filter.category_id);
    if (filter.assigned_to) leads = leads.filter(l => l.assigned_to === filter.assigned_to);
    if (filter.priority) leads = leads.filter(l => l.priority === filter.priority);
    
    // Add category and user info
    leads = leads.map(lead => {
      const category = db.data.categories.find(c => c.id === lead.category_id);
      const assignedUser = db.data.users.find(u => u.id === lead.assigned_to);
      return {
        ...lead,
        category_name_en: category?.name_en,
        category_name_he: category?.name_he,
        assigned_to_name: assignedUser?.name,
        assigned_to_company: assignedUser?.company_name
      };
    });

    return leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  findLeadById: (id) => {
    const lead = db.data.leads.find(l => l.id === id);
    if (lead) {
      const category = db.data.categories.find(c => c.id === lead.category_id);
      const assignedUser = db.data.users.find(u => u.id === lead.assigned_to);
      return {
        ...lead,
        category_name_en: category?.name_en,
        category_name_he: category?.name_he,
        assigned_to_name: assignedUser?.name
      };
    }
    return null;
  },
  createLead: async (leadData) => {
    const lead = { 
      ...leadData, 
      id: uuidv4(), 
      status: 'new',
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    };
    db.data.leads.push(lead);
    await db.write();
    return lead;
  },
  updateLead: async (id, updates) => {
    const index = db.data.leads.findIndex(l => l.id === id);
    if (index !== -1) {
      db.data.leads[index] = { ...db.data.leads[index], ...updates, updated_at: new Date().toISOString() };
      await db.write();
      return db.data.leads[index];
    }
    return null;
  },
  deleteLead: async (id) => {
    db.data.leads = db.data.leads.filter(l => l.id !== id);
    await db.write();
  },

  // Lead History
  addLeadHistory: async (historyData) => {
    const history = { ...historyData, id: uuidv4(), created_at: new Date().toISOString() };
    db.data.lead_history.push(history);
    await db.write();
    return history;
  },
  getLeadHistory: (leadId) => {
    return db.data.lead_history
      .filter(h => h.lead_id === leadId)
      .map(h => {
        const performer = db.data.users.find(u => u.id === h.performed_by);
        return { ...h, performed_by_name: performer?.name };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Notifications
  getNotifications: (userId, unreadOnly = false) => {
    let notifs = db.data.notifications.filter(n => n.user_id === userId);
    if (unreadOnly) notifs = notifs.filter(n => !n.is_read);
    return notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  createNotification: async (notifData) => {
    const notif = { ...notifData, id: uuidv4(), is_read: false, created_at: new Date().toISOString() };
    db.data.notifications.push(notif);
    await db.write();
    return notif;
  },
  markNotificationRead: async (id) => {
    const index = db.data.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      db.data.notifications[index].is_read = true;
      await db.write();
    }
  },
  markAllNotificationsRead: async (userId) => {
    db.data.notifications = db.data.notifications.map(n => 
      n.user_id === userId ? { ...n, is_read: true } : n
    );
    await db.write();
  },
  deleteNotification: async (id) => {
    db.data.notifications = db.data.notifications.filter(n => n.id !== id);
    await db.write();
  },

  // Monthly Usage
  getMonthlyUsage: (userId) => {
    return db.data.monthly_usage
      .filter(m => m.user_id === userId)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months.indexOf(b.month) - months.indexOf(a.month);
      });
  },

  // Analytics helpers
  countLeads: (filter = {}) => dbHelpers.getLeads(filter).length,
  countUsers: (filter = {}) => dbHelpers.getUsers(filter).length,
  
  // Delivery log
  addDeliveryLog: async (logData) => {
    const log = { ...logData, id: uuidv4(), created_at: new Date().toISOString() };
    db.data.delivery_log.push(log);
    await db.write();
    return log;
  },

  // Get recent activity
  getRecentActivity: (limit = 20, userId = null) => {
    let history = [...db.data.lead_history];
    
    if (userId) {
      const userLeadIds = db.data.leads.filter(l => l.assigned_to === userId).map(l => l.id);
      history = history.filter(h => userLeadIds.includes(h.lead_id));
    }
    
    return history
      .map(h => {
        const lead = db.data.leads.find(l => l.id === h.lead_id);
        const performer = db.data.users.find(u => u.id === h.performed_by);
        return {
          ...h,
          customer_name: lead?.customer_name,
          customer_phone: lead?.customer_phone,
          performed_by_name: performer?.name
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  // Save changes
  save: async () => await db.write()
};

// Export the database instance and helpers
export default db;
