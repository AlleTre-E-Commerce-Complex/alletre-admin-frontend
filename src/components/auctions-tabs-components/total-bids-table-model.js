import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dimmer, Loader, Modal, Table } from "semantic-ui-react";
import api from "../../api";
import { authAxios, axios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import backArrowSecandryColor from "../../../src/assets/icons/back_arrow_secandry_color.png";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { formatCurrency } from "../../utils/format-currency";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const TotalBidsTableModel = ({ open, setOpen, auctionsIdB }) => {
  const { user } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { auctionId } = useParams();
  const [userID, setUserID] = useState();
  const [totalBids, setTotalBidse] = useState();
  const [openSecondModel, setOpenSecondModel] = useState(false);
  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    if (user) {
      if (auctionId) {
        run(
          authAxios.get(api.app.totalBids(auctionId)).then((res) => {
            setTotalBidse(res?.data?.data);
          })
        );
      } else if (auctionsIdB) {
        run(
          authAxios.get(api.app.totalBids(auctionsIdB)).then((res) => {
            setTotalBidse(res?.data?.data);
          })
        );
      }
    } else if (auctionId) {
      run(
        axios.get(api.app.totalBids(auctionId)).then((res) => {
          setTotalBidse(res?.data?.data);
        })
      );
    }
  }, [auctionId, auctionsIdB]);

  return (
    <Modal
      className="w-[1070px] h-[523px] rounded-2xl bg-transparent border-2 border-primary"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="w-[1070px] h-[523px] rounded-2xl bg-white border-2 border-primary  ">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          {/* <Loader active /> */}
          <LodingTestAllatre />
        </Dimmer>
        <Table className="bg-transparent border-none px-5 pt-8 ">
          <Table.Header>
            <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
              <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-center">
                {selectedContent[localizationKeys.series]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                {selectedContent[localizationKeys.bidderName]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                {selectedContent[localizationKeys.biddingEndingTime]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                {selectedContent[localizationKeys.totalBids]}
              </Table.HeaderCell>
              <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-center ">
                {selectedContent[localizationKeys.lastBidAmount]}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {totalBids?.map((e, index) => (
            <Table.Body className="my-2 cursor-pointer">
              <div className="my-2"></div>
              <Table.Row
                onClick={() => {
                  setUserID(e?.id);
                  setOpenSecondModel(true);
                }}
                className="bg-background border-none shadow rounded-lg "
              >
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {e?.userName}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {moment(e?.lastBidTime).format("dddd - DD/M/YYYY")}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {e?.totalBids}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
                  {formatCurrency(e?.lastBidAmount)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
      {/* <TotalBidsDetailsTableModel
        openSecondModel={openSecondModel}
        setOpenSecondModel={setOpenSecondModel}
        user={user}
        userId={userID}
        totalBids={totalBids}
        auctionId={auctionId ? auctionId : auctionsIdB}
      /> */}
    </Modal>
  );
};
export default TotalBidsTableModel;

export const TotalBidsDetailsTableModel = ({
  openSecondModel,
  setOpenSecondModel,
  user,
  auctionId,
  userId,
  totalBids,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [historyBids, setHistoryBids] = useState();
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (totalBids?.length > 0 && openSecondModel && auctionId && userId)
      run(
        (user ? authAxios : axios)
          .get(api.app.auctions.totalBidsDetails(auctionId, userId))
          .then((res) => {
            setHistoryBids(res?.data?.data);
          })
      );
  }, [totalBids, openSecondModel, auctionId, userId]);

  return (
    <Modal
      className="w-[1070px] h-[523px] rounded-2xl bg-transparent border-2 border-primary"
      onClose={() => setOpenSecondModel(false)}
      onOpen={() => setOpenSecondModel(true)}
      open={openSecondModel}
    >
      <div className="w-[1070px] h-[523px] rounded-2xl bg-white border-2 border-primary  overflow-y-scroll scrollbar-hide ">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <Loader active />
        </Dimmer>
        <div className=" mt-8">
          <div className="bg-[#F9F9F9] w-[266px] h-[423px] rounded-lg fixed ltr:left-4 rtl:right-4">
            <div
              onClick={() => setOpenSecondModel(false)}
              className="flex mx-2 cursor-pointer "
            >
              <img
                className="w-[w-40px] h-[40px] ltr:rotate-0 rtl:rotate-180"
                src={backArrowSecandryColor}
                alt="backArrowSecandryColor"
              />
              <p className="text-gray-dark font-medium text-sm my-auto pt-0.5">
                {selectedContent[localizationKeys.totalBidders]}
              </p>
            </div>
            <div className="flex gap-x-4 mx-6 pb-8 pt-6">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={
                  historyBids?.biderInfo?.imageLink
                    ? historyBids?.biderInfo?.imageLink
                    : userProfileicon
                }
                alt="userProfileicon"
              />
              <div className="pt-1">
                <h1 className="text-base text-gray-dark font-medium">
                  {historyBids?.biderInfo?.userName}
                </h1>
                <p className="text-xs text-gray-med font-normal">
                  {selectedContent[localizationKeys.online]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Table className="bg-transparent border-none px-5 w-[754px] m-0 ">
              <Table.Header className=" w-[754px] ">
                <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
                  <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-center">
                    {selectedContent[localizationKeys.series]}
                  </Table.HeaderCell>
                  <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                    {selectedContent[localizationKeys.biddingTime]}
                  </Table.HeaderCell>
                  <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-center ">
                    {selectedContent[localizationKeys.bidAmount]}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              {historyBids?.bidsHistory?.map((e, index) => (
                <Table.Body className="my-2">
                  <div className="my-2"></div>
                  <Table.Row className="bg-background border-none shadow rounded-lg ">
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                      {moment(e?.createdAt).format(
                        "dddd - DD/M/YYYY - HH:MM:SS"
                      )}
                    </Table.Cell>
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
                      {formatCurrency(e?.amount)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
