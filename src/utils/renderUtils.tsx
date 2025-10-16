import React from 'react';
import { Block } from '../types';
import BlockRenderer from '../components/builder/BlockRenderer';

export const renderBlocks = (blocks: Block[]): React.ReactNode => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks
        .filter((block: Block) => !block.parent) // Only render root blocks
        .sort((a: Block, b: Block) => a.order - b.order)
        .map((block: Block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isPreview={true}
          />
        ))}
    </div>
  );
};

export const renderBlock = (block: Block): React.ReactNode => {
  return (
    <BlockRenderer
      key={block.id}
      block={block}
      isPreview={true}
    />
  );
};

export const generateStaticHTML = (blocks: Block[], pageTitle: string): string => {
  const blockHTML = blocks
    .filter(block => !block.parent)
    .sort((a, b) => a.order - b.order)
    .map(block => generateBlockHTML(block))
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        body {
            font-family: Inter, system-ui, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .text-block h1 { font-size: 2rem; margin-bottom: 1rem; }
        .text-block h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
        .text-block h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .text-block p { margin-bottom: 1rem; }
        
        .image-block img { max-width: 100%; height: auto; }
        
        .button-block a {
            display: inline-block;
            padding: 8px 16px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        
        .button-block a:hover {
            background-color: #2563eb;
        }
        
        .container-block {
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
        }
        
        .form-block {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .form-block input,
        .form-block textarea,
        .form-block select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin-bottom: 12px;
        }
        
        .form-block button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        
        .divider-block {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
        }
        
        .card-block {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }
        
        .list-block ul,
        .list-block ol {
            padding-left: 20px;
        }
        
        .list-block li {
            margin-bottom: 4px;
        }
    </style>
</head>
<body>
    ${blockHTML}
</body>
</html>
  `.trim();
};

const generateBlockHTML = (block: Block): string => {
  const styles = Object.entries(block.styles || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  const styleAttr = styles ? ` style="${styles}"` : '';

  switch (block.type) {
    case 'text': {
      const content = block.content as any;
      const Tag = content.tag || 'p';
      const textAlign = content.alignment ? `text-align: ${content.alignment};` : '';
      const fontWeight = content.formatting?.bold ? 'font-weight: bold;' : '';
      const fontStyle = content.formatting?.italic ? 'font-style: italic;' : '';
      const textDecoration = content.formatting?.underline ? 'text-decoration: underline;' : '';
      
      const textStyles = [textAlign, fontWeight, fontStyle, textDecoration]
        .filter(Boolean)
        .join(' ');
      
      return `<${Tag} class="text-block"${textStyles ? ` style="${textStyles}"` : ''}>${content.text || ''}</${Tag}>`;
    }

    case 'image': {
      const content = block.content as any;
      return `<div class="image-block"><img src="${content.src || ''}" alt="${content.alt || ''}" /></div>`;
    }

    case 'button': {
      const content = block.content as any;
      return `<div class="button-block"><a href="${content.link || '#'}">${content.text || 'Button'}</a></div>`;
    }

    case 'container': {
      const content = block.content as any;
      const backgroundColor = content.backgroundColor && content.backgroundColor !== 'transparent' 
        ? `background-color: ${content.backgroundColor};` 
        : '';
      const backgroundImage = content.backgroundImage 
        ? `background-image: url(${content.backgroundImage}); background-size: cover; background-position: center;` 
        : '';
      
      const containerStyles = [backgroundColor, backgroundImage].filter(Boolean).join(' ');
      
      return `<div class="container-block"${containerStyles ? ` style="${containerStyles}"` : ''}>
        ${block.children?.map(childId => {
          const childBlock = findBlockById(block, childId);
          return childBlock ? generateBlockHTML(childBlock) : '';
        }).join('') || ''}
      </div>`;
    }

    case 'form': {
      const content = block.content as any;
      const fieldsHTML = content.fields?.map((field: any) => {
        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
            return `<div>
              <label>${field.label}${field.required ? ' *' : ''}</label>
              <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} />
            </div>`;
          
          case 'textarea':
            return `<div>
              <label>${field.label}${field.required ? ' *' : ''}</label>
              <textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
            </div>`;
          
          case 'select':
            return `<div>
              <label>${field.label}${field.required ? ' *' : ''}</label>
              <select name="${field.name}" ${field.required ? 'required' : ''}>
                <option value="">Select an option</option>
                ${field.options?.map((option: string) => `<option value="${option}">${option}</option>`).join('') || ''}
              </select>
            </div>`;
          
          case 'checkbox':
            return `<div>
              <label>
                <input type="checkbox" name="${field.name}" ${field.required ? 'required' : ''} />
                ${field.label}${field.required ? ' *' : ''}
              </label>
            </div>`;
          
          case 'radio':
            return `<div>
              <label>${field.label}${field.required ? ' *' : ''}</label>
              ${field.options?.map((option: string) => `
                <label>
                  <input type="radio" name="${field.name}" value="${option}" ${field.required ? 'required' : ''} />
                  ${option}
                </label>
              `).join('') || ''}
            </div>`;
          
          default:
            return '';
        }
      }).join('') || '';
      
      return `<form class="form-block" action="${content.action || '#'}" method="${content.method || 'POST'}">
        ${fieldsHTML}
        <button type="submit">${content.submitText || 'Submit'}</button>
      </form>`;
    }

    case 'divider': {
      const content = block.content as any;
      const borderStyle = `${content.thickness || '1px'} ${content.style || 'solid'} #e5e7eb`;
      const borderDirection = content.direction === 'vertical' ? 'border-left' : 'border-top';
      
      return `<hr class="divider-block" style="${borderDirection}: ${borderStyle}; border: none; margin: 20px 0;" />`;
    }

    case 'card': {
      const content = block.content as any;
      const imageHTML = content.image ? `<img src="${content.image}" alt="${content.title}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 16px;" />` : '';
      const buttonHTML = content.buttonText && content.buttonLink 
        ? `<a href="${content.buttonLink}" style="display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">${content.buttonText}</a>`
        : '';
      
      return `<div class="card-block">
        ${imageHTML}
        <h3 style="margin-bottom: 8px;">${content.title || 'Card Title'}</h3>
        <p style="margin-bottom: 16px;">${content.description || 'Card description'}</p>
        ${buttonHTML}
      </div>`;
    }

    case 'list': {
      const content = block.content as any;
      const Tag = content.type === 'ordered' ? 'ol' : 'ul';
      const listStyle = content.bulletStyle && content.bulletStyle !== 'none' ? `list-style-type: ${content.bulletStyle};` : '';
      
      const itemsHTML = content.items?.map((item: string) => `<li>${item}</li>`).join('') || '';
      
      return `<${Tag} class="list-block"${listStyle ? ` style="${listStyle}"` : ''}>
        ${itemsHTML}
      </${Tag}>`;
    }

    default:
      return `<div class="unknown-block">Unknown block type: ${block.type}</div>`;
  }
};

const findBlockById = (parentBlock: Block, blockId: string): Block | null => {
  if (parentBlock.children?.includes(blockId)) {
    // This is a simplified version - in a real implementation,
    // you'd need access to the full blocks array to find the child
    return {
      id: blockId,
      type: 'text',
      content: { text: 'Child block' },
      styles: {},
      order: 0,
    };
  }
  return null;
};

