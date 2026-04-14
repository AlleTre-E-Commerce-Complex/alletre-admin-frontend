import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux-store/store";

import "react-toastify/dist/ReactToastify.css";
import App from "./App";

import "semantic-ui-css/semantic.min.css";
import "./index.css";

import { LanguageProvider } from "./context/language-context";
import { AuthProvider } from "./context/auth-context";
import { SocketProvider } from "./context/socket-context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Provider store={store}>
          <AuthProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </AuthProvider>
        </Provider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
