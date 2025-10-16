import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import { Page } from "../types";
import {
  PlusIcon,
  HeartIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const Favorites: React.FC = () => {
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoritePages();
  }, []);

  const loadFavoritePages = async () => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPages();
      if (response.success && response.data) {
        // For now, we'll show all pages since we don't have a favorites system implemented yet
        // In a real implementation, you'd filter by a 'isFavorite' property
        setPages(response.data.pages);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load favorite pages",
        message: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (pageId: string) => {
    // This would be implemented to remove from favorites
    addToast({
      type: "info",
      title: "Feature coming soon",
      message: "Favorites functionality will be available in a future update",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
          <p className="text-gray-600 mt-1">
            Your favorite pages for quick access.
          </p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Create New Page</span>
        </Link>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <HeartIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Favorites feature coming soon
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                We're working on adding a favorites system to help you quickly
                access your most important pages. For now, you can access all
                your pages from the "My Pages" section.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-sm text-gray-500">Favorite Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pages.length}
            </div>
            <div className="text-sm text-gray-500">Total Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {pages.filter((page) => page.isPublished).length}
            </div>
            <div className="text-sm text-gray-500">Published</div>
          </div>
        </div>
      </div>

      {/* Pages list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {pages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pages to favorite yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first page and mark it as a favorite for quick
                access.
              </p>
              <div className="mt-6">
                <Link to="/builder" className="btn-primary">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New Page
                </Link>
              </div>
            </div>
          ) : (
            pages.map((page) => (
              <div key={page._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/builder/${page._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 truncate"
                      >
                        {page.title}
                      </Link>
                      {page.isPublished && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                      {/* Favorite indicator - would be shown when favorites are implemented */}
                      <HeartIcon className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {formatDate(page.createdAt)}</span>
                      {page.updatedAt !== page.createdAt && (
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      )}
                      {page.analytics.views > 0 && (
                        <span>{page.analytics.views} views</span>
                      )}
                    </div>
                    {page.description && (
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {page.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/builder/${page._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit page"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleRemoveFavorite(page._id)}
                      className="p-2 text-gray-300 hover:text-red-600"
                      title="Remove from favorites"
                    >
                      <HeartIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
