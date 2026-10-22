import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import apiClient, { clearTokens, getTokens, setSessionExpiredHandler, setTokens } from '../utils/apiClient';

// ----------------------------------------------------------------------
// Auth against the Django backend (simplejwt):
//   POST /api/token/          { username, password } -> { access, refresh }
//   POST /api/token/refresh/  handled by apiClient
//   GET  /api/user/           -> { displayName, id, email, role }

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

const fetchUser = async () => {
  const response = await apiClient.get('/api/user/');
  return response.data;
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // apiClient calls this when a token refresh fails (session expired or revoked).
    setSessionExpiredHandler(() => dispatch({ type: 'LOGOUT' }));

    const initialize = async () => {
      try {
        if (getTokens().refresh) {
          // apiClient refreshes the access token first if it has expired.
          const user = await fetchUser();
          dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: true, user } });
        } else {
          dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, user: null } });
        }
      } catch (err) {
        console.error(err);
        clearTokens();
        dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, user: null } });
      }
    };

    initialize();
    return () => setSessionExpiredHandler(null);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/api/token/', { username, password });
      setTokens(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect");
      }
      throw new Error(error.response?.data?.detail || 'Connexion au serveur impossible');
    }
    const user = await fetchUser();
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const logout = async () => {
    clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
