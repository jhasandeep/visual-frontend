import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { usersAPI } from "../services/api";
import { User, Page } from "../types";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const Profile: React.FC = () => {
  const { user: currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalViews: 0,
    totalCollaborations: 0,
  });
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getProfile();

      if (response.success && response.data) {
        setUser(response.data.user);
        setStats(response.data.statistics);
        setRecentPages(response.data.recentPages);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar || "",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load profile",
        message: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await usersAPI.updateProfile(formData);
      if (response.success && response.data) {
        setUser(response.data.user);
        updateProfile(response.data.user);
        setIsEditing(false);
        addToast({
          type: "success",
          title: "Profile updated",
          message: "Your profile has been updated successfully",
        });
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to update profile",
        message: "Please try again",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="input-field mt-1"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="flex space-x-3">
                  <button onClick={handleSave} className="btn-primary">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                    <div className="flex items-center space-x-1 text-gray-600 mt-1">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 mt-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Joined {formatDate(user?.createdAt || "")}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
              <PencilIcon className="h-8 w-8 text-yellow-600" />
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
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
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
              <UserCircleIcon className="h-8 w-8 text-purple-600" />
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

      {/* Recent Pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Pages</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentPages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No pages yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start creating your first page to see it here.
              </p>
            </div>
          ) : (
            recentPages.map((page: any) => (
              <div key={page._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {page.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Updated {formatDate(page.updatedAt)}</span>
                      {page.analytics.views > 0 && (
                        <span>{page.analytics.views} views</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {page.isPublished && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
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

export default Profile;
