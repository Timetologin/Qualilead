import { describe, it, expect } from 'vitest';
import { schemas, validate, sanitizeString, sanitizeObject } from './validation.js';

describe('Validation Middleware', () => {
  describe('sanitizeString', () => {
    it('escapes HTML characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('returns non-strings unchanged', () => {
      expect(sanitizeString(123)).toBe(123);
      expect(sanitizeString(null)).toBe(null);
    });
  });

  describe('sanitizeObject', () => {
    it('sanitizes nested objects', () => {
      const input = {
        name: '<script>evil</script>',
        nested: {
          value: 'a < b'
        }
      };
      const expected = {
        name: '&lt;script&gt;evil&lt;/script&gt;',
        nested: {
          value: 'a &lt; b'
        }
      };
      expect(sanitizeObject(input)).toEqual(expected);
    });

    it('sanitizes arrays', () => {
      const input = ['<b>bold</b>', 'normal'];
      const expected = ['&lt;b&gt;bold&lt;/b&gt;', 'normal'];
      expect(sanitizeObject(input)).toEqual(expected);
    });
  });

  describe('schemas.contact', () => {
    it('validates a correct contact form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+972-50-1234567',
        message: 'This is a test message that is long enough.'
      };
      const { error } = schemas.contact.validate(validData);
      expect(error).toBeUndefined();
    });

    it('rejects invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+972-50-1234567',
        message: 'This is a test message.'
      };
      const { error } = schemas.contact.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('email');
    });

    it('rejects short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+972-50-1234567',
        message: 'Short'
      };
      const { error } = schemas.contact.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('schemas.lead.create', () => {
    it('validates a correct lead', () => {
      const validLead = {
        customer_name: 'Jane Smith',
        customer_phone: '050-1234567',
        customer_email: 'jane@example.com',
        category_id: '123456',
        priority: 'high',
        notes: 'Some notes'
      };
      const { error, value } = schemas.lead.create.validate(validLead);
      expect(error).toBeUndefined();
      expect(value.priority).toBe('high');
    });

    it('uses default priority when not specified', () => {
      const leadWithoutPriority = {
        customer_name: 'Jane Smith',
        customer_phone: '050-1234567',
        category_id: '123456'
      };
      const { error, value } = schemas.lead.create.validate(leadWithoutPriority);
      expect(error).toBeUndefined();
      expect(value.priority).toBe('normal');
    });

    it('rejects invalid phone format', () => {
      const invalidLead = {
        customer_name: 'Jane Smith',
        customer_phone: '123',
        category_id: '123456'
      };
      const { error } = schemas.lead.create.validate(invalidLead);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('customer_phone');
    });
  });

  describe('validate middleware', () => {
    it('calls next() on valid input', () => {
      const req = {
        body: {
          name: 'Test',
          email: 'test@example.com',
          phone: '050-1234567',
          message: 'This is a valid test message.'
        }
      };
      const res = {
        status: () => ({ json: () => {} })
      };
      const next = () => 'next called';

      const middleware = validate(schemas.contact);
      const result = middleware(req, res, next);
      expect(result).toBe('next called');
    });

    it('returns 400 on invalid input', () => {
      const req = {
        body: {
          name: '',
          email: 'invalid',
          phone: '123',
          message: ''
        }
      };
      let statusCode = null;
      let responseBody = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (body) => {
              responseBody = body;
            }
          };
        }
      };
      const next = () => 'should not be called';

      const middleware = validate(schemas.contact);
      middleware(req, res, next);

      expect(statusCode).toBe(400);
      expect(responseBody.error).toBe('Validation failed');
      expect(responseBody.details.length).toBeGreaterThan(0);
    });
  });
});
