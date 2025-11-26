import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Category, Lead, Notification } from './models/index.js';

// Connect to MongoDB
export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qualilead';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB');
    
    // Seed initial data if needed
    await seedDatabase();
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed initial data
async function seedDatabase() {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@qualilead.com' });
    
    if (!adminExists) {
      console.log('🌱 Seeding database...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        email: 'admin@qualilead.com',
        password: hashedPassword,
        name: 'מנהל ראשי',
        phone: '050-000-0000',
        company_name: 'QualiLead',
        role: 'admin',
        package_type: 'enterprise',
        monthly_lead_limit: -1,
        is_vip: true,
        is_active: true
      });
      
      console.log('✅ Admin user created');
      
      // Create default categories
      const categories = await Category.insertMany([
        { name_en: 'Beauticians & Aesthetics', name_he: 'קוסמטיקאיות ואסתטיקה', icon: 'Sparkles', description_en: 'Beauty services, skincare, cosmetics', description_he: 'שירותי יופי, טיפוח עור, קוסמטיקה' },
        { name_en: 'Hair Salons & Barbers', name_he: 'מספרות וספרים', icon: 'Scissors', description_en: 'Haircuts, styling, grooming', description_he: 'תספורות, עיצוב שיער, טיפוח' },
        { name_en: 'AC Technicians', name_he: 'טכנאי מזגנים', icon: 'Wind', description_en: 'Air conditioning installation and repair', description_he: 'התקנה ותיקון מזגנים' },
        { name_en: 'Renovation Contractors', name_he: 'קבלני שיפוצים', icon: 'Hammer', description_en: 'Home renovation and remodeling', description_he: 'שיפוצים ועבודות בנייה' },
        { name_en: 'Electricians', name_he: 'חשמלאים', icon: 'Zap', description_en: 'Electrical installation and repairs', description_he: 'עבודות חשמל והתקנות' },
        { name_en: 'Plumbers', name_he: 'אינסטלטורים', icon: 'Droplets', description_en: 'Plumbing services and repairs', description_he: 'שירותי אינסטלציה ותיקונים' },
        { name_en: 'Small Businesses', name_he: 'עסקים קטנים', icon: 'Store', description_en: 'General small business leads', description_he: 'לידים לעסקים קטנים' },
        { name_en: 'Local Services', name_he: 'שירותים מקומיים', icon: 'MapPin', description_en: 'Local service providers', description_he: 'נותני שירות מקומיים' }
      ]);
      
      console.log('✅ Categories created');
      
      // Create demo client
      const clientPassword = await bcrypt.hash('demo123', 10);
      const client = await User.create({
        email: 'demo@example.com',
        password: clientPassword,
        name: 'לקוח לדוגמה',
        phone: '054-123-4567',
        company_name: 'עסק לדוגמה בע"מ',
        role: 'client',
        package_type: 'professional',
        monthly_lead_limit: 50,
        leads_received_this_month: 3,
        categories_allowed: 3,
        categories: [categories[0]._id, categories[1]._id, categories[2]._id],
        dedicated_manager_id: admin._id,
        is_vip: true,
        is_active: true
      });
      
      console.log('✅ Demo client created');
      
      // Create sample leads
      const sampleLeads = [
        { customer_name: 'שרה כהן', customer_phone: '052-111-2222', customer_email: 'sarah@example.com', category_id: categories[0]._id, status: 'sent', assigned_to: client._id, sent_at: new Date(), sent_via: 'email', priority: 'high', service_area: 'תל אביב' },
        { customer_name: 'דוד לוי', customer_phone: '053-333-4444', customer_email: 'david@example.com', category_id: categories[1]._id, status: 'sent', assigned_to: client._id, sent_at: new Date(Date.now() - 86400000), sent_via: 'sms', priority: 'normal', service_area: 'רמת גן' },
        { customer_name: 'רחל אברהם', customer_phone: '054-555-6666', customer_email: 'rachel@example.com', category_id: categories[2]._id, status: 'converted', assigned_to: client._id, sent_at: new Date(Date.now() - 172800000), converted_at: new Date(), priority: 'normal', service_area: 'הרצליה' },
        { customer_name: 'יוסי מזרחי', customer_phone: '050-777-8888', customer_email: 'yossi@example.com', category_id: categories[3]._id, status: 'new', priority: 'urgent', service_area: 'ירושלים' },
        { customer_name: 'מיכל שמעון', customer_phone: '058-999-0000', customer_email: 'michal@example.com', category_id: categories[4]._id, status: 'new', priority: 'high', service_area: 'חיפה' }
      ];
      
      await Lead.insertMany(sampleLeads);
      console.log('✅ Sample leads created');
      
      // Create welcome notification for demo client
      await Notification.create({
        user_id: client._id,
        title: 'ברוכים הבאים ל-QualiLead!',
        message: 'החשבון שלך הופעל בהצלחה. התחל לקבל לידים איכותיים עוד היום!',
        type: 'success',
        is_read: false
      });
      
      console.log('✅ Database seeded successfully!');
    }
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

export default { connectDB };
