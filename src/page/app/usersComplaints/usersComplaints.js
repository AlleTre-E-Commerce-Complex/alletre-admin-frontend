import React, { useEffect, useState } from 'react'
import useAxios from '../../../hooks/use-axios'
import { authAxios } from '../../../config/axios-config'
import api from '../../../api'
import { Dimmer } from 'semantic-ui-react'
import LodingTestAllatre from '../../../components/shared/lotties-file/loding-test-allatre'


const UsersComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const BankTransferRequestsStatus = ['PENDING', 'SOLVED', 'IN_PROGRESS' ]

    const {run, isLoading} = useAxios([])
    useEffect(()=>{
        run(
            authAxios.get(api.app.getUserComplaints)
            .then((res)=>{
                console.log('complaints request : ',res?.data?.data)
                setComplaints(res?.data?.data)
            })
        )
    },[run])
    const handleStatusChange = (complaintId, newStatus) => {
         // Update the status in the backend
    run(
        authAxios
          .patch(`${api.app.updateUserComplaintStatus(complaintId)}`, {
            status: newStatus,
          })
          .then(() => {
            //Update the status locally
            setComplaints((prevRequests) =>
                prevRequests.map((req) =>
                  req.id === complaintId ? { ...req, problemStatus: newStatus } : req
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
          <h2 className="text-2xl font-bold mb-4">Bank Transfer Requests</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Date & Time</th>
                <th className="border border-gray-300 px-4 py-2">The complaining user</th>
                <th className="border border-gray-300 px-4 py-2">Seller</th>
                <th className="border border-gray-300 px-4 py-2">Complaint</th>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Complaint status</th>
                {/* <th className="border border-gray-300 px-4 py-2">Delivery Type</th> */}
                <th className="border border-gray-300 px-4 py-2">Action status</th>
              </tr>
            </thead>
            <tbody>
              { complaints?.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    <div>{new Date(req.date).toLocaleDateString()}</div>
                    <small className="text-gray-500">{new Date(req.date).toLocaleTimeString()}</small>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{req.user.userName}</td>
                  <td className="border border-gray-300 px-4 py-2">{req.auction.user.userName}</td>
                  <td className="border border-gray-300 px-2 py-2">{req.message}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {req.auction.product.images[0].imageLink.includes('.mp4') ? (
                        <video
                        src={req.auction.product.images[0].imageLink}
                        className="w-16 h-16 object-cover rounded"
                        controls
                        />
                    ) : (
                        <img
                        src={req.auction.product.images[0].imageLink}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded"
                        />
                    )}
                    </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {req.problemStatus !== 'SOLVED' ? (
                        <select
                        value={req.problemStatus}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300"
                        >
                        {BankTransferRequestsStatus.map((problemStatus) => (
                            <option key={problemStatus} value={problemStatus}>
                            {problemStatus}
                            </option>
                        ))}
                        </select>
                    ) : (
                        <span className="text-gray-700">{req.problemStatus}</span> // Display the status if it's SUCCESS
                    )}
                    </td>

                  {/* <td className="border border-gray-300 px-4 py-2">
                    {req.auction.deliveryType === "DELIVERY"? "DELIVERY BY COMPANY" : req.auction.deliveryType === 'PICKUP' ? "DELIVERY BY BUYER":"NOT-SPECIFIED" }
                  </td> */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => setSelectedComplaint(req)}
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
          {selectedComplaint && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
              <div id="delivery-modal" className="bg-white rounded-lg p-6 w-3/4 max-w-3xl">
                <h3 className="text-xl font-bold mb-4">Delivery Details</h3>
                <div className="flex justify-between mb-4">
                  <div>
                    <h4 className="font-bold">Seller Details</h4>
                    <p>Name: {selectedComplaint.auction.user.userName}</p>
                    <p>Country: {selectedComplaint.auction.user.locations[0].country.nameEn}</p>
                    <p>City: {selectedComplaint.auction.user.locations[0].city.nameEn}</p>
                    <p>Address: {selectedComplaint.auction.user.locations[0].address}</p>
                    <p>Phone: {selectedComplaint.auction.user.phone}</p>
                    <p>Label: {selectedComplaint.auction.user.locations[0].addressLabel}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Winner Details</h4>
                    <p>Name: {selectedComplaint.user.userName}</p>
                    <p>Country: {selectedComplaint.user.locations[0].country.nameEn}</p>
                    <p>City: {selectedComplaint.user.locations[0].city.nameEn}</p>
                    <p>Address: {selectedComplaint.user.locations[0].address}</p>
                    <p>Phone: {selectedComplaint.user.phone}</p>
                    <p>Label: {selectedComplaint.user.locations[0].addressLabel}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold">Product Details</h4>
                  <div className="flex items-center">
                    <img
                      src={selectedComplaint.auction.product.images[0].imageLink}
                      alt="Product"
                      className="w-24 h-24 object-cover rounded mr-4"
                    />
                    <div>
                      <p>Title: {selectedComplaint.auction.product.title}</p>
                      <p>Brand: {selectedComplaint.auction.product.brand}</p>
                      <p>Model: {selectedComplaint.auction.product.model}</p>
                      <p>Description: {selectedComplaint.auction.product.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                        <h4 className="font-bold mb-2">Media Gallery of Complaints</h4>

                        {Array.isArray(selectedComplaint.images) && selectedComplaint.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedComplaint.images.map((media, index) => {
                                const link = media?.imageLink;
                                if (!link) return null;

                                const isVideo = link.match(/\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)/i);

                                return (
                                <div
                                    key={index}
                                    className="w-full h-56 border rounded-lg flex justify-center items-center bg-gray-200 overflow-hidden cursor-pointer"
                                    onClick={() => window.open(link, "_blank")}
                                >
                                    {isVideo ? (
                                    <video
                                        src={link}
                                        className="w-full h-full object-cover rounded-lg"
                                        controls
                                    />
                                    ) : (
                                    <img
                                        src={link}
                                        alt={`media-${index}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    )}
                                </div>
                                );
                            })}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No media available.</p>
                        )}
                        </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedComplaint(null)}
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
}

export default UsersComplaints
