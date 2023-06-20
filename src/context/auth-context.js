import React from "react";
import { useHistory } from "react-router-dom";
import Auth from "../utils/auth";
import routes from "../routes";
import { useLocation } from "react-router-dom";
import useAxios from "../hooks/use-axios";
import { useSelector } from "react-redux";
import LodingTestAllatre from "../components/shared/lotties-file/loding-test-allatre";

const AuthContext = React.createContext();

// const WHITE_LIST = [];

function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const history = useHistory();
  const { pathname } = useLocation();

  const { run, isError } = useAxios();

  const login = ({ accessToken, refreshToken }) => {
    setUser(Auth._decodeToken(accessToken));
    Auth.setToken({
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
    });
  };

  const logout = () => {
    Auth.setToken({ newAccessToken: "", newRefreshToken: "" });
    history.push(routes.auth.logIn);
  };

  React.useEffect(() => {
    Auth.getUser().then((user) => {
      if (!user) {
        history.push(routes.auth.logIn);
      }
      setUser(user);
      setIsLoading(false);
    });
  }, [history]);

  React.useLayoutEffect(() => {
    if (isLoading) document.body.classList.add("bg-gray-100");
    else document.body.classList.remove("bg-gray-100");
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isLoading,
        isError,
      }}
    >
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LodingTestAllatre />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

function useAuthState() {
  const { user, isLoading, isError, login, logout } =
    React.useContext(AuthContext);

  return {
    user,
    isLoading,
    isError,
    logout,
    login,
  };
}

export { useAuthState, AuthProvider };
