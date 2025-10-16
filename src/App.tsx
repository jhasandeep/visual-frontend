import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BuilderProvider } from "./contexts/BuilderContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyPages from "./pages/MyPages";
import Published from "./pages/Published";
import Collaborations from "./pages/Collaborations";
import Analytics from "./pages/Analytics";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import PublicPages from "./pages/PublicPages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <BuilderProvider>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pages" element={<PublicPages />} />
                <Route path="/preview/:pageId" element={<Preview />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="dashboard/pages" element={<MyPages />} />
                  <Route path="dashboard/published" element={<Published />} />
                  <Route
                    path="dashboard/collaborations"
                    element={<Collaborations />}
                  />
                  <Route path="dashboard/analytics" element={<Analytics />} />
                  <Route path="dashboard/favorites" element={<Favorites />} />
                  <Route path="dashboard/settings" element={<Settings />} />
                  <Route path="builder/:pageId?" element={<Builder />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BuilderProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
