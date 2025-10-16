import React from "react";
import { Link } from "react-router-dom";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
            <DocumentTextIcon className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">
          Page not found
        </h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="mt-8 space-y-4">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center"
          >
            Go back to Dashboard
          </Link>

          <div className="text-sm">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500"
            >
              Or sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

