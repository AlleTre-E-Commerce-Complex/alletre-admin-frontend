import React, { useEffect, useState } from "react";
import { Button, Input, Form, Dimmer, TextArea, Modal, Label, Dropdown } from "semantic-ui-react";
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
import useGetGatogry from "../../../hooks/use-get-category";

const WHATSAPP_MAX_LENGTH = 4096; // WhatsApp maximum message length

const AdminMessageSender = () => {
  const { GatogryOptions, loadingGatogry, onReload } = useGetGatogry();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run: sendMessage, isLoading } = useAxios([]);
  const { run: fetchAutions, isLoading: liveAuctionLoading } = useAxios([]);
  const { run: sendAuctionToAll, isLoading: sendAuctionToAllLoading } = useAxios([]);
  
  const [message, setMessage] = useState("");
  const [selectedInputs, setSelectedInputs] = useState(3); // Default to 2 inputs
  const [messages, setMessages] = useState(['', '','']); // Initialize with 2 empty messages
  const [mediaUrl, setMediaUrl] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [showUrlConfirm, setShowUrlConfirm] = useState(false);
  const [liveAuctionData, setLiveAuctionData] = useState([]);
  const [listedProduct, setListedProduct] = useState([]);
  const [listedTotalCount, setListedTotalCount] = useState()
  const [totalPages, setTotalPages] = useState();
  const [limit, setLimit] = useState()
  const [skip , setSkip] = useState()
  const [categoryId, setCategoryId] = useState()
   
  const { search } = useLocation();

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      fetchAutions(
        Promise.all([
          authAxios.get(`${api.app.auctions}${search}&status=ACTIVE`),
          authAxios.get(`${api.app.auctions}${search}&status=IN_SCHEDULED`)
        ])
          .then(([activeRes, scheduledRes]) => {
            const combinedData = [
              ...(activeRes?.data?.data || []),
              ...(scheduledRes?.data?.data || [])
            ];
            
            const maxTotalPages = Math.max(
              activeRes?.data?.pagination?.totalPages || 0,
              scheduledRes?.data?.pagination?.totalPages || 0
            );

            setLiveAuctionData(combinedData);
            setTotalPages(maxTotalPages);
          })
          .catch((error) => {
            console.error('Error fetching auctions:', error);
          })
      );
    }
  }, [fetchAutions, search]);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      fetchAutions(authAxios.get(`${api.app.productListing.getAllListedProducts}${search}`)
          .then((res) => {
            console.log('res....listed',res.data)
            setListedProduct(res?.data?.data);
            setListedTotalCount(res?.data?.pagination?.totalPages);
          })
          .catch((error) => {
            console.error('Error fetching auctions:', error);
          })
      );
    }
  }, [fetchAutions, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all messages
    if (messages.some(msg => !msg.trim())) {
      toast.error('Please enter all messages');
      return;
    }
  
    if (messages.some(msg => msg.length > WHATSAPP_MAX_LENGTH)) {
      toast.error(`One or more messages exceed WhatsApp limit of ${WHATSAPP_MAX_LENGTH} characters`);
      return;
    }
  
    if ((!mediaUrl.trim() || !buttonUrl.trim()) && !showUrlConfirm) {
      setShowUrlConfirm(true);
      return;
    }
  
    try {
      // Send all messages in a single request
      console.log('categoryId:',categoryId)
      await sendMessage(
        authAxios.post(`${api.app.sendMessage.commonMessageAllToNonExistingUser}`, { 
          messages: messages.filter(msg => msg.trim()), // Send only non-empty messages
          mediaUrl: mediaUrl.trim() || null,
          buttonUrl: buttonUrl.trim() || null,
          limit,
          skip, 
          categoryId,
        })
        .then((res)=>{
          console.log(res.data.allUsersList)
        }).catch((error)=>{
          console.error("Error sending message:", error);
          toast.error(error?.response?.data?.message || 'Failed to send message');
        })
      );
      toast.success('Messages sent to all non-registered users');
      
      // Clear form after successful send
      // setMessages(['', '', '', ''].slice(0, selectedInputs));
      // setMediaUrl('');
      // setButtonUrl('');
      setShowUrlConfirm(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || 'Failed to send message');
    }
  };
  const handleSendAuctionToAll = (auctionId) => {
    sendAuctionToAll(
      authAxios.post(`${api.app.sendMessage.sendAuctionToAllUser}`,{auctionId})
      .then((res)=>{
          toast.success('successfully send message')
      })
    )
  }

  const handleSendAuctionEmail = (auctionId) => {
    sendAuctionToAll(
      authAxios.post(`${api.app.sendMessage.sendAuctionToalluserByEmail}`,{auctionId})
      .then((res)=>{
          toast.success('successfully send message')
      })
    )
  }

    const handleSendListedProductEmail = (ListedId) => {
    sendAuctionToAll(
      authAxios.post(`${api.app.sendMessage.sendProductToalluserByEmail}`,{ListedId})
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
         {/* Add selection buttons */}
         <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select Number of Messages</h3>
          <div className="flex gap-4">
            {/* <Button
              onClick={() => {
                setSelectedInputs(2);
                setMessages(['', '']);
              }}
              className={`px-4 ${selectedInputs === 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              2 Lines Messages
            </Button> */}
            <Button
              onClick={() => {
                setSelectedInputs(3);
                setMessages(['', '', '']);
              }}
              className={`px-4 ${selectedInputs === 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              3 Lines Messages
            </Button>
            {/* <Button
              onClick={() => {
                setSelectedInputs(4);
                setMessages(['', '', '', '']);
              }}
              className={`px-4 ${selectedInputs === 4 ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              4 Lines Messages
            </Button> */}
          </div>
        </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Send Bulk Message to Non-Registered Users</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label className="block font-medium mb-1">Media URL (Optional)</label>
            <Input
              type="text"
              placeholder="Enter media URL (image or video)"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">Supported formats: jpg, jpeg, png, mp4</small>
          </Form.Field>

          <Form.Field>
            <label className="block font-medium mb-1">Button URL (Optional)</label>
            <Input
              type="text"
              placeholder="Enter button URL"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <small className="text-gray-500">URL for the button action in the message</small>
          </Form.Field>

          {/* <Form.Field>
            <label className="block font-medium mb-1">
              Message ({message.length}/{WHATSAPP_MAX_LENGTH} characters)
            </label>
            <TextArea
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              style={{ minHeight: '120px' }}
              maxLength={WHATSAPP_MAX_LENGTH}
            />
          </Form.Field> */}
                {/* Message fields */}
                {messages.map((msg, index) => (
            <Form.Field key={index}>
              <label className="block font-medium mb-1">
                Message {index + 1} ({msg.length}/{WHATSAPP_MAX_LENGTH} characters)
              </label>
              <TextArea
                placeholder={`Enter message ${index + 1}`}
                value={msg}
                onChange={(e) => {
                  const newMessages = [...messages];
                  newMessages[index] = e.target.value;
                  setMessages(newMessages);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{ minHeight: '120px' }}
                maxLength={WHATSAPP_MAX_LENGTH}
              />
            </Form.Field>
          ))}
             <label htmlFor="">Enter the number of users which you want to skip (If you enter 4 it will skip first 4 users)</label>
            <Input
                type="number"
                placeholder="Skip"
                value={skip}
                onChange={(e) => setSkip(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />

            <label>Enter the limit of the users (If you enter 6, it will select 6 users after skip)</label>
            <Input
              type="number"
              placeholder="Limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
           
              <label htmlFor="">Select category</label>

                    <Dropdown
                        name="category"
                        label={selectedContent[localizationKeys.category]}
                        placeholder={selectedContent[localizationKeys.category]}
                        options={GatogryOptions}
                        loading={loadingGatogry}
                        onChange={(_, data) => {
                          setCategoryId(data.value);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
           <Button 
            type="submit"  
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-white"
            disabled={messages.some(msg => !msg.trim()) || messages.some(msg => msg.length > WHATSAPP_MAX_LENGTH)}
          >
            Send Bulk Message
          </Button>
        </Form>
      </div>

      {/* URL Confirmation Modal */}
      <Modal
        size="tiny"
        open={showUrlConfirm}
        onClose={() => setShowUrlConfirm(false)}
      >
        <Modal.Header>Missing URLs</Modal.Header>
        <Modal.Content>
          <p>
            {!mediaUrl.trim() && !buttonUrl.trim() && "You haven't provided any media or button URLs."}
            {!mediaUrl.trim() && buttonUrl.trim() && "You haven't provided a media URL."}
            {mediaUrl.trim() && !buttonUrl.trim() && "You haven't provided a button URL."}
            Do you want to continue?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowUrlConfirm(false)}>Cancel</Button>
          <Button 
            primary 
            onClick={(e) => {
              setShowUrlConfirm(false);
              handleSubmit(e);
            }}
          >
            Continue Anyway
          </Button>
        </Modal.Actions>
      </Modal>

      {/* Display Auctions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Auctions</h2>
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
                <p className="text-sm  text-gray-600"> {data.status}</p>
              </div>

              {/* Share Button */}
           <div className="flex flex-col gap-2"> 
           <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendAuctionToAll(data.id)}
              >
                Send auction WhatsApp
              </button>
              <button 
              className="bg-secondary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendAuctionEmail(data.id)}
              >
                 Send auction Email
              </button>
           </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-7">
          <PaginationApp totalPages={totalPages} perPage={10} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedProduct.map((data, index) => (
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
                <p className="text-lg font-semibold text-primary">AED {data.ProductListingPrice}</p>
                <p className="text-sm  text-gray-600"> {data.status}</p>
              </div>

              {/* Share Button */}
           <div className="flex flex-col gap-2"> 
           {/* <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendAuctionToAll(data.id)}
              >
                Send Product WhatsApp
              </button> */}
              <button 
              className="bg-secondary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={()=>handleSendListedProductEmail(data.id)}
              >
                 Send Product Email
              </button>
           </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-7">
          <PaginationApp totalPages={listedTotalCount} perPage={10} />
        </div>
      </div>
    </div>
  );
};

export default AdminMessageSender;
