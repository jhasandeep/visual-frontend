import React, { useState } from "react";
import { useBuilder } from "../../contexts/BuilderContext";
import { useToast } from "../../contexts/ToastContext";
import { pagesAPI } from "../../services/api";
import {
  Cog6ToothIcon,
  XMarkIcon,
  DocumentTextIcon,
  TagIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface SettingsPanelProps {
  onClose?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { currentPage, updatePage } = useBuilder();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: currentPage?.title || "",
    description: currentPage?.description || "",
    category: currentPage?.category || "other",
    tags: currentPage?.tags.join(", ") || "",
    metaTitle: currentPage?.settings.metaTitle || "",
    metaDescription: currentPage?.settings.metaDescription || "",
  });

  const categories = [
    { value: "business", label: "Business" },
    { value: "portfolio", label: "Portfolio" },
    { value: "blog", label: "Blog" },
    { value: "landing", label: "Landing Page" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentPage) return;

    try {
      setIsSaving(true);

      // Debug logging
      console.log("Saving settings for page:", currentPage._id);
      console.log("Form data:", formData);
      console.log("Auth token exists:", !!localStorage.getItem("token"));

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await pagesAPI.updatePage(currentPage._id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags,
        settings: {
          ...currentPage.settings,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        },
      });

      if (response.success && response.data) {
        updatePage(response.data.page);
        addToast({
          type: "success",
          title: "Settings saved",
          message: "Your page settings have been updated",
        });
      }
    } catch (error: any) {
      console.error("Save settings error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      addToast({
        type: "error",
        title: "Failed to save settings",
        message:
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentPage) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Page Settings</h3>
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

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <DocumentTextIcon className="w-4 h-4" />
            <span>Basic Settings</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter page title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter page description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <EyeIcon className="w-4 h-4" />
            <span>SEO Settings</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="SEO title (60 characters max)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  handleChange("metaDescription", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="SEO description (160 characters max)"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>
          </div>
        </div>

        {/* Page Info */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Page Information
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>
                {new Date(currentPage.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>
                {new Date(currentPage.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span>{currentPage.version}</span>
            </div>
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full btn-primary"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
