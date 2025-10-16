import React, { useState } from "react";
import { Block, DividerBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import { MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface DividerBlockProps {
  block: Block;
  isPreview?: boolean;
}

const DividerBlock: React.FC<DividerBlockProps> = ({
  block,
  isPreview = false,
}) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const content = block.content as DividerBlockContent;

  const handleDirectionChange = (newDirection: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        direction: newDirection as any,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm("Are you sure you want to remove this divider block?")) {
      deleteBlock(block.id);
    }
  };

  const handleStyleChange = (newStyle: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        style: newStyle as any,
      },
    });
  };

  const handleThicknessChange = (newThickness: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        thickness: newThickness,
      },
    });
  };

  const getBorderStyle = () => {
    const borderStyle = `${content.thickness} ${content.style} #e5e7eb`;

    if (content.direction === "horizontal") {
      return {
        borderBottom: borderStyle,
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        width: "100%",
        height: "0",
      };
    } else {
      return {
        borderLeft: borderStyle,
        borderTop: "none",
        borderBottom: "none",
        borderRight: "none",
        height: "100px",
        width: "0",
      };
    }
  };

  const renderDivider = () => {
    const style = getBorderStyle();

    return (
      <div
        style={style}
        className={content.direction === "horizontal" ? "w-full" : "h-20"}
      />
    );
  };

  if (isPreview) {
    return <>{renderDivider()}</>;
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
            <MinusIcon className="w-3 h-3" />
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

      {/* Divider Content */}
      <div className="min-h-[2rem] flex items-center justify-center">
        {renderDivider()}
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MinusIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Divider Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direction
              </label>
              <select
                value={content.direction}
                onChange={(e) => handleDirectionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={content.style}
                onChange={(e) => handleStyleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thickness
              </label>
              <input
                type="text"
                value={content.thickness}
                onChange={(e) => handleThicknessChange(e.target.value)}
                placeholder="1px"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Preview:
            </div>
            <div className="bg-white p-4 rounded border">{renderDivider()}</div>
          </div>

          {/* Quick Styles */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Quick Styles
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleDirectionChange("horizontal");
                  handleStyleChange("solid");
                  handleThicknessChange("1px");
                }}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                Thin Solid
              </button>
              <button
                onClick={() => {
                  handleDirectionChange("horizontal");
                  handleStyleChange("solid");
                  handleThicknessChange("2px");
                }}
                className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
              >
                Thick Solid
              </button>
              <button
                onClick={() => {
                  handleDirectionChange("horizontal");
                  handleStyleChange("dashed");
                  handleThicknessChange("1px");
                }}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200"
              >
                Dashed
              </button>
              <button
                onClick={() => {
                  handleDirectionChange("horizontal");
                  handleStyleChange("dotted");
                  handleThicknessChange("1px");
                }}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200"
              >
                Dotted
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

export default DividerBlock;
