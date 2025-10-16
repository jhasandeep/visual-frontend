import React, { useState } from "react";
import { Block, ButtonBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import {
  CursorArrowRaysIcon,
  LinkIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface ButtonBlockProps {
  block: Block;
  isPreview?: boolean;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({
  block,
  isPreview = false,
}) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const content = block.content as ButtonBlockContent;

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        text: newText,
      },
    });
  };

  const handleLinkChange = (newLink: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        link: newLink,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm('Are you sure you want to remove this button block?')) {
      deleteBlock(block.id);
    }
  };

  const handleTargetChange = (newTarget: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        target: newTarget as any,
      },
    });
  };

  const handleVariantChange = (newVariant: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        variant: newVariant as any,
      },
    });
  };

  const getVariantStyles = () => {
    switch (content.variant) {
      case "primary":
        return "bg-primary-600 text-white hover:bg-primary-700 border-primary-600";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700 border-gray-600";
      case "outline":
        return "bg-transparent text-primary-600 hover:bg-primary-50 border-primary-600";
      case "ghost":
        return "bg-transparent text-gray-600 hover:bg-gray-100 border-transparent";
      default:
        return "bg-primary-600 text-white hover:bg-primary-700 border-primary-600";
    }
  };

  const renderButton = () => {
    if (isPreview) {
      return (
        <a
          href={content.link}
          target={content.target}
          rel={content.target === "_blank" ? "noopener noreferrer" : undefined}
          className={`inline-flex items-center px-4 py-2 border rounded-md font-medium transition-colors ${getVariantStyles()}`}
        >
          {content.text}
        </a>
      );
    }

    return (
      <button
        onClick={() => setIsEditing(true)}
        className={`inline-flex items-center px-4 py-2 border rounded-md font-medium transition-colors cursor-pointer ${getVariantStyles()}`}
      >
        {content.text || "Click to edit button"}
      </button>
    );
  };

  if (isPreview) {
    return <>{renderButton()}</>;
  }

  return (
    <div className="relative group">
      {/* Block Controls */}
      {!isEditing && (
        <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <CursorArrowRaysIcon className="w-3 h-3" />
            <span>EDIT</span>
          </button>
          <button
            onClick={handleRemoveBlock}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
          >
            <TrashIcon className="w-3 h-3" />
            <span>REMOVE</span>
          </button>
        </div>
      )}

      {/* Button Content */}
      <div className="min-h-[2.5rem] flex items-center">{renderButton()}</div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <CursorArrowRaysIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Button Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={content.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={content.link}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm"
                />
                <LinkIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style Variant
              </label>
              <select
                value={content.variant}
                onChange={(e) => handleVariantChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Target
              </label>
              <select
                value={content.target}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <EyeIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Preview:
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={content.link}
                target={content.target}
                rel={
                  content.target === "_blank"
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`inline-flex items-center px-4 py-2 border rounded-md font-medium transition-colors ${getVariantStyles()}`}
              >
                {content.text || "Button Text"}
              </a>
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

export default ButtonBlock;
