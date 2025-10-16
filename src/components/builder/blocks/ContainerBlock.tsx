import React, { useState } from "react";
import { Block, ContainerBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import { getBlockChildren } from "../../../utils/blockUtils";
import BlockRenderer from "../BlockRenderer";
import {
  RectangleStackIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface ContainerBlockProps {
  block: Block;
  isPreview?: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = ({
  block,
  isPreview = false,
}) => {
  const { updateBlock, addBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const content = block.content as ContainerBlockContent;
  const children = getBlockChildren([block], block.id);

  const handleBackgroundChange = (newBackground: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        backgroundColor: newBackground,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm('Are you sure you want to remove this container block?')) {
      deleteBlock(block.id);
    }
  };

  const handleBackgroundImageChange = (newBackgroundImage: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        backgroundImage: newBackgroundImage,
      },
    });
  };

  const handleAddBlock = (blockType: string) => {
    addBlock(blockType as any, block.id);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor:
      content.backgroundColor === "transparent"
        ? "transparent"
        : content.backgroundColor,
    backgroundImage: content.backgroundImage
      ? `url(${content.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100px",
  };

  if (isPreview) {
    return (
      <div style={containerStyle} className="rounded-lg border border-gray-200">
        {children.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Empty container</div>
        ) : (
          <div className="p-4 space-y-4">
            {children
              .sort((a, b) => a.order - b.order)
              .map((childBlock) => (
                <BlockRenderer
                  key={childBlock.id}
                  block={childBlock}
                  isPreview={isPreview}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Block Controls */}
      {!isEditing && (
        <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 flex items-center space-x-1"
          >
            <RectangleStackIcon className="w-3 h-3" />
            <span>Edit Container</span>
          </button>

          <div className="relative">
            <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center space-x-1">
              <PlusIcon className="w-3 h-3" />
              <span>Add Block</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 opacity-0 hover:opacity-100">
              <button
                onClick={() => handleAddBlock("text")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Text Block
              </button>
              <button
                onClick={() => handleAddBlock("image")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Image Block
              </button>
              <button
                onClick={() => handleAddBlock("button")}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Button Block
              </button>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemoveBlock}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
          >
            <TrashIcon className="w-3 h-3" />
            <span>REMOVE</span>
          </button>
        </div>
      )}

      {/* Container Content */}
      <div
        style={containerStyle}
        className="rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
      >
        {children.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <RectangleStackIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Empty container</p>
            <p className="text-xs">Add blocks to this container</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {children
              .sort((a, b) => a.order - b.order)
              .map((childBlock) => (
                <BlockRenderer
                  key={childBlock.id}
                  block={childBlock}
                  isPreview={isPreview}
                />
              ))}
          </div>
        )}
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <RectangleStackIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Container Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={content.backgroundColor || "#ffffff"}
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={content.backgroundColor || ""}
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  placeholder="#ffffff or transparent"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image URL
              </label>
              <input
                type="url"
                value={content.backgroundImage || ""}
                onChange={(e) => handleBackgroundImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBackgroundChange("#f3f4f6")}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                Light Gray
              </button>
              <button
                onClick={() => handleBackgroundChange("#e5e7eb")}
                className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
              >
                Medium Gray
              </button>
              <button
                onClick={() => handleBackgroundChange("#3b82f6")}
                className="text-xs bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Blue
              </button>
              <button
                onClick={() => handleBackgroundChange("transparent")}
                className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded hover:bg-gray-50"
              >
                Transparent
              </button>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-primary flex-1"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerBlock;
