import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import { useSocket } from "../../../context/socket-context";
import { useDispatch } from "react-redux";
import { setDeliveryRequests } from "../../../redux-store/delivery-requests-slice";

const DeliveryRequestsStatus = {
  DELIVERY_PENDING: "DELIVERY_PENDING",
  DELIVERY_SUCCESS: "DELIVERY_SUCCESS",
  DELIVERY_IN_PROGRESS: "DELIVERY_IN_PROGRESS",
  DELIVERY_FAILED: "DELIVERY_FAILED",
  DELIVERY_HOLD: "DELIVERY_HOLD",
};

const DeliveryRequests = () => {
  const { run, isLoading } = useAxios();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const socket = useSocket()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications via socket
    socket.on('delivery:newNotification', (newNotification) => {
      console.log('delivery:newNotification',newNotification);

      // Add the new notification to the existing requests
      setRequests((prevRequests) => {
        const updatedRequests = [...prevRequests, newNotification];
        
        // Dispatch the updated requests and the new count to the Redux store
        dispatch(setDeliveryRequests({ deliveryRequests: updatedRequests }));
        dispatch(setDeliveryRequests({ deliveryRequestsCount: updatedRequests.length }));

        return updatedRequests;
      });
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off('delivery:newNotification');
    };
  }, [socket, dispatch]);
  useEffect(() => {
    run(
      authAxios
        .get(api.app.deliveryRequests.getRequests)
        .then((res) => {
          console.log(res.data.data);
          setRequests(res.data.data);
          dispatch(setDeliveryRequests({deliveryRequests:res.data.data}))
          dispatch(setDeliveryRequests({deliveryRequestsCount:res.data.data.length}))
        })
    );
  }, [run,dispatch,socket]);

  const getValidStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case DeliveryRequestsStatus.DELIVERY_PENDING:
        return [
            DeliveryRequestsStatus.DELIVERY_PENDING,
          DeliveryRequestsStatus.DELIVERY_IN_PROGRESS,
        ];
      case DeliveryRequestsStatus.DELIVERY_IN_PROGRESS:
        return [
            DeliveryRequestsStatus.DELIVERY_IN_PROGRESS,
          DeliveryRequestsStatus.DELIVERY_SUCCESS,
          DeliveryRequestsStatus.DELIVERY_FAILED,
          DeliveryRequestsStatus.DELIVERY_HOLD,
        ];
      case DeliveryRequestsStatus.DELIVERY_HOLD:
        return [
            DeliveryRequestsStatus.DELIVERY_HOLD,
          DeliveryRequestsStatus.DELIVERY_SUCCESS,
          DeliveryRequestsStatus.DELIVERY_FAILED,
        ];
      case DeliveryRequestsStatus.DELIVERY_SUCCESS:
        return [DeliveryRequestsStatus.DELIVERY_SUCCESS];
      case DeliveryRequestsStatus.DELIVERY_FAILED:
        return [
            DeliveryRequestsStatus.DELIVERY_FAILED,
          DeliveryRequestsStatus.DELIVERY_IN_PROGRESS,
          DeliveryRequestsStatus.DELIVERY_SUCCESS,
        ];
      default:
        return [];
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    const currentStatus = requests.find((req) => req.id === requestId).auction.deliveryRequestsStatus;

    // Get valid status options based on the current status
    const validStatusOptions = getValidStatusOptions(currentStatus);

    // Only update if the new status is in the valid options list
    if (!validStatusOptions.includes(newStatus)) {
      console.log("Invalid status transition");
      return; // Do nothing if the transition is not valid
    }

    // Update the status in the backend
    run(
      authAxios
        .patch(`${api.app.deliveryRequests.updateStatus(requestId)}`, {
          status: newStatus,
        })
        .then(() => {
          // Update the status locally
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req.id === requestId ? { ...req, auction: { ...req.auction, deliveryRequestsStatus: newStatus } } : req
            )
          );
        })
        .catch((err) => {
          console.error("Error updating status:", err);
        })
    );
  };

  return (
    <div className="p-6 ">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <h2 className="text-2xl font-bold mb-4">Delivery Requests</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date & Time</th>
            <th className="border border-gray-300 px-4 py-2">Seller</th>
            <th className="border border-gray-300 px-4 py-2">Winner</th>
            <th className="border border-gray-300 px-4 py-2">Product</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <div>{new Date(req.createdAt).toLocaleDateString()}</div>
                <small className="text-gray-500">{new Date(req.createdAt).toLocaleTimeString()}</small>
              </td>
              <td className="border border-gray-300 px-4 py-2">{req.auction.user.userName}</td>
              <td className="border border-gray-300 px-4 py-2">{req.user.userName}</td>
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={req.auction.product.images[0].imageLink}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={req.auction.deliveryRequestsStatus}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  className="px-2 py-1 rounded border border-gray-300"
                >
                  {getValidStatusOptions(req.auction.deliveryRequestsStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("DELIVERY_", "").replace("_", " ")}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div id="delivery-modal" className="bg-white rounded-lg p-6 w-3/4 max-w-3xl">
            <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-bold">Seller Details</h4>
                <p>Name: {selectedRequest.auction.user.userName}</p>
                <p>Country: {selectedRequest.auction.location.country.nameEn}</p>
                <p>City: {selectedRequest.auction.location.city.nameEn}</p>
                <p>Address: {selectedRequest.auction.location.address}</p>
                <p>Phone: {selectedRequest.auction.user.phone}</p>
                <p>Label: {selectedRequest.auction.location.addressLabel}</p>
              </div>
              <div>
                <h4 className="font-bold">Winner Details</h4>
                <p>Name: {selectedRequest.user.userName}</p>
                <p>Country: {selectedRequest.user.locations[0].country.nameEn}</p>
                <p>City: {selectedRequest.user.locations[0].city.nameEn}</p>
                <p>Address: {selectedRequest.user.locations[0].address}</p>
                <p>Phone: {selectedRequest.user.phone}</p>
                <p>Label: {selectedRequest.user.locations[0].addressLabel}</p>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-bold">Product Details</h4>
              <div className="flex items-center">
                <img
                  src={selectedRequest.auction.product.images[0].imageLink}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded mr-4"
                />
                <div>
                  <p>Title: {selectedRequest.auction.product.title}</p>
                  <p>Brand: {selectedRequest.auction.product.brand}</p>
                  <p>Model: {selectedRequest.auction.product.model}</p>
                  <p>Description: {selectedRequest.auction.product.description}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryRequests;
