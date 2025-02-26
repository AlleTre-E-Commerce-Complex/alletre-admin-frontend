import React, { useEffect, useState } from "react";
import { Dimmer, Table } from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";
import toast from "react-hot-toast";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import PaginationApp from "../../../components/shared/pagination/pagination-app";
import SuccessModal from "../../../components/shared/modal/SuccessModal";
import routes from "../../../routes";

const NonRegisteredUsersTable = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const [openSuccessModal,setOpenSuccessModal] = useState(false)
  const [SuccessModalMessage, setSuccessModalMessage] = useState('')

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
    {
      try {
        run(
          authAxios.get(`${api.app.getAllNonRegisteredUsers}${search}`).then((res) => {
            console.log('adminUsersTabel :',res?.data?.data)
            setActiveAuctionData(res?.data?.data?.users);
            setTotalPages(res?.data?.data?.pagination?.totalPages);
          })
        );
      } catch (error) {
        console.log(error)
      }
    }
  }, [run, forceReload, search]);
  const handleUpdateUserBlockStatus = (userId, currentStatus, userName) =>{
    console.log('userId ****',userId, userName)
    run(
      authAxios.patch( `${api.app.updateUserBlockStatus(userId, currentStatus)}`).then((res)=>{
        console.log('response of is bloked :',res)
        if(res?.data?.success){
          setOpenSuccessModal(true)
          setSuccessModalMessage(`You have successfully changed the blocking status of ${userName}`)
        }else{
          toast.error(`{Failed Changing block status of user : ${userName}`)
        }
      })
    )
  } 

  return (
    <>
      <div className="animate-in">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>
        <Table className="bg-transparent border-none px-5 pt-8  ">
          <Table.Header>
            <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
              <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-left">
                No.
              </Table.HeaderCell>
              <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-left">
                User Name
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Email
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Phone Number
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Created At
              </Table.HeaderCell>
              {/* <Table.HeaderCell className="font-medium text-sm text-gray-dark text-left">
                Total Auctions
              </Table.HeaderCell> */}
              {/* <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-left ">
                Total Joined Auction
              </Table.HeaderCell> */}
              <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-left ">
                Action
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {activeAuctionData?.map((e, index) => (
            <Table.Body className="">
              <div className="my-3"></div>
              <Table.Row className="bg-background border-none shadow rounded-lg ">
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left">
                  {index +1 }
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left rounded-l-lg ">
                  <div className="flex">
                    <div className="w-[64px] h-12">
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={userProfileicon}
                        alt="userProfileicon"
                      />
                    </div>
                    <p className="my-auto">{e?.name || "----"}</p>
                  </div>
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left">
                  {e?.email || "----"}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left">
                  {e?.mobile || "----"}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left">
                  {new Date(e?.createdAt).toLocaleDateString("en-GB")}
                </Table.Cell>
                {/* <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left">
                  {e?._count?.auctions}
                </Table.Cell> */}
                {/* <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left rounded-r-lg ">
                  {e?._count?.JoinedAuction}
                </Table.Cell> */}
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-left rounded-r-lg ">
                  <button 
                    className={`border rounded-md p-2  `}
                    onClick={()=>handleUpdateUserBlockStatus(e?.id, e?.isBlocked, e?.userName)}
                  >
                    Send Message
                  </button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        <div className="flex justify-end mt-7 mx-8">
          <PaginationApp totalPages={totalPages} perPage={25} />
          </div>
        <SuccessModal 
          open={openSuccessModal}
          setOpen={setOpenSuccessModal}
          returnUrl={routes.app.users.default}
          message={SuccessModalMessage}
        />
      </div>
    </>
  );
};

export default NonRegisteredUsersTable;
