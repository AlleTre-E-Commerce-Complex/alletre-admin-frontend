import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";

import woooo from "./woooo.json";
import congrat from "./congrat.json";

import { useAuthState } from "../../../context/auth-context";
import auth from "../../../utils/auth";
import { io } from "socket.io-client";

const Win = () => {
  const { user, logout } = useAuthState();
  const [IsWinner, setIsWinner] = useState(null);

  useEffect(() => {
    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : undefined,
      };
      const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
      const newSocket = io(URL, {
        extraHeaders: Object.entries(headers).reduce(
          (acc, [key, value]) =>
            value !== undefined ? { ...acc, [key]: value } : acc,
          {}
        ),
        path: "/socket.io",
      });
      newSocket?.on("auction:winner", (data) => {
        setIsWinner(data);
        console.log("====================================");
        console.log(data);
        console.log("====================================");
      });

      return () => {
        newSocket.close();
        logout();
      };
    });
  }, []);

  useEffect(() => {
    if (IsWinner) {
      const timeoutId = setTimeout(() => {
        setIsWinner(null);
      }, 10000); // 10 seconds in milliseconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [IsWinner]);

  const wooooOptions = {
    loop: true,
    autoplay: true,
    animationData: woooo,
  };

  return IsWinner ? (
    <div className="fixed top-0 w-full h-full z-[500]">
      <div className="flex justify-between">
        <Lottie options={wooooOptions} />
        <Lottie options={wooooOptions} />
        <Lottie options={wooooOptions} />
      </div>
    </div>
  ) : null;
};

export default Win;
