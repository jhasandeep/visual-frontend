import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const Sidebar: React.FC = () => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "My Pages", href: "/dashboard/pages", icon: DocumentTextIcon },
    { name: "Published", href: "/dashboard/published", icon: EyeIcon },
    {
      name: "Collaborations",
      href: "/dashboard/collaborations",
      icon: UserGroupIcon,
    },
    { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
    { name: "Favorites", href: "/dashboard/favorites", icon: HeartIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary-100 text-primary-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Mini Webpage Builder
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    v1.0.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

