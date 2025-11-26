import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  company_name: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  package_type: { type: String, enum: ['starter', 'professional', 'enterprise', 'pay_per_lead'], default: 'starter' },
  monthly_lead_limit: { type: Number, default: 20 },
  leads_received_this_month: { type: Number, default: 0 },
  categories_allowed: { type: Number, default: 1 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  dedicated_manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  is_vip: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date, default: null }
}, { timestamps: true });

// Category Schema
const categorySchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_he: { type: String, required: true },
  description_en: { type: String, default: '' },
  description_he: { type: String, default: '' },
  icon: { type: String, default: 'Briefcase' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// Lead Schema
const leadSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  customer_email: { type: String, default: '' },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  status: { type: String, enum: ['new', 'sent', 'converted', 'returned', 'invalid'], default: 'new' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  service_area: { type: String, default: '' },
  notes: { type: String, default: '' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sent_at: { type: Date, default: null },
  sent_via: { type: String, enum: ['email', 'sms', 'both', null], default: null },
  converted_at: { type: Date, default: null },
  return_reason: { type: String, default: '' }
}, { timestamps: true });

// Lead History Schema
const leadHistorySchema = new mongoose.Schema({
  lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  action: { type: String, required: true },
  old_value: { type: String, default: '' },
  new_value: { type: String, default: '' },
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Notification Schema
const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error', 'lead'], default: 'info' },
  is_read: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, { timestamps: true });

// Delivery Log Schema
const deliveryLogSchema = new mongoose.Schema({
  lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  delivery_method: { type: String, enum: ['email', 'sms'], required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  error_message: { type: String, default: '' }
}, { timestamps: true });

// Create models
export const User = mongoose.model('User', userSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Lead = mongoose.model('Lead', leadSchema);
export const LeadHistory = mongoose.model('LeadHistory', leadHistorySchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const DeliveryLog = mongoose.model('DeliveryLog', deliveryLogSchema);

export default {
  User,
  Category,
  Lead,
  LeadHistory,
  Notification,
  DeliveryLog
};
