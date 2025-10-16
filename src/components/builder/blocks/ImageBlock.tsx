import React, { useState, useRef } from "react";
import { Block, ImageBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import { uploadAPI } from "../../../services/api";
import { PhotoIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ImageBlockProps {
  block: Block;
  isPreview?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isPreview = false,
}) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const content = block.content as ImageBlockContent;

  const handleImageChange = (newSrc: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        src: newSrc,
      },
    });
  };

  const handleAltChange = (newAlt: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        alt: newAlt,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm('Are you sure you want to remove this image block?')) {
      deleteBlock(block.id);
    }
  };

  const handleAlignmentChange = (newAlignment: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        alignment: newAlignment as any,
      },
    });
  };

  const handleSizeChange = (width: string, height: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        width,
        height,
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadAPI.uploadImage(file);
      if (response.success && response.data) {
        // Use the base64 data URL as the image source
        handleImageChange(response.data.url);
        console.log("Image uploaded successfully:", {
          originalName: response.data.originalName,
          size: response.data.size,
          mimeType: response.data.mimeType,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const getAlignmentClass = () => {
    switch (content.alignment) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  if (isPreview) {
    if (!content.src) {
      return (
        <div className="flex items-center justify-center h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
          <span className="text-gray-500">No image</span>
        </div>
      );
    }

    return (
      <div className={getAlignmentClass()}>
        <img
          src={content.src}
          alt={content.alt}
          style={{
            width: content.width || "100%",
            height: content.height || "auto",
            maxWidth: "100%",
          }}
          className="rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Block Controls */}
      {!isEditing && (
        <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => handleAlignmentChange("left")}
              className={`p-1 ${
                content.alignment === "left"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Align Left"
            >
              L
            </button>
            <button
              onClick={() => handleAlignmentChange("center")}
              className={`p-1 ${
                content.alignment === "center"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Align Center"
            >
              C
            </button>
            <button
              onClick={() => handleAlignmentChange("right")}
              className={`p-1 ${
                content.alignment === "right"
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Align Right"
            >
              R
            </button>
          </div>

          {/* Edit and Remove buttons */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
            >
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
        </div>
      )}

      {/* Image Content */}
      <div className={`${getAlignmentClass()}`}>
        {content.src ? (
          <div className="relative inline-block">
            <img
              src={content.src}
              alt={content.alt}
              style={{
                width: content.width || "100%",
                height: content.height || "auto",
                maxWidth: "100%",
              }}
              className="rounded-lg"
              onClick={() => setIsEditing(true)}
            />

            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  className="bg-white text-gray-900 px-3 py-1 rounded text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Click to upload image</p>
            <p className="text-xs text-gray-500">or drag and drop</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* URL Input */}
        {isEditing && (
          <div className="mt-4 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={content.src}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="Enter image URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={content.alt}
                onChange={(e) => handleAltChange(e.target.value)}
                placeholder="Describe the image"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  value={content.width || ""}
                  onChange={(e) =>
                    handleSizeChange(e.target.value, content.height || "")
                  }
                  placeholder="e.g., 300px, 50%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={content.height || ""}
                  onChange={(e) =>
                    handleSizeChange(content.width || "", e.target.value)
                  }
                  placeholder="e.g., 200px, auto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-primary flex-1"
              >
                Done
              </button>
              <button
                onClick={() => handleImageChange("")}
                className="btn-danger flex-1"
              >
                Remove Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBlock;
