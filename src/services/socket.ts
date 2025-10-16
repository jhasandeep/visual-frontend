import { io, Socket } from 'socket.io-client';
import { SocketBlockUpdate, SocketUserPresence } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private pageId: string | null = null;
  private token: string | null = null;

  // Event handlers
  private onBlockUpdateHandler: ((data: SocketBlockUpdate) => void) | null = null;
  private onUserJoinedHandler: ((data: SocketUserPresence) => void) | null = null;
  private onUserLeftHandler: ((data: SocketUserPresence) => void) | null = null;
  private onActiveUsersHandler: ((users: any[]) => void) | null = null;
  private onUserCursorHandler: ((data: SocketUserPresence) => void) | null = null;
  private onBlockSelectedHandler: ((data: SocketUserPresence) => void) | null = null;
  private onUserTypingHandler: ((data: SocketUserPresence) => void) | null = null;
  private onPageSettingsUpdatedHandler: ((data: any) => void) | null = null;
  private onPageTitleUpdatedHandler: ((data: any) => void) | null = null;
  private onHistoryNavigatedHandler: ((data: any) => void) | null = null;
  private onErrorHandler: ((error: { message: string }) => void) | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.token = token;

    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.pageId = null;
  }

  joinPage(pageId: string): void {
    if (this.socket && pageId !== this.pageId) {
      this.socket.emit('join-page', pageId);
      this.pageId = pageId;
    }
  }

  leavePage(): void {
    if (this.socket && this.pageId) {
      this.socket.emit('leave-page');
      this.pageId = null;
    }
  }

  // Block operations
  updateBlocks(data: {
    pageId: string;
    blocks: any[];
    changeType: string;
    blockId?: string;
  }): void {
    if (this.socket && this.pageId === data.pageId) {
      this.socket.emit('update-blocks', data);
    }
  }

  // Cursor and selection
  updateCursor(position: { x: number; y: number }, blockId?: string): void {
    if (this.socket && this.pageId) {
      this.socket.emit('cursor-move', { position, blockId });
    }
  }

  selectBlock(blockId: string): void {
    if (this.socket && this.pageId) {
      this.socket.emit('block-select', { blockId });
    }
  }

  // Typing indicators
  startTyping(blockId: string): void {
    if (this.socket && this.pageId) {
      this.socket.emit('typing-start', { blockId });
    }
  }

  stopTyping(blockId: string): void {
    if (this.socket && this.pageId) {
      this.socket.emit('typing-stop', { blockId });
    }
  }

  // Page settings
  updatePageSettings(pageId: string, settings: any): void {
    if (this.socket && this.pageId === pageId) {
      this.socket.emit('update-page-settings', { pageId, settings });
    }
  }

  updatePageTitle(pageId: string, title: string): void {
    if (this.socket && this.pageId === pageId) {
      this.socket.emit('update-page-title', { pageId, title });
    }
  }

  // History operations
  performUndoRedo(pageId: string, action: 'undo' | 'redo', version?: number): void {
    if (this.socket && this.pageId === pageId) {
      this.socket.emit('undo-redo', { pageId, action, version });
    }
  }

  // Event handler setters
  setOnBlockUpdate(handler: (data: SocketBlockUpdate) => void): void {
    this.onBlockUpdateHandler = handler;
  }

  setOnUserJoined(handler: (data: SocketUserPresence) => void): void {
    this.onUserJoinedHandler = handler;
  }

  setOnUserLeft(handler: (data: SocketUserPresence) => void): void {
    this.onUserLeftHandler = handler;
  }

  setOnActiveUsers(handler: (users: any[]) => void): void {
    this.onActiveUsersHandler = handler;
  }

  setOnUserCursor(handler: (data: SocketUserPresence) => void): void {
    this.onUserCursorHandler = handler;
  }

  setOnBlockSelected(handler: (data: SocketUserPresence) => void): void {
    this.onBlockSelectedHandler = handler;
  }

  setOnUserTyping(handler: (data: SocketUserPresence) => void): void {
    this.onUserTypingHandler = handler;
  }

  setOnPageSettingsUpdated(handler: (data: any) => void): void {
    this.onPageSettingsUpdatedHandler = handler;
  }

  setOnPageTitleUpdated(handler: (data: any) => void): void {
    this.onPageTitleUpdatedHandler = handler;
  }

  setOnHistoryNavigated(handler: (data: any) => void): void {
    this.onHistoryNavigatedHandler = handler;
  }

  setOnError(handler: (error: { message: string }) => void): void {
    this.onErrorHandler = handler;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (this.onErrorHandler) {
        this.onErrorHandler({ message: 'Connection failed' });
      }
    });

    // Block events
    this.socket.on('blocks-updated', (data: SocketBlockUpdate) => {
      if (this.onBlockUpdateHandler) {
        this.onBlockUpdateHandler(data);
      }
    });

    // User presence events
    this.socket.on('user-joined', (data: SocketUserPresence) => {
      if (this.onUserJoinedHandler) {
        this.onUserJoinedHandler(data);
      }
    });

    this.socket.on('user-left', (data: SocketUserPresence) => {
      if (this.onUserLeftHandler) {
        this.onUserLeftHandler(data);
      }
    });

    this.socket.on('active-users', (users: any[]) => {
      if (this.onActiveUsersHandler) {
        this.onActiveUsersHandler(users);
      }
    });

    // Cursor and selection events
    this.socket.on('user-cursor', (data: SocketUserPresence) => {
      if (this.onUserCursorHandler) {
        this.onUserCursorHandler(data);
      }
    });

    this.socket.on('block-selected', (data: SocketUserPresence) => {
      if (this.onBlockSelectedHandler) {
        this.onBlockSelectedHandler(data);
      }
    });

    // Typing events
    this.socket.on('user-typing', (data: SocketUserPresence) => {
      if (this.onUserTypingHandler) {
        this.onUserTypingHandler(data);
      }
    });

    // Page events
    this.socket.on('page-settings-updated', (data: any) => {
      if (this.onPageSettingsUpdatedHandler) {
        this.onPageSettingsUpdatedHandler(data);
      }
    });

    this.socket.on('page-title-updated', (data: any) => {
      if (this.onPageTitleUpdatedHandler) {
        this.onPageTitleUpdatedHandler(data);
      }
    });

    // History events
    this.socket.on('history-navigated', (data: any) => {
      if (this.onHistoryNavigatedHandler) {
        this.onHistoryNavigatedHandler(data);
      }
    });

    // Error events
    this.socket.on('error', (error: { message: string }) => {
      if (this.onErrorHandler) {
        this.onErrorHandler(error);
      }
    });
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentPageId(): string | null {
    return this.pageId;
  }

  // Remove all event listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
