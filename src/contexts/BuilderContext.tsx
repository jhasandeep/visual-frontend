import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Page, Block, BlockType, BuilderState } from "../types";
import {
  generateBlockId,
  getDefaultBlockContent,
  getDefaultBlockStyles,
} from "../utils/blockUtils";

type BuilderAction =
  | { type: "SET_PAGE"; payload: Page }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SELECT_BLOCK"; payload: string | null }
  | { type: "SET_DRAGGED_BLOCK"; payload: BlockType | null }
  | {
      type: "ADD_BLOCK";
      payload: { block: Block; parentId?: string; index?: number };
    }
  | {
      type: "UPDATE_BLOCK";
      payload: { blockId: string; updates: Partial<Block> };
    }
  | { type: "DELETE_BLOCK"; payload: string }
  | {
      type: "MOVE_BLOCK";
      payload: { blockId: string; newParentId?: string; newIndex: number };
    }
  | { type: "UPDATE_BLOCKS"; payload: Block[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE_TO_HISTORY"; payload: Block[] };

const initialState: BuilderState = {
  currentPage: null,
  selectedBlock: null,
  draggedBlock: null,
  history: {
    past: [],
    future: [],
  },
  isLoading: false,
  error: null,
};

const builderReducer = (
  state: BuilderState,
  action: BuilderAction
): BuilderState => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        currentPage: action.payload,
        history: {
          past: [action.payload.blocks],
          future: [],
        },
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "SELECT_BLOCK":
      return {
        ...state,
        selectedBlock: action.payload,
      };
    case "SET_DRAGGED_BLOCK":
      return {
        ...state,
        draggedBlock: action.payload,
      };
    case "ADD_BLOCK": {
      if (!state.currentPage) return state;

      const { block, parentId, index } = action.payload;
      const newBlocks = [...state.currentPage.blocks];

      if (parentId) {
        // Add to specific parent
        const parentIndex = newBlocks.findIndex((b) => b.id === parentId);
        if (parentIndex !== -1) {
          const parent = newBlocks[parentIndex];
          const updatedParent = {
            ...parent,
            children: [...(parent.children || []), block.id],
          };
          newBlocks[parentIndex] = updatedParent;
        }
      }

      // Insert block at specified index or at the end
      const insertIndex = index !== undefined ? index : newBlocks.length;
      newBlocks.splice(insertIndex, 0, block);

      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          blocks: newBlocks,
        },
      };
    }
    case "UPDATE_BLOCK": {
      if (!state.currentPage) return state;

      const { blockId, updates } = action.payload;
      const newBlocks = state.currentPage.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );

      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          blocks: newBlocks,
        },
      };
    }
    case "DELETE_BLOCK": {
      if (!state.currentPage) return state;

      const blockIdToDelete = action.payload;

      // Remove from parent's children if it has a parent
      const newBlocks = state.currentPage.blocks.filter((block) => {
        if (block.id === blockIdToDelete) {
          // Remove from parent's children array
          if (block.parent && state.currentPage) {
            const parentIndex = state.currentPage.blocks.findIndex(
              (b) => b.id === block.parent
            );
            if (parentIndex !== -1) {
              const parent = state.currentPage.blocks[parentIndex];
              const updatedParent = {
                ...parent,
                children: (parent.children || []).filter(
                  (childId) => childId !== blockIdToDelete
                ),
              };
              state.currentPage.blocks[parentIndex] = updatedParent;
            }
          }
          return false; // Remove the block
        }
        return true;
      });

      // Also remove any child blocks
      const filteredBlocks = newBlocks.filter(
        (block) => block.parent !== blockIdToDelete
      );

      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          blocks: filteredBlocks,
        },
        selectedBlock:
          state.selectedBlock === blockIdToDelete ? null : state.selectedBlock,
      };
    }
    case "MOVE_BLOCK": {
      if (!state.currentPage) return state;

      const { blockId, newParentId, newIndex } = action.payload;
      const newBlocks = [...state.currentPage.blocks];

      // Remove block from current position
      const blockIndex = newBlocks.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return state;

      const [movedBlock] = newBlocks.splice(blockIndex, 1);

      // Update block's parent
      const updatedBlock = {
        ...movedBlock,
        parent: newParentId,
      };

      // Insert at new position
      newBlocks.splice(newIndex, 0, updatedBlock);

      // Update parent's children array
      if (newParentId) {
        const parentIndex = newBlocks.findIndex((b) => b.id === newParentId);
        if (parentIndex !== -1) {
          const parent = newBlocks[parentIndex];
          const updatedParent = {
            ...parent,
            children: [...(parent.children || []), blockId],
          };
          newBlocks[parentIndex] = updatedParent;
        }
      }

      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          blocks: newBlocks,
        },
      };
    }
    case "UPDATE_BLOCKS": {
      if (!state.currentPage) return state;

      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          blocks: action.payload,
        },
      };
    }
    case "SAVE_TO_HISTORY": {
      return {
        ...state,
        history: {
          past: [...state.history.past, action.payload],
          future: [],
        },
      };
    }
    case "UNDO": {
      if (state.history.past.length <= 1) return state;

      const previous = state.history.past[state.history.past.length - 2];
      const current = state.history.past[state.history.past.length - 1];

      return {
        ...state,
        currentPage: state.currentPage
          ? {
              ...state.currentPage,
              blocks: previous,
            }
          : null,
        history: {
          past: state.history.past.slice(0, -1),
          future: [current, ...state.history.future],
        },
      };
    }
    case "REDO": {
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];

      return {
        ...state,
        currentPage: state.currentPage
          ? {
              ...state.currentPage,
              blocks: next,
            }
          : null,
        history: {
          past: [...state.history.past, next],
          future: state.history.future.slice(1),
        },
      };
    }
    default:
      return state;
  }
};

interface BuilderContextType extends BuilderState {
  // Page actions
  setPage: (page: Page) => void;
  updatePage: (updates: Partial<Page>) => void;

  // Block actions
  selectBlock: (blockId: string | null) => void;
  setDraggedBlock: (blockType: BlockType | null) => void;
  addBlock: (blockType: BlockType, parentId?: string, index?: number) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (blockId: string, newIndex: number, newParentId?: string) => void;
  updateBlocks: (blocks: Block[]) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getBlock: (blockId: string) => Block | null;
  getBlockChildren: (blockId: string) => Block[];
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};

interface BuilderProviderProps {
  children: ReactNode;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const setPage = (page: Page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  const updatePage = (updates: Partial<Page>) => {
    if (!state.currentPage) return;

    dispatch({
      type: "SET_PAGE",
      payload: { ...state.currentPage, ...updates },
    });
  };

  const selectBlock = (blockId: string | null) => {
    dispatch({ type: "SELECT_BLOCK", payload: blockId });
  };

  const setDraggedBlock = (blockType: BlockType | null) => {
    dispatch({ type: "SET_DRAGGED_BLOCK", payload: blockType });
  };

  const addBlock = (
    blockType: BlockType,
    parentId?: string,
    index?: number
  ) => {
    const block: Block = {
      id: generateBlockId(),
      type: blockType,
      content: getDefaultBlockContent(blockType),
      styles: getDefaultBlockStyles(blockType),
      parent: parentId,
      order: index || 0,
    };

    dispatch({ type: "ADD_BLOCK", payload: { block, parentId, index } });
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    dispatch({ type: "UPDATE_BLOCK", payload: { blockId, updates } });
  };

  const deleteBlock = (blockId: string) => {
    dispatch({ type: "DELETE_BLOCK", payload: blockId });
  };

  const moveBlock = (
    blockId: string,
    newIndex: number,
    newParentId?: string
  ) => {
    dispatch({
      type: "MOVE_BLOCK",
      payload: { blockId, newParentId, newIndex },
    });
  };

  const updateBlocks = (blocks: Block[]) => {
    dispatch({ type: "UPDATE_BLOCKS", payload: blocks });
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };

  const canUndo = () => state.history.past.length > 1;
  const canRedo = () => state.history.future.length > 0;

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const getBlock = (blockId: string): Block | null => {
    if (!state.currentPage) return null;
    return (
      state.currentPage.blocks.find((block) => block.id === blockId) || null
    );
  };

  const getBlockChildren = (blockId: string): Block[] => {
    if (!state.currentPage) return [];
    return state.currentPage.blocks.filter((block) => block.parent === blockId);
  };

  const value: BuilderContextType = {
    ...state,
    setPage,
    updatePage,
    selectBlock,
    setDraggedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    updateBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    setLoading,
    setError,
    getBlock,
    getBlockChildren,
  };

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};

// Helper functions are now imported from blockUtils
