// Tests for utility functions that might be used throughout the app
// These test common form validation and data formatting utilities

describe('Form Validation Utils', () => {
  // Email validation utility
  const validateEmail = (email: string): boolean => {
    // Basic email regex that prevents consecutive dots and requires proper structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Additional check to prevent consecutive dots
    return emailRegex.test(email) && !email.includes('..');
  };

  // Phone number validation (basic format)
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Postal code validation for different countries
  const validatePostalCode = (postalCode: string, countryId: string): boolean => {
    const patterns = {
      us: /^\d{5}(-\d{4})?$/,
      ca: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      dk: /^\d{4}$/,
      au: /^\d{4}$/,
    };

    const pattern = patterns[countryId as keyof typeof patterns];
    return pattern ? pattern.test(postalCode) : postalCode.length > 0;
  };

  // Name validation (no numbers, reasonable length)
  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s'.,-]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  // Address validation (basic non-empty check with reasonable length)
  const validateAddress = (address: string): boolean => {
    return address.trim().length >= 5 && address.trim().length <= 100;
  };

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..email@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone number formats', () => {
      expect(validatePhoneNumber('+1 555 123 4567')).toBe(true);
      expect(validatePhoneNumber('555-123-4567')).toBe(true);
      expect(validatePhoneNumber('(555) 123-4567')).toBe(true);
      expect(validatePhoneNumber('15551234567')).toBe(true);
    });

    it('should reject invalid phone number formats', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abc-def-ghij')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('validatePostalCode', () => {
    it('should validate US postal codes', () => {
      expect(validatePostalCode('12345', 'us')).toBe(true);
      expect(validatePostalCode('12345-6789', 'us')).toBe(true);
      expect(validatePostalCode('1234', 'us')).toBe(false);
      expect(validatePostalCode('123456', 'us')).toBe(false);
    });

    it('should validate Canadian postal codes', () => {
      expect(validatePostalCode('K1A 0A6', 'ca')).toBe(true);
      expect(validatePostalCode('M5V 3L9', 'ca')).toBe(true);
      expect(validatePostalCode('12345', 'ca')).toBe(false);
      expect(validatePostalCode('K1A0A6', 'ca')).toBe(false); // Missing space
    });

    it('should validate Danish postal codes', () => {
      expect(validatePostalCode('1000', 'dk')).toBe(true);
      expect(validatePostalCode('2100', 'dk')).toBe(true);
      expect(validatePostalCode('123', 'dk')).toBe(false);
      expect(validatePostalCode('12345', 'dk')).toBe(false);
    });

    it('should validate Australian postal codes', () => {
      expect(validatePostalCode('3000', 'au')).toBe(true);
      expect(validatePostalCode('2000', 'au')).toBe(true);
      expect(validatePostalCode('123', 'au')).toBe(false);
      expect(validatePostalCode('12345', 'au')).toBe(false);
    });

    it('should accept any non-empty postal code for unknown countries', () => {
      expect(validatePostalCode('ABC123', 'unknown')).toBe(true);
      expect(validatePostalCode('', 'unknown')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should validate correct name formats', () => {
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('Mary Jane Smith')).toBe(true);
      expect(validateName("O'Connor")).toBe(true);
      expect(validateName('Jean-Pierre')).toBe(true);
      expect(validateName('Smith, Jr.')).toBe(true);
    });

    it('should reject invalid name formats', () => {
      expect(validateName('J')).toBe(false); // Too short
      expect(validateName('John123')).toBe(false); // Contains numbers
      expect(validateName('')).toBe(false); // Empty
      expect(validateName('A'.repeat(51))).toBe(false); // Too long
      expect(validateName('John@Doe')).toBe(false); // Invalid characters
    });
  });

  describe('validateAddress', () => {
    it('should validate correct address formats', () => {
      expect(validateAddress('123 Main Street')).toBe(true);
      expect(validateAddress('456 Oak Avenue, Apt 2B')).toBe(true);
      expect(validateAddress('789 Pine Rd, Suite 100')).toBe(true);
    });

    it('should reject invalid address formats', () => {
      expect(validateAddress('123')).toBe(false); // Too short
      expect(validateAddress('')).toBe(false); // Empty
      expect(validateAddress('A'.repeat(101))).toBe(false); // Too long
      expect(validateAddress('   ')).toBe(false); // Only whitespace
    });
  });
});

describe('Data Formatting Utils', () => {
  // Format phone number for display
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone; // Return original if not standard format
  };

  // Capitalize first letter of each word
  const titleCase = (str: string): string => {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format address for display
  const formatAddress = (user: { address1?: string | null; address2?: string | null; city?: string | null; postal_code?: number | string | null; country_name?: string }): string => {
    const parts = [];

    if (user.address1) parts.push(user.address1);
    if (user.address2) parts.push(user.address2);

    const cityPostal = [];
    if (user.city) cityPostal.push(user.city);
    if (user.postal_code) cityPostal.push(user.postal_code.toString());

    if (cityPostal.length > 0) parts.push(cityPostal.join(' '));
    if (user.country_name) parts.push(user.country_name);

    return parts.join(', ');
  };

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
    });

    it('should format 11-digit US numbers with country code', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
      expect(formatPhoneNumber('1-555-123-4567')).toBe('+1 (555) 123-4567');
    });

    it('should return original format for non-standard numbers', () => {
      expect(formatPhoneNumber('+44 20 7946 0958')).toBe('+44 20 7946 0958');
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('titleCase', () => {
    it('should capitalize first letter of each word', () => {
      expect(titleCase('john doe')).toBe('John Doe');
      expect(titleCase('MARY JANE SMITH')).toBe('Mary Jane Smith');
      expect(titleCase('jean-pierre o\'connor')).toBe('Jean-Pierre O\'Connor');
    });

    it('should handle edge cases', () => {
      expect(titleCase('')).toBe('');
      expect(titleCase('a')).toBe('A');
      expect(titleCase('multiple   spaces')).toBe('Multiple   Spaces');
    });
  });

  describe('formatAddress', () => {
    it('should format complete address', () => {
      const user = {
        address1: '123 Main St',
        address2: 'Apt 2B',
        city: 'New York',
        postal_code: '10001',
        country_name: 'USA',
      };

      expect(formatAddress(user)).toBe('123 Main St, Apt 2B, New York 10001, USA');
    });

    it('should handle missing address components', () => {
      const user = {
        address1: '456 Oak Ave',
        city: 'Los Angeles',
        country_name: 'USA',
      };

      expect(formatAddress(user)).toBe('456 Oak Ave, Los Angeles, USA');
    });

    it('should handle empty address', () => {
      const user = {};
      expect(formatAddress(user)).toBe('');
    });

    it('should handle numeric postal codes', () => {
      const user = {
        address1: '789 Pine St',
        city: 'Chicago',
        postal_code: 60601,
        country_name: 'USA',
      };

      expect(formatAddress(user)).toBe('789 Pine St, Chicago 60601, USA');
    });
  });
});
