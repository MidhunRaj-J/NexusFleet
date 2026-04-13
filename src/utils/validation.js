export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return null;
  },

  phone: (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit number';
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  name: (value) => {
    if (!value || value.trim().length === 0) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 100) return 'Name must be less than 100 characters';
    return null;
  },

  address: (value) => {
    if (!value || value.trim().length === 0) return 'Address is required';
    if (value.length < 5) return 'Address must be at least 5 characters';
    return null;
  },

  amount: (value) => {
    const num = Number(value);
    if (!value) return 'Amount is required';
    if (isNaN(num)) return 'Amount must be a number';
    if (num <= 0) return 'Amount must be greater than 0';
    return null;
  },

  distance: (value) => {
    const num = Number(value);
    if (!value) return 'Distance is required';
    if (isNaN(num)) return 'Distance must be a number';
    if (num <= 0) return 'Distance must be greater than 0';
    if (num > 500) return 'Distance cannot exceed 500 km';
    return null;
  },

  weight: (value) => {
    const num = Number(value);
    if (!value) return 'Weight is required';
    if (isNaN(num)) return 'Weight must be a number';
    if (num <= 0) return 'Weight must be greater than 0';
    if (num > 100) return 'Weight cannot exceed 100 kg';
    return null;
  },
};

export function validateForm(data, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const validator = rules[field];
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  });
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
