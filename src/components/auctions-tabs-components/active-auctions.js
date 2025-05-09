import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import ActionsRowTable from "./actions-row-table";
import { Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const ActiveAuctions = () => {
  
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeAuctionData, setActiveAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.auctions}${search}&status=ACTIVE`)
          .then((res) => {
            setActiveAuctionData(res?.data?.data);
            console.log('Acitove page :',res?.data?.data)
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
  }, [run, forceReload, search]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="relative min-h-[400px]">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="transform -translate-y-8">
            <LodingTestAllatre />
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <AuctionIcon className="w-5 h-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Active Auctions
            </h2>
            <p className="text-sm text-gray-500">
              {activeAuctionData?.length || 0} {selectedContent[localizationKeys.totalActive]}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {activeAuctionData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border-2 border-dashed border-gray-200">
          <AuctionIcon className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No active auctions
          </h3>
          <p className="text-sm text-gray-500">
            There are currently no active auctions available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Auction List */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {activeAuctionData?.map((e) => (
              <ActionsRowTable
                key={e?.id}
                status={e?.status}
                title={e?.product?.title}
                auctionsId={e?.id}
                description={e?.product?.description}
                img={e?.product?.images[0]?.imageLink}
                totalBids={e?._count?.bids}
                lastPrice={e?.bids[0]?.amount || e?.startBidAmount}
                endingTime={e?.expiryDate}
                goToDetails={routes.app.auctions.auctionsDetails(e?.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end pt-6 border-t">
            <PaginationApp totalPages={totalPages} perPage={10} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveAuctions;
