import React, { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "../../contexts/BuilderContext";
import { useSocket } from "../../hooks/useSocket";
import BlockRenderer from "./BlockRenderer";
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Canvas: React.FC = () => {
  const { currentPage, selectedBlock, selectBlock } = useBuilder();
  const { activeUsers } = useSocket();

  // Zoom and scroll state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
    data: {
      type: "canvas",
    },
  });

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    setScrollPosition({ x: 0, y: 0 });
  };

  // Scroll functions
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition({
      x: target.scrollLeft,
      y: target.scrollTop,
    });
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "+":
          case "=":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "0":
            e.preventDefault();
            handleResetZoom();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500">No page loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Canvas</h2>
          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Zoom Out (Ctrl + -)"
              >
                <MagnifyingGlassMinusIcon className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Zoom In (Ctrl + +)"
              >
                <MagnifyingGlassPlusIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Reset Zoom (Ctrl + 0)"
              >
                <ArrowPathIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Scroll Position Indicator */}
              {(scrollPosition.x > 0 || scrollPosition.y > 0) && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Scroll: {Math.round(scrollPosition.x)},{" "}
                  {Math.round(scrollPosition.y)}
                </div>
              )}

              {/* Active users */}
              {activeUsers && activeUsers.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Active:</span>
                  <div className="flex -space-x-1">
                    {activeUsers
                      .filter((user) => user && user.user) // Filter out invalid users
                      .slice(0, 3)
                      .map((user, index) => (
                        <div
                          key={user.userId || index}
                          className="w-6 h-6 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center"
                          title={user.user?.name || "Unknown User"}
                        >
                          <span className="text-xs text-white font-medium">
                            {(user.user?.name || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ))}
                    {activeUsers.filter((user) => user && user.user).length >
                      3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          +
                          {activeUsers.filter((user) => user && user.user)
                            .length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-visible canvas-scroll ${
          isOver ? "bg-primary-50" : "bg-gray-50"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f7fafc",
        }}
      >
        <div
          ref={contentRef}
          className="pt-16 pb-8 px-4 mx-auto transition-transform duration-200 ease-in-out"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            minHeight: "100%",
            width: "100%",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {currentPage.blocks.length === 0 ? (
              <div className={`droppable-area ${isOver ? "drag-over" : ""}`}>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start building your page
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag blocks from the sidebar to create your page
                  </p>
                  {isOver && (
                    <p className="text-primary-600 font-medium">
                      Drop the block here to add it to your page
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentPage.blocks
                  .filter((block) => !block.parent) // Only show root blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div
                      key={block.id}
                      className={`relative ${
                        selectedBlock === block.id
                          ? "ring-2 ring-primary-500"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectBlock(block.id);
                      }}
                    >
                      <BlockRenderer block={block} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
