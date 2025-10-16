// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Name validation
export const isValidName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Page title validation
export const isValidPageTitle = (title: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Page title is required');
  }
  
  if (title.length > 100) {
    errors.push('Page title must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Page description validation
export const isValidPageDescription = (description: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (description && description.length > 500) {
    errors.push('Page description must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form field validation
export const validateFormField = (field: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!field.name || field.name.trim().length === 0) {
    errors.push('Field name is required');
  }
  
  if (!field.label || field.label.trim().length === 0) {
    errors.push('Field label is required');
  }
  
  if (!field.type || !['text', 'email', 'password', 'textarea', 'select', 'checkbox', 'radio'].includes(field.type)) {
    errors.push('Valid field type is required');
  }
  
  if (['select', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
    errors.push('Options are required for select and radio fields');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Tag validation
export const isValidTag = (tag: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!tag || tag.trim().length === 0) {
    errors.push('Tag cannot be empty');
  }
  
  if (tag.length > 20) {
    errors.push('Tag must be less than 20 characters');
  }
  
  if (!/^[a-zA-Z0-9\s-_]+$/.test(tag)) {
    errors.push('Tag can only contain letters, numbers, spaces, hyphens, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// CSS validation
export const isValidCSS = (css: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (css && css.length > 10000) {
    errors.push('CSS must be less than 10,000 characters');
  }
  
  // Basic CSS syntax validation
  if (css) {
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('CSS has mismatched braces');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// JavaScript validation
export const isValidJavaScript = (js: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (js && js.length > 10000) {
    errors.push('JavaScript must be less than 10,000 characters');
  }
  
  // Basic JavaScript syntax validation
  if (js) {
    try {
      // Try to parse the JavaScript
      // eslint-disable-next-line no-new-func
      new Function(js);
    } catch (error) {
      errors.push(`JavaScript syntax error: ${(error as Error).message}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Color validation (hex, rgb, rgba, named colors)
export const isValidColor = (color: string): boolean => {
  if (!color) return false;
  
  // Hex color
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true;
  }
  
  // RGB color
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return true;
  }
  
  // RGBA color
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return true;
  }
  
  // HSL color
  if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color)) {
    return true;
  }
  
  // HSLA color
  if (/^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/.test(color)) {
    return true;
  }
  
  // Named colors
  const namedColors = [
    'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange',
    'purple', 'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta', 'lime',
    'maroon', 'navy', 'olive', 'teal', 'silver', 'gold', 'aqua', 'fuchsia'
  ];
  
  if (namedColors.includes(color.toLowerCase())) {
    return true;
  }
  
  return false;
};

// Size validation (CSS units)
export const isValidSize = (size: string): boolean => {
  if (!size) return false;
  
  // Check for valid CSS size units
  const validUnits = ['px', 'em', 'rem', '%', 'vh', 'vw', 'vmin', 'vmax', 'pt', 'pc', 'in', 'cm', 'mm'];
  const sizeRegex = new RegExp(`^\\d+(?:\\.\\d+)?(${validUnits.join('|')})$`);
  
  return sizeRegex.test(size);
};

// Generic validation function
export const validateField = (
  value: any,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => { isValid: boolean; errors: string[] };
  }
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required validation
  if (rules.required && (!value || value.toString().trim().length === 0)) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }
  
  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim().length === 0) {
    return { isValid: true, errors: [] };
  }
  
  const stringValue = value.toString();
  
  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters long`);
  }
  
  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Must be less than ${rules.maxLength} characters long`);
  }
  
  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push('Invalid format');
  }
  
  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(value);
    if (!customResult.isValid) {
      errors.push(...customResult.errors);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize HTML content
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// Validate file upload
export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // File size validation
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size must be less than ${(options.maxSize / 1024 / 1024).toFixed(1)}MB`);
  }
  
  // File type validation
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // File extension validation
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
