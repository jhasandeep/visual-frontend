import { Block, BlockType, BlockContent, BlockStyles } from '../types';

// Export BlockType for use in other files
export type { BlockType };

// Generate unique block ID
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get default content for each block type
export const getDefaultBlockContent = (type: BlockType): BlockContent => {
  switch (type) {
    case 'text':
      return {
        text: 'Click to edit text',
        tag: 'p',
        alignment: 'left',
        formatting: { bold: false, italic: false, underline: false },
      };
    case 'image':
      return {
        src: '',
        alt: 'Image',
        alignment: 'center',
        width: '100%',
        height: 'auto',
      };
    case 'button':
      return {
        text: 'Click me',
        link: '#',
        target: '_self',
        variant: 'primary',
      };
    case 'container':
      return {
        backgroundColor: 'transparent',
        children: [],
      };
    case 'form':
      return {
        action: '#',
        method: 'POST',
        fields: [
          {
            id: generateFieldId(),
            type: 'text',
            name: 'name',
            label: 'Name',
            placeholder: 'Enter your name',
            required: true,
          },
        ],
        submitText: 'Submit',
      };
    case 'divider':
      return {
        direction: 'horizontal',
        style: 'solid',
        thickness: '1px',
      };
    case 'card':
      return {
        title: 'Card Title',
        description: 'Card description goes here',
        image: '',
        buttonText: 'Learn More',
        buttonLink: '#',
        layout: 'vertical',
      };
    case 'list':
      return {
        type: 'unordered',
        items: ['Item 1', 'Item 2', 'Item 3'],
        bulletStyle: 'disc',
      };
    default:
      return {};
  }
};

// Get default styles for each block type
export const getDefaultBlockStyles = (type: BlockType): BlockStyles => {
  switch (type) {
    case 'text':
      return {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0',
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.5',
        textAlign: 'left',
      };
    case 'image':
      return {
        borderRadius: '0px',
        objectFit: 'cover',
        opacity: 1,
        filter: 'none',
        boxShadow: 'none',
      };
    case 'button':
      return {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderColor: '#3b82f6',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '16px',
        fontWeight: '500',
        border: '1px solid #3b82f6',
        cursor: 'pointer',
        transition: 'all 0.2s',
      };
    case 'container':
      return {
        padding: '16px',
        margin: '0',
        borderRadius: '0px',
        border: 'none',
        backgroundColor: 'transparent',
        minHeight: 'auto',
        display: 'block',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: '0px',
      };
    case 'form':
      return {
        padding: '20px',
        margin: '0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
      };
    case 'divider':
      return {
        color: '#e5e7eb',
        width: '100%',
        height: '1px',
        margin: '16px 0',
      };
    case 'card':
      return {
        padding: '16px',
        margin: '0',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      };
    case 'list':
      return {
        padding: '0',
        margin: '0',
        listStyleType: 'disc',
        listStylePosition: 'inside',
      };
    default:
      return {};
  }
};

// Generate unique field ID for form fields
export const generateFieldId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate block content based on type
export const validateBlockContent = (type: BlockType, content: BlockContent): string[] => {
  const errors: string[] = [];

  switch (type) {
    case 'text':
      if (!content.text || content.text.trim() === '') {
        errors.push('Text content is required');
      }
      if (!content.tag || !['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(content.tag)) {
        errors.push('Valid HTML tag is required');
      }
      break;

    case 'image':
      if (!content.src || content.src.trim() === '') {
        errors.push('Image source is required');
      }
      if (!content.alt || content.alt.trim() === '') {
        errors.push('Image alt text is required');
      }
      break;

    case 'button':
      if (!content.text || content.text.trim() === '') {
        errors.push('Button text is required');
      }
      if (!content.link || content.link.trim() === '') {
        errors.push('Button link is required');
      }
      break;

    case 'form':
      if (!content.action || content.action.trim() === '') {
        errors.push('Form action is required');
      }
      if (!content.method || !['GET', 'POST'].includes(content.method)) {
        errors.push('Valid form method is required');
      }
      if (!content.fields || !Array.isArray(content.fields) || content.fields.length === 0) {
        errors.push('At least one form field is required');
      }
      break;

    case 'list':
      if (!content.items || !Array.isArray(content.items) || content.items.length === 0) {
        errors.push('At least one list item is required');
      }
      break;

    case 'card':
      if (!content.title || content.title.trim() === '') {
        errors.push('Card title is required');
      }
      if (!content.description || content.description.trim() === '') {
        errors.push('Card description is required');
      }
      break;
  }

  return errors;
};

// Apply styles to a block element
export const applyBlockStyles = (styles: BlockStyles): React.CSSProperties => {
  const cssStyles: React.CSSProperties = {};

  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Convert camelCase to kebab-case for CSS properties
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      (cssStyles as any)[cssKey] = value;
    }
  });

  return cssStyles;
};

// Get block display name
export const getBlockDisplayName = (type: BlockType): string => {
  const names: Record<BlockType, string> = {
    text: 'Text',
    image: 'Image',
    button: 'Button',
    container: 'Container',
    form: 'Form',
    divider: 'Divider',
    card: 'Card',
    list: 'List',
  };

  return names[type] || type;
};

// Get block icon (you can replace with actual icons)
export const getBlockIcon = (type: BlockType): string => {
  const icons: Record<BlockType, string> = {
    text: '📝',
    image: '🖼️',
    button: '🔘',
    container: '📦',
    form: '📋',
    divider: '➖',
    card: '🃏',
    list: '📋',
  };

  return icons[type] || '❓';
};

// Check if block can contain children
export const canContainChildren = (type: BlockType): boolean => {
  return type === 'container';
};

// Get block category
export const getBlockCategory = (type: BlockType): string => {
  const categories: Record<BlockType, string> = {
    text: 'Content',
    image: 'Media',
    button: 'Interactive',
    container: 'Layout',
    form: 'Interactive',
    divider: 'Layout',
    card: 'Content',
    list: 'Content',
  };

  return categories[type] || 'Other';
};

// Sort blocks by order
export const sortBlocksByOrder = (blocks: Block[]): Block[] => {
  return [...blocks].sort((a, b) => a.order - b.order);
};

// Find block by ID in nested structure
export const findBlockById = (blocks: Block[], blockId: string): Block | null => {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    // If block has children, search recursively
    if (block.children && block.children.length > 0) {
      const childBlocks = blocks.filter(b => block.children?.includes(b.id));
      const found = findBlockById(childBlocks, blockId);
      if (found) return found;
    }
  }
  return null;
};

// Get all child blocks of a parent
export const getChildBlocks = (blocks: Block[], parentId: string): Block[] => {
  return blocks.filter(block => block.parent === parentId);
};

// Alias for getChildBlocks
export const getBlockChildren = getChildBlocks;

// Calculate block depth in hierarchy
export const getBlockDepth = (blocks: Block[], blockId: string): number => {
  const block = findBlockById(blocks, blockId);
  if (!block || !block.parent) return 0;
  
  return 1 + getBlockDepth(blocks, block.parent);
};

// Check if block is ancestor of another block
export const isAncestor = (blocks: Block[], ancestorId: string, descendantId: string): boolean => {
  const descendant = findBlockById(blocks, descendantId);
  if (!descendant || !descendant.parent) return false;
  
  if (descendant.parent === ancestorId) return true;
  
  return isAncestor(blocks, ancestorId, descendant.parent);
};
