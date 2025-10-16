import React, { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI, usersAPI } from "../services/api";
import { Page } from "../types";
import {
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Analytics: React.FC = () => {
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

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
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
        title: "Failed to load analytics",
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

  // Calculate additional analytics
  const totalViews = pages.reduce(
    (total, page) => total + page.analytics.views,
    0
  );
  const avgViewsPerPage =
    pages.length > 0 ? Math.round(totalViews / pages.length) : 0;
  const publishedCount = pages.filter((page) => page.isPublished).length;
  const draftCount = pages.filter((page) => !page.isPublished).length;
  const collaborativeCount = pages.filter(
    (page) => page.collaborators.length > 0
  ).length;

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your page performance and engagement metrics.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {publishedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalViews}
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
                {collaborativeCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Average views per page
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {avgViewsPerPage}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Publish rate</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats.totalPages > 0
                  ? Math.round((publishedCount / stats.totalPages) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Collaboration rate</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats.totalPages > 0
                  ? Math.round((collaborativeCount / stats.totalPages) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Published pages</span>
              <span className="text-lg font-semibold text-green-600">
                {publishedCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Draft pages</span>
              <span className="text-lg font-semibold text-yellow-600">
                {draftCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Pages with collaborators
              </span>
              <span className="text-lg font-semibold text-purple-600">
                {collaborativeCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Pages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Pages
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {pages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No data available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create some pages to see analytics data.
              </p>
            </div>
          ) : (
            pages
              .sort((a, b) => b.analytics.views - a.analytics.views)
              .slice(0, 5)
              .map((page, index) => (
                <div key={page._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {page.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {page.isPublished ? "Published" : "Draft"} •{" "}
                          {formatDate(page.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {page.analytics.views}
                        </p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      {page.collaborators.length > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {page.collaborators.length}
                          </p>
                          <p className="text-xs text-gray-500">collaborators</p>
                        </div>
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

export default Analytics;
