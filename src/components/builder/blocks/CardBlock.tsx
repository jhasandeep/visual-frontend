import React, { useState } from "react";
import { Block, CardBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import {
  CreditCardIcon,
  PhotoIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface CardBlockProps {
  block: Block;
  isPreview?: boolean;
}

const CardBlock: React.FC<CardBlockProps> = ({ block, isPreview = false }) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const content = block.content as CardBlockContent;

  const handleTitleChange = (newTitle: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        title: newTitle,
      },
    });
  };

  const handleDescriptionChange = (newDescription: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        description: newDescription,
      },
    });
  };

  const handleImageChange = (newImage: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        image: newImage,
      },
    });
  };

  const handleButtonTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        buttonText: newText,
      },
    });
  };

  const handleButtonLinkChange = (newLink: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        buttonLink: newLink,
      },
    });
  };

  const handleLayoutChange = (newLayout: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        layout: newLayout as any,
      },
    });
  };

  const handleAddItem = () => {
    const currentItems = content.items || [];
    updateBlock(block.id, {
      content: {
        ...content,
        items: [...currentItems, `Item ${currentItems.length + 1}`],
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = content.items || [];
    updateBlock(block.id, {
      content: {
        ...content,
        items: currentItems.filter((_, i) => i !== index),
      },
    });
  };

  const handleItemChange = (index: number, newValue: string) => {
    const currentItems = content.items || [];
    const updatedItems = [...currentItems];
    updatedItems[index] = newValue;
    updateBlock(block.id, {
      content: {
        ...content,
        items: updatedItems,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm("Are you sure you want to remove this card block?")) {
      deleteBlock(block.id);
    }
  };

  const renderCard = () => {
    const isVertical = content.layout === "vertical";

    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
          isVertical ? "" : "flex"
        }`}
      >
        {content.image && (
          <div
            className={`${
              isVertical ? "w-full h-48" : "w-1/3 h-32"
            } bg-gray-200 flex items-center justify-center`}
          >
            <img
              src={content.image}
              alt={content.title}
              className={`${
                isVertical
                  ? "w-full h-full object-cover"
                  : "w-full h-full object-cover"
              }`}
            />
          </div>
        )}

        <div className={`${isVertical ? "p-6" : "p-6 flex-1"}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {content.title}
          </h3>
          <p className="text-gray-600 mb-4">{content.description}</p>

          {/* Items List */}
          {content.items && content.items.length > 0 && (
            <div className="mb-4">
              <ul className="list-disc list-inside space-y-1">
                {content.items.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.buttonText && (
            <a
              href={content.buttonLink || "#"}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              {content.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  };

  if (isPreview) {
    return <>{renderCard()}</>;
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block Controls - Above the card */}
      {!isEditing && (
        <div
          className={`transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 mb-2 flex items-center justify-center z-[9999] pointer-events-auto ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <CreditCardIcon className="w-3 h-3" />
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

      {/* Card Content */}
      <div className="min-h-[200px]">{renderCard()}</div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCardIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Card Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Title
              </label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter card title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Layout
              </label>
              <select
                value={content.layout}
                onChange={(e) => handleLayoutChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={content.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter card description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={content.image || ""}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              {content.image && (
                <button
                  onClick={() => handleImageChange("")}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            {content.image && (
              <div className="mt-2">
                <img
                  src={content.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={content.buttonText || ""}
                onChange={(e) => handleButtonTextChange(e.target.value)}
                placeholder="Learn More"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="url"
                value={content.buttonLink || ""}
                onChange={(e) => handleButtonLinkChange(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Items Management */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Items
              </label>

              {/* Add Item Button */}
              <button
                onClick={handleAddItem}
                className="mb-3 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
              >
                <span>+ Add Item</span>
              </button>

              {/* Items List */}
              <div className="space-y-2">
                {(content.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder={`Item ${index + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Preview:
            </div>
            <div className="bg-white p-4 rounded border">{renderCard()}</div>
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

export default CardBlock;
