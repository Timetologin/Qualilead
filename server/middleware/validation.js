import Joi from 'joi';

// Common validation schemas
export const schemas = {
  // Lead validation
  lead: {
    create: Joi.object({
      customer_name: Joi.string().min(2).max(100).required()
        .messages({ 'string.empty': 'Customer name is required' }),
      customer_phone: Joi.string().pattern(/^[\d\-+() ]{8,20}$/).required()
        .messages({
          'string.pattern.base': 'Invalid phone number format',
          'string.empty': 'Phone number is required'
        }),
      customer_email: Joi.string().email().allow('').optional(),
      category_id: Joi.string().required()
        .messages({ 'string.empty': 'Category is required' }),
      priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
      service_area: Joi.string().max(100).allow('').optional(),
      notes: Joi.string().max(1000).allow('').optional()
    }),
    update: Joi.object({
      customer_name: Joi.string().min(2).max(100),
      customer_phone: Joi.string().pattern(/^[\d\-+() ]{8,20}$/),
      customer_email: Joi.string().email().allow(''),
      category_id: Joi.string(),
      priority: Joi.string().valid('low', 'normal', 'high', 'urgent'),
      status: Joi.string().valid('new', 'sent', 'converted', 'returned', 'invalid'),
      service_area: Joi.string().max(100).allow(''),
      notes: Joi.string().max(1000).allow('')
    }).min(1)
  },

  // User validation
  user: {
    register: Joi.object({
      email: Joi.string().email().required()
        .messages({ 'string.email': 'Invalid email format' }),
      password: Joi.string().min(6).max(100).required()
        .messages({ 'string.min': 'Password must be at least 6 characters' }),
      name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^[\d\-+() ]{8,20}$/).allow('').optional(),
      company_name: Joi.string().max(100).allow('').optional()
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    update: Joi.object({
      name: Joi.string().min(2).max(100),
      phone: Joi.string().pattern(/^[\d\-+() ]{8,20}$/).allow(''),
      company_name: Joi.string().max(100).allow(''),
      package_type: Joi.string().valid('starter', 'professional', 'enterprise'),
      monthly_lead_limit: Joi.number().integer().min(-1),
      is_active: Joi.boolean(),
      is_vip: Joi.boolean()
    }).min(1),
    changePassword: Joi.object({
      current_password: Joi.string().required(),
      new_password: Joi.string().min(6).max(100).required()
    })
  },

  // Contact form validation
  contact: Joi.object({
    name: Joi.string().min(2).max(100).required()
      .messages({ 'string.empty': 'Name is required' }),
    email: Joi.string().email().required()
      .messages({ 'string.email': 'Invalid email format' }),
    phone: Joi.string().pattern(/^[\d\-+() ]{8,20}$/).required()
      .messages({ 'string.pattern.base': 'Invalid phone number' }),
    business: Joi.string().max(100).allow('').optional(),
    message: Joi.string().min(10).max(2000).required()
      .messages({ 'string.min': 'Message must be at least 10 characters' })
  }),

  // Category validation
  category: {
    create: Joi.object({
      name_en: Joi.string().min(2).max(100).required(),
      name_he: Joi.string().min(2).max(100).required(),
      description_en: Joi.string().max(500).allow('').optional(),
      description_he: Joi.string().max(500).allow('').optional(),
      icon: Joi.string().max(50).allow('').optional(),
      is_active: Joi.boolean().default(true)
    }),
    update: Joi.object({
      name_en: Joi.string().min(2).max(100),
      name_he: Joi.string().min(2).max(100),
      description_en: Joi.string().max(500).allow(''),
      description_he: Joi.string().max(500).allow(''),
      icon: Joi.string().max(50).allow(''),
      is_active: Joi.boolean()
    }).min(1)
  },

  // Assign lead validation
  assignLead: Joi.object({
    user_id: Joi.string().required()
      .messages({ 'string.empty': 'User ID is required' }),
    send_via: Joi.string().valid('email', 'sms', 'both').default('email')
  })
};

// Validation middleware factory
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace body with validated and sanitized data
    req.body = value;
    next();
  };
}

// Sanitize string to prevent XSS
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Sanitize object recursively
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

// Middleware to sanitize request body
export function sanitizeBody(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
}

export default { schemas, validate, sanitizeBody, sanitizeString, sanitizeObject };
