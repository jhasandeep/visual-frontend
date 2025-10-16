import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authAPI } from "../services/api";
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    preferences: {
      theme: user?.preferences?.theme || "light",
      notifications: user?.preferences?.notifications || true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        preferences: {
          theme: user.preferences?.theme || "light",
          notifications: user.preferences?.notifications || true,
        },
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("preferences.")) {
      const prefKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await updateProfile(formData);
      addToast({
        type: "success",
        title: "Settings updated",
        message: "Your settings have been saved successfully",
      });
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to update settings",
        message: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">
                Profile Information
              </h3>
            </div>
          </div>
          <div className="px-6 py-6 space-y-4">
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter your full name"
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field mt-1"
                placeholder="Enter your email address"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <PaintBrushIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
            </div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700"
              >
                Theme
              </label>
              <select
                id="theme"
                name="preferences.theme"
                value={formData.preferences.theme}
                onChange={handleInputChange}
                className="input-field mt-1"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
            </div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500">
                  Receive email updates about your pages and account activity
                </p>
              </div>
              <input
                type="checkbox"
                name="preferences.notifications"
                checked={formData.preferences.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Change Password
                </h4>
                <p className="text-sm text-gray-500">
                  Update your account password for better security
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  addToast({
                    type: "info",
                    title: "Feature coming soon",
                    message:
                      "Password change functionality will be available soon",
                  })
                }
              >
                <KeyIcon className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
