import React, { useState, useEffect } from "react";
import { useBuilder } from "../../contexts/BuilderContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../hooks/useSocket";
import { pagesAPI, usersAPI } from "../../services/api";
import {
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface CollaborationPanelProps {
  onClose?: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ onClose }) => {
  const { currentPage } = useBuilder();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { activeUsers } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setIsSearching(true);
      const response = await usersAPI.searchUsers(searchQuery);
      if (response.success && response.data) {
        // Filter out current user and existing collaborators
        const existingCollaboratorIds =
          currentPage?.collaborators.map((c) => c.user._id) || [];
        const filteredResults = response.data.users.filter(
          (u: any) =>
            u._id !== user?._id && !existingCollaboratorIds.includes(u._id)
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCollaborator = async (
    userId: string,
    role: string = "editor"
  ) => {
    if (!currentPage) return;

    try {
      const response = await pagesAPI.addCollaborator(
        currentPage._id,
        userId,
        role
      );
      if (response.success) {
        addToast({
          type: "success",
          title: "Collaborator added",
          message: "The user has been added as a collaborator",
        });
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to add collaborator",
        message: error.message,
      });
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!currentPage) return;

    try {
      const response = await pagesAPI.removeCollaborator(
        currentPage._id,
        userId
      );
      if (response.success) {
        addToast({
          type: "success",
          title: "Collaborator removed",
          message: "The user has been removed from collaborators",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to remove collaborator",
        message: error.message,
      });
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
          <UserGroupIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Collaboration</h3>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Users */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Currently Online
          </h4>
          <div className="space-y-2">
            {activeUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No one else is online</p>
            ) : (
              activeUsers.map((activeUser) => (
                <div
                  key={activeUser.userId}
                  className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {activeUser.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {activeUser.user.name}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Collaborator */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Add Collaborator
          </h4>

          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    {result.avatar ? (
                      <img
                        src={result.avatar}
                        alt={result.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {result.name}
                      </p>
                      <p className="text-xs text-gray-500">{result.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddCollaborator(result._id)}
                    className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {isSearching && <p className="text-sm text-gray-500">Searching...</p>}
        </div>

        {/* Current Collaborators */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Collaborators
          </h4>

          <div className="space-y-2">
            {/* Owner */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {currentPage.owner.avatar ? (
                  <img
                    src={currentPage.owner.avatar}
                    alt={currentPage.owner.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentPage.owner.name}
                  </p>
                  <p className="text-xs text-blue-600">Owner</p>
                </div>
              </div>
            </div>

            {/* Collaborators */}
            {currentPage.collaborators.map((collaborator) => (
              <div
                key={collaborator.user._id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  {collaborator.user.avatar ? (
                    <img
                      src={collaborator.user.avatar}
                      alt={collaborator.user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {collaborator.user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {collaborator.role}
                    </p>
                  </div>
                </div>

                {user?._id === currentPage.owner._id && (
                  <button
                    onClick={() =>
                      handleRemoveCollaborator(collaborator.user._id)
                    }
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {currentPage.collaborators.length === 0 && (
              <p className="text-sm text-gray-500">No collaborators yet</p>
            )}
          </div>
        </div>

        {/* Collaboration Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Roles</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium">Owner:</span> Full control
            </div>
            <div>
              <span className="font-medium">Admin:</span> Edit and manage
              collaborators
            </div>
            <div>
              <span className="font-medium">Editor:</span> Edit content
            </div>
            <div>
              <span className="font-medium">Viewer:</span> View only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;

