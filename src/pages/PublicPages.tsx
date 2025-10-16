import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import { Page } from "../types";
import {
  DocumentTextIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const PublicPages: React.FC = () => {
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { value: "", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "portfolio", label: "Portfolio" },
    { value: "blog", label: "Blog" },
    { value: "landing", label: "Landing Page" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    loadPublicPages();
  }, [searchTerm, selectedCategory]);

  const loadPublicPages = async () => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPublicPages({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        limit: 20,
      });

      if (response.success && response.data) {
        setPages(response.data.pages);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load pages",
        message: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      business: "bg-blue-100 text-blue-800",
      portfolio: "bg-purple-100 text-purple-800",
      blog: "bg-green-100 text-green-800",
      landing: "bg-orange-100 text-orange-800",
      personal: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Public Pages
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover amazing pages created by our community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Category filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {pages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No pages found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search criteria."
                    : "No public pages available yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <div
                    key={page._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Page preview placeholder */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                    </div>

                    <div className="p-6">
                      {/* Title and category */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {page.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            page.category
                          )}`}
                        >
                          {
                            categories.find((c) => c.value === page.category)
                              ?.label
                          }
                        </span>
                      </div>

                      {/* Description */}
                      {page.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {page.description}
                        </p>
                      )}

                      {/* Author and date */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-4 h-4" />
                          <span>{page.owner.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(page.publishedAt!)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {page.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mb-4">
                          <TagIcon className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {page.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {page.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{page.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{page.analytics.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{page.blocks.length} blocks</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/preview/${page._id}`}
                          className="btn-primary flex-1 text-center"
                        >
                          View Page
                        </Link>
                        <Link
                          to={`/builder?template=${page._id}`}
                          className="btn-secondary flex-1 text-center"
                        >
                          Use as Template
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPages;

