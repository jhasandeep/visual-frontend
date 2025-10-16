import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import { Page } from "../types";
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

const Published: React.FC = () => {
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPublishedPages();
  }, []);

  const loadPublishedPages = async () => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPages();
      if (response.success && response.data) {
        // Filter only published pages
        const publishedPages = response.data.pages.filter(
          (page) => page.isPublished
        );
        setPages(publishedPages);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load published pages",
        message: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublishPage = async (pageId: string) => {
    if (!window.confirm("Are you sure you want to unpublish this page?"))
      return;

    try {
      const response = await pagesAPI.unpublishPage(pageId);
      if (response.success && response.data) {
        setPages(pages.filter((page) => page._id !== pageId));
        addToast({
          type: "success",
          title: "Page unpublished",
          message: "The page has been unpublished successfully",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to unpublish page",
        message: "Please try again",
      });
    }
  };

  const handleCopyLink = (pageId: string) => {
    const link = `${window.location.origin}/preview/${pageId}`;
    navigator.clipboard.writeText(link);
    addToast({
      type: "success",
      title: "Link copied",
      message: "Page link has been copied to clipboard",
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
          <h1 className="text-2xl font-bold text-gray-900">Published Pages</h1>
          <p className="text-gray-600 mt-1">
            View and manage your published pages.
          </p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Create New Page</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {pages.length}
            </div>
            <div className="text-sm text-gray-500">Published Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pages.reduce((total, page) => total + page.analytics.views, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {pages.filter((page) => page.collaborators.length > 0).length}
            </div>
            <div className="text-sm text-gray-500">With Collaborators</div>
          </div>
        </div>
      </div>

      {/* Pages list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {pages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No published pages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't published any pages yet. Create and publish your
                first page.
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Published {formatDate(page.updatedAt)}</span>
                      {page.analytics.views > 0 && (
                        <span>{page.analytics.views} views</span>
                      )}
                      {page.collaborators.length > 0 && (
                        <span>{page.collaborators.length} collaborators</span>
                      )}
                    </div>
                    {page.description && (
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {page.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyLink(page._id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Copy page link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/builder/${page._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit page"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleUnpublishPage(page._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Unpublish page"
                    >
                      <EyeIcon className="w-4 h-4" />
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

export default Published;
