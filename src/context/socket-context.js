import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import auth from "../utils/auth";
import { useAuthState } from "./auth-context";

const SocketContext = React.createContext();
export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ children }) {
  // const auctionID = useSelector((state) => state.auctionDetails.auctionsId);
  // const { auctionId } = useParams();
  const [socket, setSocket] = React.useState();
  const { user, logout } = useAuthState();
  useEffect(() => {
    auth.getToken().then((accessToken) => {
      const URL =  `${process.env.REACT_APP_DEV_WEB_SOCKET_URL}/admin`  
      console.log('URL',URL)
      const newSocket = io(URL, {
        // query: { auctionId: auctionID || auctionId },
        extraHeaders: {
          Authorization: "Bearer " + accessToken,
        },
        path: "/socket.io",
      });
      setSocket(newSocket);
      return () => {
        newSocket.close();
        logout();
      };
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
