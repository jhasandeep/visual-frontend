import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { pagesAPI } from "../services/api";
import { Page } from "../types";
import { renderBlocks } from "../utils/renderUtils";
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  ShareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const Preview: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const { addToast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await pagesAPI.getPage(id);

      if (response.success && response.data) {
        setPage(response.data.page);
      } else {
        throw new Error("Page not found");
      }
    } catch (error: any) {
      addToast({
        type: "error",
        title: "Failed to load page",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: page?.title,
          text: page?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast({
          type: "success",
          title: "Link copied",
          message: "Page link has been copied to clipboard",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Failed to copy link",
          message: "Please try again",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Page not found
          </h2>
          <p className="mt-1 text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/pages"
            className="mt-4 btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Browse Pages
          </Link>
        </div>
      </div>
    );
  }

  if (!page.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            Page not published
          </h2>
          <p className="mt-1 text-gray-600">
            This page is not available for public viewing.
          </p>
          <Link
            to="/pages"
            className="mt-4 btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Browse Pages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS */}
      {page.settings.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.settings.customCSS }} />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/pages"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Pages</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>

          {page.description && (
            <p className="text-xl text-gray-600 mb-6">{page.description}</p>
          )}

          {/* Page Meta */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4" />
              <span>By {page.owner.name}</span>
            </div>

            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Published {formatDate(page.publishedAt!)}</span>
            </div>

            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4" />
              <span>{page.analytics.views} views</span>
            </div>
          </div>
        </div>

        {/* Rendered Blocks */}
        <div className="prose prose-lg max-w-none">
          {renderBlocks(page.blocks)}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Created with Mini Webpage Builder</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                to="/pages"
                className="text-primary-600 hover:text-primary-500"
              >
                Browse more pages
              </Link>
              <span>•</span>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500"
              >
                Create your own
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom JavaScript */}
      {page.settings.customJS && (
        <script dangerouslySetInnerHTML={{ __html: page.settings.customJS }} />
      )}
    </div>
  );
};

export default Preview;

