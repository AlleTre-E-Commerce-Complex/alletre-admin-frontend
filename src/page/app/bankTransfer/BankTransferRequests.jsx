import React, { useEffect, useState } from 'react'
import useAxios from '../../../hooks/use-axios'
import { authAxios } from '../../../config/axios-config'
import api from '../../../api'
import { Dimmer } from 'semantic-ui-react'
import LodingTestAllatre from '../../../components/shared/lotties-file/loding-test-allatre'
import { IoDocumentOutline } from "react-icons/io5";
// import { downloadFile } from '../../../utils/downLoadFile'

const BankTransferRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const BankTransferRequestsStatus = ['SUCCESS', 
        // 'PENDING',  'FAILED', 'HOLD', 'CANCELLED',
        'BANK_STATEMENT_UPLOADED',
    ]

    const {run, isLoading} = useAxios([])
    useEffect(()=>{
        run(
            authAxios.get(api.app.bankTransferRequests.getRequests)
            .then((res)=>{
                console.log('bank transfer request : ',res?.data?.data)
                setRequests(res?.data?.data)
            })
        )
    },[run])
    const handleStatusChange = (requestId, newStatus) => {
         // Update the status in the backend
    run(
        authAxios
          .patch(`${api.app.bankTransferRequests.updateStatus(requestId)}`, {
            status: newStatus,
          })
          .then(() => {
            // Update the status locally
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                  req.id === requestId ? { ...req, status: newStatus } : req
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
                <th className="border border-gray-300 px-4 py-2">Seller</th>
                <th className="border border-gray-300 px-4 py-2">Winner</th>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                {/* <th className="border border-gray-300 px-4 py-2">Delivery Type</th> */}
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              { requests?.map((req) => (
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
                    {req.status !== 'SUCCESS' ? (
                        <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300"
                        >
                        {BankTransferRequestsStatus.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                        </select>
                    ) : (
                        <span className="text-gray-700">{req.status}</span> // Display the status if it's SUCCESS
                    )}
                    </td>

                  {/* <td className="border border-gray-300 px-4 py-2">
                    {req.auction.deliveryType === "DELIVERY"? "DELIVERY BY COMPANY" : req.auction.deliveryType === 'PICKUP' ? "DELIVERY BY BUYER":"NOT-SPECIFIED" }
                  </td> */}
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
                <div className="mb-4 w-full">
                        <h4 className="font-bold">Bank Statement</h4>
                        <div
                            className="w-full h-56 border rounded-lg mr-4 flex justify-center items-center bg-gray-200 cursor-pointer"
                            onClick={() => {
                            if (selectedRequest.bankStatement) {
                                window.open(selectedRequest.bankStatement.statementLink, '_blank');
                            }
                            }}
                        >
                            {selectedRequest.bankStatement ? (
                            selectedRequest.bankStatement.statementLink.includes("uploadedImage") ? (
                                <img
                                src={selectedRequest.bankStatement.statementLink}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                                />
                            ) : selectedRequest.bankStatement.statementLink.includes("uploadedDocument") ? (
                                <>
                                    <div className='w-full'>
                                    <iframe
                                            src={selectedRequest.bankStatement.statementLink}
                                            title="PDF Preview"
                                            className="w-full h-full rounded-lg"
                                        />
                                        <button
                                            className=" text-center w-full border border-primary mt-2 rounded bg-primary hover:bg-primary-dark text-white p-2"
                                            onClick={() =>
                                            // downloadFile(selectedRequest.bankStatement.statementLink, "statement.pdf")
                                            window.open(selectedRequest.bankStatement.statementLink, '_blank')
                                            }
                                        >
                                            View PDF
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-500 text-6xl">
                                <IoDocumentOutline />
                                </span>
                            )
                            ) : (
                            <span className="text-gray-500 text-6xl">
                                <IoDocumentOutline />
                            </span>
                            )}
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
}

export default BankTransferRequests
