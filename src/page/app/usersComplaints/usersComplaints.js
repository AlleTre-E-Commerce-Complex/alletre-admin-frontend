import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const UsersComplaints = () => {
  const language = useLanguage();
  const lang = (language && language[0]) || "en";
  const selectedContent = content[lang] || content["en"] || {};
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const BankTransferRequestsStatus = ["PENDING", "SOLVED", "IN_PROGRESS"];

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios.get(api.app.getUserComplaints).then((res) => {
        console.log("complaints request : ", res?.data?.data);
        setComplaints(res?.data?.data);
      }),
    );
  }, [run]);
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
              req.id === complaintId
                ? { ...req, problemStatus: newStatus }
                : req,
            ),
          );
        })
        .catch((err) => {
          console.error("Error updating status:", err);
        }),
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
      <h2 className="text-2xl font-bold mb-4">{selectedContent[localizationKeys.userComplaints]}</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">{selectedContent[localizationKeys.date]}</th>
            <th className="border border-gray-300 px-4 py-2">
              {selectedContent[localizationKeys.complainingUser]}
            </th>
            <th className="border border-gray-300 px-4 py-2">{selectedContent[localizationKeys.seller]}</th>
            <th className="border border-gray-300 px-4 py-2">{selectedContent[localizationKeys.complaint]}</th>
            <th className="border border-gray-300 px-4 py-2">{selectedContent[localizationKeys.product]}</th>
            <th className="border border-gray-300 px-4 py-2">
              {selectedContent[localizationKeys.complaintStatus]}
            </th>
            {/* <th className="border border-gray-300 px-4 py-2">Delivery Type</th> */}
            <th className="border border-gray-300 px-4 py-2">{selectedContent[localizationKeys.actionStatus]}</th>
          </tr>
        </thead>
        <tbody>
          {complaints?.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <div>{new Date(req.date).toLocaleDateString()}</div>
                <small className="text-gray-500">
                  {new Date(req.date).toLocaleTimeString()}
                </small>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {req.user.userName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {req.auction.user.userName}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {req.message}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {req.auction.product.images[0].imageLink.includes(".mp4") ? (
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
                {req.problemStatus !== "SOLVED" ? (
                  <select
                    value={req.problemStatus}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="px-2 py-1 rounded border border-gray-300"
                  >
                    {BankTransferRequestsStatus.map((problemStatus) => (
                      <option key={problemStatus} value={problemStatus}>
                        {problemStatus === "PENDING"
                          ? selectedContent[localizationKeys.pending]
                          : problemStatus === "IN_PROGRESS"
                            ? selectedContent[localizationKeys.inProgress]
                            : selectedContent[localizationKeys.solved]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-700">
                    {req.problemStatus === "PENDING"
                      ? selectedContent[localizationKeys.pending]
                      : req.problemStatus === "IN_PROGRESS"
                        ? selectedContent[localizationKeys.inProgress]
                        : selectedContent[localizationKeys.solved]}
                  </span>
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
                  {selectedContent[localizationKeys.viewDetails]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div
            id="delivery-modal"
            className="bg-white rounded-lg p-6 w-3/4 max-w-3xl"
          >
            <h3 className="text-xl font-bold mb-4">{selectedContent[localizationKeys.complaintDetails]}</h3>
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-bold">{selectedContent[localizationKeys.sellerDetails]}</h4>
                <p>{selectedContent[localizationKeys.name]}: {selectedComplaint.auction.user.userName}</p>
                <p>
                  {selectedContent[localizationKeys.country]}:{" "}
                  {lang === "ar"
                    ? selectedComplaint.auction.user.locations[0].country.nameAr
                    : selectedComplaint.auction.user.locations[0].country.nameEn}
                </p>
                <p>
                  {selectedContent[localizationKeys.city]}:{" "}
                  {lang === "ar"
                    ? selectedComplaint.auction.user.locations[0].city.nameAr
                    : selectedComplaint.auction.user.locations[0].city.nameEn}
                </p>
                <p>
                  {selectedContent[localizationKeys.address]}: {selectedComplaint.auction.user.locations[0].address}
                </p>
                <p>{selectedContent[localizationKeys.phone]}: {selectedComplaint.auction.user.phone}</p>
                <p>
                  {selectedContent[localizationKeys.addressLabel]}:{" "}
                  {selectedComplaint.auction.user.locations[0].addressLabel}
                </p>
              </div>
              <div>
                <h4 className="font-bold">{selectedContent[localizationKeys.winnerDetails]}</h4>
                <p>{selectedContent[localizationKeys.name]}: {selectedComplaint.user.userName}</p>
                <p>
                  {selectedContent[localizationKeys.country]}: {lang === "ar" ? selectedComplaint.user.locations[0].country.nameAr : selectedComplaint.user.locations[0].country.nameEn}
                </p>
                <p>{selectedContent[localizationKeys.city]}: {lang === "ar" ? selectedComplaint.user.locations[0].city.nameAr : selectedComplaint.user.locations[0].city.nameEn}</p>
                <p>{selectedContent[localizationKeys.address]}: {selectedComplaint.user.locations[0].address}</p>
                <p>{selectedContent[localizationKeys.phone]}: {selectedComplaint.user.phone}</p>
                <p>{selectedContent[localizationKeys.addressLabel]}: {selectedComplaint.user.locations[0].addressLabel}</p>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-bold">{selectedContent[localizationKeys.productDetails]}</h4>
              <div className="flex items-center">
                <img
                  src={selectedComplaint.auction.product.images[0].imageLink}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded mr-4"
                />
                <div>
                  <p>{selectedContent[localizationKeys.itemName]}: {selectedComplaint.auction.product.title}</p>
                  <p>{selectedContent[localizationKeys.brand]}: {selectedComplaint.auction.product.brand}</p>
                  <p>{selectedContent[localizationKeys.model]}: {selectedComplaint.auction.product.model}</p>
                  <p>
                    {selectedContent[localizationKeys.description]}: {selectedComplaint.auction.product.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 w-full">
              <h4 className="font-bold mb-2">{selectedContent[localizationKeys.mediaGalleryOfComplaints]}</h4>

              {Array.isArray(selectedComplaint.images) &&
              selectedComplaint.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedComplaint.images.map((media, index) => {
                    const link = media?.imageLink;
                    if (!link) return null;

                    const isVideo = link.match(
                      /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)/i,
                    );

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
                <p className="text-gray-500 italic">{selectedContent[localizationKeys.noMediaAvailable]}</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {selectedContent[localizationKeys.close]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersComplaints;
