import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from 'axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

export const url = 'http://localhost:8000';
// export const url = 'https://tiamoto.com/backend';

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
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const refreshToken = window.localStorage.getItem('refreshToken');

        if (refreshToken && isValidToken(refreshToken)) {
          const response = await axios({
            method: 'post',
            url: `${url}/api/token/refresh/`,
            headers: { Authorization: `Bearer ${refreshToken}`, 'Content-Type': 'application/json' },
            data: { refresh: refreshToken }
          });
          const { access, refresh } = await response.data;
          setSession(access);
          window.localStorage.setItem('refreshToken', refresh);

          const dataUser = await axios({
            method: 'get',
            url: `${url}/api/user/`,
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json'
            }
          });
          const user = await dataUser.data;
          console.log(dataUser);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios({
            method: 'get',
            url: `${url}/api/token`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          const { access } = await response.data;

          const dataUser = await axios({
            method: 'get',
            url: `${url}/api/user/`,
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json'
            }
          });
          const user = await dataUser.data;
          console.log(dataUser);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    const response = await axios.post(`${url}/api/token/`, {
      username,
      password
    });
    const { access, refresh } = response.data;
    const dataUser = await axios({
      method: 'get',
      url: `${url}/api/user`,
      headers: {
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json'
      }
    });
    const user = dataUser.data;

    setSession(access);
    window.localStorage.setItem('refreshToken', refresh);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    window.localStorage.setItem('refreshToken', null);
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
