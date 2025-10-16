import React, { useState } from "react";
import { Block, ListBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import {
  ListBulletIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface ListBlockProps {
  block: Block;
  isPreview?: boolean;
}

const ListBlock: React.FC<ListBlockProps> = ({ block, isPreview = false }) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const content = block.content as ListBlockContent;

  const handleTypeChange = (newType: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        type: newType as any,
      },
    });
  };

  const handleItemChange = (index: number, newItem: string) => {
    const newItems = [...content.items];
    newItems[index] = newItem;
    updateBlock(block.id, {
      content: {
        ...content,
        items: newItems,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm('Are you sure you want to remove this list block?')) {
      deleteBlock(block.id);
    }
  };

  const handleAddItem = () => {
    updateBlock(block.id, {
      content: {
        ...content,
        items: [...content.items, "New item"],
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = content.items.filter((_, i) => i !== index);
    updateBlock(block.id, {
      content: {
        ...content,
        items: newItems,
      },
    });
  };

  const handleBulletStyleChange = (newStyle: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        bulletStyle: newStyle,
      },
    });
  };

  const renderList = () => {
    if (content.type === "ordered") {
      return (
        <ol className="list-decimal list-inside space-y-1">
          {content.items.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ol>
      );
    } else {
      return (
        <ul
          className={`space-y-1 ${
            content.bulletStyle === "none" ? "list-none" : "list-inside"
          }`}
          style={{
            listStyleType:
              content.bulletStyle === "none" ? "none" : content.bulletStyle,
          }}
        >
          {content.items.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );
    }
  };

  if (isPreview) {
    return <>{renderList()}</>;
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
            <ListBulletIcon className="w-3 h-3" />
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

      {/* List Content */}
      <div className="min-h-[2rem] p-4 border border-gray-200 rounded-lg bg-white">
        {content.items.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <ListBulletIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Empty list</p>
            <p className="text-xs">Add items to build your list</p>
          </div>
        ) : (
          renderList()
        )}
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <ListBulletIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">List Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                List Type
              </label>
              <select
                value={content.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="unordered">Unordered (Bullets)</option>
                <option value="ordered">Ordered (Numbers)</option>
              </select>
            </div>

            {content.type === "unordered" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bullet Style
                </label>
                <select
                  value={content.bulletStyle || "disc"}
                  onChange={(e) => handleBulletStyleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="disc">Disc</option>
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}
          </div>

          {/* List Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">List Items</h4>
              <button
                onClick={handleAddItem}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
              >
                <PlusIcon className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {content.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder="Enter list item"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {content.items.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No items yet</p>
                <button
                  onClick={handleAddItem}
                  className="text-primary-600 hover:text-primary-500 text-sm"
                >
                  Add your first item
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Preview:
            </div>
            <div className="bg-white p-4 rounded border">{renderList()}</div>
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

export default ListBlock;
