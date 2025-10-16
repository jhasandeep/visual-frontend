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
  ClockIcon,
} from "@heroicons/react/24/outline";

const MyPages: React.FC = () => {
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPages();
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

  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await pagesAPI.deletePage(pageId);
      if (response.success) {
        setPages(pages.filter((page) => page._id !== pageId));
        addToast({
          type: "success",
          title: "Page deleted",
          message: "The page has been deleted successfully",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to delete page",
        message: "Please try again",
      });
    }
  };

  const handlePublishToggle = async (page: Page) => {
    try {
      const response = page.isPublished
        ? await pagesAPI.unpublishPage(page._id)
        : await pagesAPI.publishPage(page._id);

      if (response.success && response.data) {
        setPages(
          pages.map((p) => (p._id === page._id ? response.data!.page : p))
        );
        addToast({
          type: "success",
          title: page.isPublished ? "Page unpublished" : "Page published",
          message: `The page has been ${
            page.isPublished ? "unpublished" : "published"
          } successfully`,
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to update page",
        message: "Please try again",
      });
    }
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
          <h1 className="text-2xl font-bold text-gray-900">My Pages</h1>
          <p className="text-gray-600 mt-1">
            Manage all your pages in one place.
          </p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Create New Page</span>
        </Link>
      </div>

      {/* Pages list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {pages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pages found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new page.
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
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {formatDate(page.createdAt)}</span>
                      {page.updatedAt !== page.createdAt && (
                        <span>Updated {formatDate(page.updatedAt)}</span>
                      )}
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
                    <Link
                      to={`/builder/${page._id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit page"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handlePublishToggle(page)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title={page.isPublished ? "Unpublish" : "Publish"}
                    >
                      {page.isPublished ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <ShareIcon className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeletePage(page._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete page"
                    >
                      <TrashIcon className="w-4 h-4" />
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

export default MyPages;
