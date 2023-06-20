import { useEffect, useState } from "react";
import { useLanguage } from "../../context/language-context";
import {
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import axios from "axios";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import routes from "../../routes";
import { useAuthState } from "../../context/auth-context";
import ImgSlider from "../shared/img-slider/img-slider";
import AuctionDetailsTabs from "./auction-details-tabs";
import SummaryAuctionSections from "./summary-auction-sections";

const AuctionsDetails = () => {
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const [auctionsDetailsData, setAuctionsDetailsData] = useState({});
  const { auctionId } = useParams();
  const { run, isLoading } = useAxios([]);
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      run(
        authAxios.get(api.app.getUserAuctionsDetails(auctionId)).then((res) => {
          setAuctionsDetailsData(res?.data?.data);
        })
      );
    } else {
      run(
        axios.get(api.app.getUserAuctionsDetails(auctionId)).then((res) => {
          setAuctionsDetailsData(res?.data?.data);
        })
      );
    }
  }, [auctionId, run, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in mx-5 ">
        <div className="max-w-[1440px] mx-auto">
          {/* up sections */}
          <div>
            <h1 className="text-black font-medium text-2xl py-4">
              {auctionsDetailsData?.product?.title}
            </h1>
            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="">
                <ImgSlider
                  images={auctionsDetailsData?.product?.images}
                  auctionId={auctionsDetailsData?.id}
                  WatshlistState={auctionsDetailsData?.isSaved}
                  isMyAuction={auctionsDetailsData?.isMyAuction}
                />
              </div>
              <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0">
                <SummaryAuctionSections
                  bidderDepositFixedAmount={
                    auctionsDetailsData?.product?.category
                      ?.bidderDepositFixedAmount
                  }
                  isDepositPaid={auctionsDetailsData?.isDepositPaid || false}
                  numberStare={3}
                  totalReviews={20}
                  description={auctionsDetailsData?.product?.description}
                  category={
                    lang === "en"
                      ? auctionsDetailsData?.product?.category?.nameEn
                      : auctionsDetailsData?.product?.category?.nameAr
                  }
                  subCategory={
                    lang === "en"
                      ? auctionsDetailsData?.product?.subCategory?.nameEn
                      : auctionsDetailsData?.product?.subCategory?.nameAr
                  }
                  TimeLeft={auctionsDetailsData?.expiryDate}
                  startBidAmount={auctionsDetailsData?.startBidAmount}
                  StartDate={auctionsDetailsData?.startDate}
                  CurrentBid={auctionsDetailsData?.latestBidAmount}
                  totalBids={auctionsDetailsData?._count?.bids}
                  setActiveIndexTab={setActiveIndexTab}
                  status={auctionsDetailsData?.status}
                  auctionsID={auctionsDetailsData?.id}
                  isBuyNowAllowed={auctionsDetailsData?.isBuyNowAllowed}
                  acceptedAmount={auctionsDetailsData?.acceptedAmount}
                  latestBidAmount={auctionsDetailsData?.latestBidAmount}
                  // TODO add PurchasedTime
                  PurchasedTime={""}
                />
              </div>
            </div>
          </div>
          {/* under sections */}
          <div className="mt-9">
            <AuctionDetailsTabs
              dataTabs={auctionsDetailsData}
              activeIndexTab={activeIndexTab}
              setActiveIndexTab={setActiveIndexTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionsDetails;
