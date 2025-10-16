import React from "react";
import { useBuilder } from "../../contexts/BuilderContext";
import BlockRenderer from "./BlockRenderer";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface PreviewPanelProps {
  onClose?: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ onClose }) => {
  const { currentPage } = useBuilder();

  if (!currentPage) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <EyeIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Preview</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Mock browser header */}
          <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2 border-b border-gray-200">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
              {currentPage.title}
            </div>
          </div>

          {/* Page content */}
          <div className="p-6 min-h-[400px]">
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {currentPage.title}
              </h1>

              {currentPage.description && (
                <p className="text-gray-600 mb-6">{currentPage.description}</p>
              )}

              {currentPage.blocks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <EyeIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No content to preview</p>
                  <p className="text-xs">Add blocks to see your page</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPage.blocks
                    .filter((block) => !block.parent)
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <BlockRenderer
                        key={block.id}
                        block={block}
                        isPreview={true}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Page Info</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Blocks:</span>
              <span>{currentPage.blocks.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={
                  currentPage.isPublished ? "text-green-600" : "text-yellow-600"
                }
              >
                {currentPage.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            {currentPage.isPublished && (
              <div className="flex justify-between">
                <span>Views:</span>
                <span>{currentPage.analytics.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;

