import jwt_decode from "jwt-decode";
import Axios from "axios";
import api from "../api";
// import api from "../api";

let accessToken = "";
let refreshToken = localStorage.getItem("token") || "";

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
    if (newAccessToken) accessToken = newAccessToken;
    if (newRefreshToken) {
      refreshToken = newRefreshToken;
      localStorage.setItem("token", newRefreshToken);
    }
  }

  logout() {
    this.setToken({ newAccessToken: "", newRefreshToken: "" });
  }

  async getToken() {
    if (this.hasExpired()) return this.refreshToken();
    else return accessToken;
  }

  async refreshToken() {
    if (!refreshToken) return false;
    if (!this.hasExpired()) return accessToken;

    try {
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
      this.logout();
      return false;
    }
  }

  hasExpired() {
    if (!accessToken) return true;
    const decodeToken = jwt_decode(accessToken);
    const now = new Date().getTime() / 1000;

    if (!decodeToken || now > decodeToken.exp) {
      return true;
    } else {
      return false;
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
