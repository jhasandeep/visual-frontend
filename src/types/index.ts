// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Block types
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: BlockStyles;
  children?: string[];
  parent?: string;
  order: number;
}

export type BlockType = 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'container' 
  | 'form' 
  | 'divider' 
  | 'card' 
  | 'list';

export interface BlockContent {
  [key: string]: any;
}

export interface BlockStyles {
  [key: string]: any;
}

// Text block specific types
export interface TextBlockContent {
  text: string;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  alignment: 'left' | 'center' | 'right' | 'justify';
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

export interface TextBlockStyles {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  fontFamily?: string;
  lineHeight?: string;
}

// Image block specific types
export interface ImageBlockContent {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ImageBlockStyles {
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  filter?: string;
  opacity?: number;
}

// Button block specific types
export interface ButtonBlockContent {
  text: string;
  link: string;
  target: '_self' | '_blank';
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface ButtonBlockStyles {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
}

// Container block specific types
export interface ContainerBlockContent {
  backgroundColor?: string;
  backgroundImage?: string;
  children: string[];
}

export interface ContainerBlockStyles {
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  minHeight?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
}

// Form block specific types
export interface FormBlockContent {
  action: string;
  method: 'GET' | 'POST';
  fields: FormField[];
  submitText: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio
}

// Divider block specific types
export interface DividerBlockContent {
  direction: 'horizontal' | 'vertical';
  style: 'solid' | 'dashed' | 'dotted';
  thickness: string;
}

export interface DividerBlockStyles {
  color?: string;
  width?: string;
  height?: string;
}

// Card block specific types
export interface CardBlockContent {
  title: string;
  description: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  layout: 'horizontal' | 'vertical';
  items?: string[];
}

// List block specific types
export interface ListBlockContent {
  type: 'ordered' | 'unordered';
  items: string[];
  bulletStyle?: string;
}

// Page types
export interface Page {
  _id: string;
  title: string;
  description?: string;
  slug?: string;
  blocks: Block[];
  owner: User;
  collaborators: Collaborator[];
  isPublished: boolean;
  publishedAt?: string;
  publishedUrl?: string;
  version: number;
  history: PageHistory[];
  settings: PageSettings;
  analytics: PageAnalytics;
  tags: string[];
  category: 'business' | 'portfolio' | 'blog' | 'landing' | 'personal' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Collaborator {
  user: User;
  role: 'viewer' | 'editor' | 'admin';
  addedAt: string;
}

export interface PageHistory {
  version: number;
  blocks: Block[];
  updatedAt: string;
  updatedBy: User;
  changeDescription: string;
}

export interface PageSettings {
  theme: string;
  favicon?: string;
  metaTitle?: string;
  metaDescription?: string;
  customCSS?: string;
  customJS?: string;
}

export interface PageAnalytics {
  views: number;
  lastViewed?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Socket.IO types
export interface SocketUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface SocketBlockUpdate {
  blocks: Block[];
  version: number;
  updatedBy: SocketUser;
  changeType: string;
  blockId?: string;
  timestamp: string;
}

export interface SocketUserPresence {
  userId: string;
  user: SocketUser;
  position?: { x: number; y: number };
  blockId?: string;
  isTyping?: boolean;
}

// Builder types
export interface BuilderState {
  currentPage: Page | null;
  selectedBlock: string | null;
  draggedBlock: BlockType | null;
  history: {
    past: Block[][];
    future: Block[][];
  };
  isLoading: boolean;
  error: string | null;
}

export interface DragItem {
  type: 'block' | 'existing';
  blockType?: BlockType;
  blockId?: string;
}

// UI types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Form types
export interface FormState {
  [key: string]: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

