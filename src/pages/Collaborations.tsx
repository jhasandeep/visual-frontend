import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import { Page } from "../types";
import {
  PlusIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Collaborations: React.FC = () => {
  const { addToast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollaborativePages();
  }, []);

  const loadCollaborativePages = async () => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPages();
      if (response.success && response.data) {
        // Filter only pages with collaborators
        const collaborativePages = response.data.pages.filter(
          (page) => page.collaborators.length > 0
        );
        setPages(collaborativePages);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load collaborative pages",
        message: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (
    pageId: string,
    collaboratorId: string
  ) => {
    if (!window.confirm("Are you sure you want to remove this collaborator?"))
      return;

    try {
      const response = await pagesAPI.removeCollaborator(
        pageId,
        collaboratorId
      );
      if (response.success && response.data) {
        setPages(
          pages.map((page) =>
            page._id === pageId ? response.data!.page : page
          )
        );
        addToast({
          type: "success",
          title: "Collaborator removed",
          message: "The collaborator has been removed successfully",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to remove collaborator",
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
          <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
          <p className="text-gray-600 mt-1">
            Manage pages you're collaborating on with others.
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
            <div className="text-2xl font-bold text-purple-600">
              {pages.length}
            </div>
            <div className="text-sm text-gray-500">Collaborative Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pages.reduce(
                (total, page) => total + page.collaborators.length,
                0
              )}
            </div>
            <div className="text-sm text-gray-500">Total Collaborators</div>
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
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No collaborative pages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You're not collaborating on any pages yet. Start by adding
                collaborators to your pages.
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
                      {page.analytics.views > 0 && (
                        <span>{page.analytics.views} views</span>
                      )}
                    </div>
                    {page.description && (
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {page.description}
                      </p>
                    )}

                    {/* Collaborators */}
                    <div className="mt-2 flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {page.collaborators.length} collaborator
                        {page.collaborators.length !== 1 ? "s" : ""}
                      </span>
                      <div className="flex -space-x-2">
                        {page.collaborators
                          .slice(0, 3)
                          .map((collaborator, index) => (
                            <div
                              key={collaborator.user._id}
                              className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs text-white font-medium"
                              title={collaborator.user.name}
                            >
                              {collaborator.user.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        {page.collaborators.length > 3 && (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 font-medium">
                            +{page.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
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
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Add collaborator"
                    >
                      <UserPlusIcon className="w-4 h-4" />
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

export default Collaborations;
