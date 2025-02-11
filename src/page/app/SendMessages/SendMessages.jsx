import React, { useEffect, useState } from "react";
import { Button, Input, Form, Dimmer } from "semantic-ui-react";
import api from "../../../api";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import { useLocation } from "react-router-dom";
import PaginationApp from "../../../components/shared/pagination/pagination-app";
import toast from "react-hot-toast";

const AdminMessageSender = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run: sendMessage, isLoading } = useAxios([]);
  const { run: fetchLiveAutions, isLoading: liveAuctionLoading } = useAxios([]);
  const { run: sendAuctionToAll, isLoading: sendAuctionToAllLoading } = useAxios([]);
  
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [liveAuctionData, setLiveAuctionData] = useState([]);
  const [totalPages, setTotalPages] = useState();

  const { search } = useLocation();

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      fetchLiveAutions(
        authAxios.get(`${api.app.auctions}${search}&status=ACTIVE`).then((res) => {
          setLiveAuctionData(res?.data?.data);
          setTotalPages(res?.data?.pagination?.totalPages);
        })
      );
    }
  }, [fetchLiveAutions, search]);

  const handleSubmit = async () => {
    if (sendToAll) {
      try {
        await sendMessage(authAxios.post(`${api.app.sendMessageToAll}`, { message }));
      } catch (error) {
        console.error("Error sending message to all users:", error);
      }
    } else {
      if (phone && message) {
        try {
          await sendMessage(authAxios.post(`${api.app.sendMessage}`, { phone, message }));
        } catch (error) {
          console.error("Error sending message to user:", error);
        }
      }
    }
  };

  const handleSendAuctionToAll = (auctionId) =>{
     sendAuctionToAll(
        authAxios.post(`${api.app.sendMessage.sendAuctionToAllUser}`,{auctionId})
        .then((res)=>{
            toast.success('successfully send message')
        })
     )
  }

  const handleSendAuctionToAllNonExistingUsers = (auctionId) =>{
    sendAuctionToAll(
       authAxios.post(`${api.app.sendMessage.sendAuctionToAllUser}`,{auctionId})
       .then((res)=>{
           toast.success('successfully send message')
       })
    )
 }

  return (
    <div className="admin-message-sender p-6">
      <Dimmer active={isLoading || liveAuctionLoading ||sendAuctionToAllLoading} inverted>
        <LodingTestAllatre />
      </Dimmer>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Send Message</h2>

        <Form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <Button className={`${!sendToAll ?'bg-primary text-white' : ""} `}  onClick={() => setSendToAll(false)}>
              Send To Individual
            </Button>
            <Button className={`${sendToAll ?'bg-primary text-white' : ""} `}onClick={() => setSendToAll(true)}>
              Send to All Users
            </Button>
          </div>

          {!sendToAll && (
            <Form.Field>
              <label className="block font-medium mb-1">Phone Number</label>
              <Input
                type="text"
                placeholder="Enter Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </Form.Field>
          )}

          <Form.Field>
            <label className="block font-medium mb-1"> Message</label>
            <Input
              type="text"
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </Form.Field>

          <Button type="submit"  className="mt-4 w-full bg-primary hover:bg-primary-dark text-white">
             Send Message
          </Button>
        </Form>
      </div>

      {/* Display Auctions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Expired Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveAuctionData.map((data, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
              {/* Image */}
              <img
                src={data.product.images[0].imageLink}
                alt="Auction"
                className="w-24 h-24 object-cover rounded-md"
              />

              {/* Auction Details */}
              <div className="flex-1">
                <h3 className="text-md font-bold">{data.product.title}</h3>
                <p className="text-sm text-gray-600">{data.product.category.nameEn}</p>
                <p className="text-lg font-semibold text-primary">AED {data.startBidAmount}</p>
              </div>

              {/* Share Button */}
           <div className="flex flex-col gap-2"> 
           <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendAuctionToAll(data.id)}
              >
                 To Existing Users
              </button>
              <button 
              className="bg-secondary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendAuctionToAllNonExistingUsers(data.id)}
              >
                 To Non Existing Users
              </button>
           </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-7">
          <PaginationApp totalPages={totalPages} perPage={5} />
        </div>
      </div>
    </div>
  );
};

export default AdminMessageSender;
