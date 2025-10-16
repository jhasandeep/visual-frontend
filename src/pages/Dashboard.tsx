import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI, usersAPI } from "../services/api";
import { Page } from "../types";
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalViews: 0,
    totalCollaborations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [pagesResponse, profileResponse] = await Promise.all([
        pagesAPI.getPages(),
        usersAPI.getProfile(),
      ]);

      if (pagesResponse.success && pagesResponse.data) {
        setPages(pagesResponse.data.pages);
      }

      if (profileResponse.success && profileResponse.data) {
        setStats(profileResponse.data.statistics);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load dashboard",
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

  const filteredPages = pages.filter((page) => {
    if (filter === "published") return page.isPublished;
    if (filter === "drafts") return !page.isPublished;
    return true;
  });

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
      {/* Welcome header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your pages today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pages</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalPages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.publishedPages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.draftPages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalViews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Collaborations
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCollaborations}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/builder"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create New Page</span>
          </Link>

          <Link
            to="/pages"
            className="btn-secondary flex items-center space-x-2"
          >
            <EyeIcon className="w-5 h-5" />
            <span>Browse Public Pages</span>
          </Link>
        </div>
      </div>

      {/* Recent pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Pages</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  filter === "all"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("published")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  filter === "published"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter("drafts")}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  filter === "drafts"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pages found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "all"
                  ? "Get started by creating a new page."
                  : `No ${filter} pages found.`}
              </p>
              {filter === "all" && (
                <div className="mt-6">
                  <Link to="/builder" className="btn-primary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Page
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredPages.map((page) => (
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

export default Dashboard;

