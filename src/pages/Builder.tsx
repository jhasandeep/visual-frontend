import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useBuilder } from "../contexts/BuilderContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import socketService from "../services/socket";
import { BlockType } from "../types";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import Canvas from "../components/builder/Canvas";
import PreviewPanel from "../components/builder/PreviewPanel";
import SettingsPanel from "../components/builder/SettingsPanel";
import CollaborationPanel from "../components/builder/CollaborationPanel";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Builder: React.FC = () => {
  const { pageId } = useParams<{ pageId?: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const {
    currentPage,
    selectedBlock,
    draggedBlock,
    isLoading,
    error,
    setPage,
    setDraggedBlock,
    addBlock,
    updateBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    setLoading,
    setError,
  } = useBuilder();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  useEffect(() => {
    if (pageId && pageId !== "new") {
      loadPage(pageId);
    } else {
      // Create new page
      createNewPage();
    }
  }, [pageId]);

  useEffect(() => {
    if (token && currentPage) {
      // Connect to socket and join page room
      socketService.connect(token);
      socketService.joinPage(currentPage._id);

      // Set up socket event handlers
      setupSocketHandlers();
    }

    return () => {
      socketService.leavePage();
      socketService.disconnect();
    };
  }, [token, currentPage]);

  const setupSocketHandlers = () => {
    // Handle real-time block updates
    socketService.setOnBlockUpdate((data) => {
      if (data.updatedBy._id !== user?._id) {
        updateBlocks(data.blocks);
        addToast({
          type: "info",
          title: "Page updated",
          message: `${data.updatedBy.name} made changes`,
        });
      }
    });

    // Handle errors
    socketService.setOnError((error) => {
      addToast({
        type: "error",
        title: "Connection error",
        message: error.message,
      });
    });
  };

  const loadPage = async (id: string) => {
    try {
      setLoading(true);
      const response = await pagesAPI.getPage(id);

      if (response.success && response.data) {
        setPage(response.data.page);
      } else {
        throw new Error("Page not found");
      }
    } catch (error: any) {
      setError(error.message);
      addToast({
        type: "error",
        title: "Failed to load page",
        message: error.message,
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const createNewPage = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.createPage({
        title: "Untitled Page",
        description: "",
      });

      if (response.success && response.data) {
        setPage(response.data.page);
        navigate(`/builder/${response.data.page._id}`, { replace: true });
      }
    } catch (error: any) {
      setError(error.message);
      addToast({
        type: "error",
        title: "Failed to create page",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentPage) return;

    try {
      setIsSaving(true);
      const response = await pagesAPI.updateBlocks(
        currentPage._id,
        currentPage.blocks
      );

      if (response.success) {
        setHasUnsavedChanges(false);
        addToast({
          type: "success",
          title: "Page saved",
          message: "Your changes have been saved",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to save page",
        message: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentPage) return;

    try {
      setIsSaving(true);
      const response = await pagesAPI.publishPage(currentPage._id);

      if (response.success) {
        addToast({
          type: "success",
          title: "Page published",
          message: "Your page is now live!",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to publish page",
        message: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTempTitle(currentPage?.title || "");
  };

  const handleTitleSave = async () => {
    if (!currentPage || !tempTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await pagesAPI.updatePage(currentPage._id, {
        ...currentPage,
        title: tempTitle.trim(),
      });

      addToast({
        type: "success",
        title: "Title updated",
        message: "Page title has been updated",
      });

      setIsEditingTitle(false);
      setHasUnsavedChanges(false);
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Error",
        message: error.response?.data?.message || "Failed to update title",
      });
    }
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    if (event.active.data.current?.type === "block") {
      setDraggedBlock(event.active.data.current.blockType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedBlock(null);

    if (!over) return;

    if (
      active.data.current?.type === "block" &&
      over.data.current?.type === "canvas"
    ) {
      // Add new block to canvas
      const blockType = active.data.current.blockType as BlockType;
      addBlock(blockType);
      setHasUnsavedChanges(true);
    }
  };

  const handleUndo = () => {
    undo();
    setHasUnsavedChanges(true);
  };

  const handleRedo = () => {
    redo();
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Builder Sidebar */}
        <BuilderSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Page title */}
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {currentPage.title}
              </h1>
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600">
                  • Unsaved changes
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <button
                onClick={handleUndo}
                disabled={!canUndo()}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <ArrowUturnLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo()}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <ArrowUturnRightIcon className="w-5 h-5" />
              </button>

              {/* Toggle panels */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-md ${
                  showPreview
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Toggle Preview"
              >
                <EyeIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-md ${
                  showSettings
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Toggle Settings"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowCollaboration(!showCollaboration)}
                className={`p-2 rounded-md ${
                  showCollaboration
                    ? "bg-primary-100 text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Toggle Collaboration"
              >
                <ShareIcon className="w-5 h-5" />
              </button>

              {/* Save and Publish */}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="btn-secondary flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
              >
                <ShareIcon className="w-4 h-4" />
                <span>{currentPage.isPublished ? "Update" : "Publish"}</span>
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex">
            <Canvas />

            {/* Right Panels */}
            <div className="flex">
              {showPreview && <PreviewPanel />}
              {showSettings && <SettingsPanel />}
              {showCollaboration && <CollaborationPanel />}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId && draggedBlock ? (
            <div className="block-item">{draggedBlock}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Builder;
