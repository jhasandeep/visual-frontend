import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthState,
} from "../types";
import { authAPI } from "../services/api";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data?.user) {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: { user: response.data.user, token },
            });
          } else {
            localStorage.removeItem("token");
            dispatch({ type: "AUTH_FAILURE" });
          }
        } catch (error) {
          localStorage.removeItem("token");
          dispatch({ type: "AUTH_FAILURE" });
        }
      } else {
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authAPI.login(credentials);
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authAPI.register(credentials);
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.success && response.data?.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: state.user!, token },
        });
      }
    } catch (error) {
      logout();
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(updates);
      if (response.success && response.data?.user) {
        dispatch({
          type: "UPDATE_USER",
          payload: response.data.user,
        });
      } else {
        throw new Error(response.message || "Profile update failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
