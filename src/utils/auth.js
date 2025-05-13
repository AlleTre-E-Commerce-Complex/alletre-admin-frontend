import jwt_decode from "jwt-decode";
import Axios from "axios";
import api from "../api";

let accessToken = localStorage.getItem("accessToken") || "";
let refreshToken = localStorage.getItem("token") || "";
let refreshing = false;

class Auth {
  async getDecodedToken() {
    const token = await this.getToken();
    return this._decodeToken(token);
  }

  async getUser() {
    const token = await this.getToken();
    return this._decodeToken(token);
  }

  setToken({ newAccessToken, newRefreshToken }) {
    if (newAccessToken) {
      accessToken = newAccessToken;
      localStorage.setItem("accessToken", newAccessToken);
    }
    if (newRefreshToken) {
      refreshToken = newRefreshToken;
      localStorage.setItem("token", newRefreshToken);
    }
  }

  logout() {
    this.setToken({ newAccessToken: "", newRefreshToken: "" });
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    accessToken = "";
    refreshToken = "";
  }

  async getToken() {
    if (this.hasExpired()) return this.refreshToken();
    else return accessToken;
  }

  async refreshToken() {
    if (!refreshToken) return false;
    if (!this.hasExpired()) return accessToken;
    
    // Prevent multiple simultaneous refresh attempts
    if (refreshing) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return accessToken;
    }

    try {
      refreshing = true;
      const res = await Axios.post(api.auth.refreshtoken, {
        refreshToken: refreshToken,
      });
      const data = res.data;
      if (data?.data?.accessToken) {
        this.setToken({
          newAccessToken: data.data.accessToken,
          newRefreshToken: data.data.refreshToken || refreshToken,
        });
        return data.data.accessToken;
      }
      return false;
    } catch (e) {
      if (e.response?.status === 401) {
        this.logout();
      }
      return false;
    } finally {
      refreshing = false;
    }
  }

  hasExpired() {
    if (!accessToken) return true;
    try {
      const decodeToken = jwt_decode(accessToken);
      const now = new Date().getTime() / 1000;
      
      // Add 30 second buffer to prevent edge cases
      return !decodeToken || now > (decodeToken.exp - 30);
    } catch (e) {
      return true;
    }
  }

  _decodeToken(token) {
    try {
      const decoded = jwt_decode(token);
      return decoded;
    } catch (e) {
      return false;
    }
  }
}

export default new Auth();
