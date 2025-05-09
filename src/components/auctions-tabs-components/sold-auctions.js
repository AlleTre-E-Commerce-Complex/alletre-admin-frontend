import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import ActionsRowTable from "./actions-row-table";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const SoldAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [soldAuctionsData, setSoldAuctionsData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage")) {
      run(
        authAxios
          .get(`${api.app.auctions}${search}&status=SOLD`)
          .then((res) => {
            setSoldAuctionsData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
    }
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
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
            <AuctionIcon className="w-5 h-5 text-green-600" />
          </span>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Sold Auctions
            </h2>
            <p className="text-sm text-gray-500">
              {soldAuctionsData?.length || 0} {selectedContent[localizationKeys.totalSold]}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {soldAuctionsData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border-2 border-dashed border-gray-200">
          <AuctionIcon className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No sold auctions
          </h3>
          <p className="text-sm text-gray-500">
            There are currently no sold auctions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Auction List */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {soldAuctionsData?.map((e) => (
              <ActionsRowTable
                key={e?.id}
                status={e?.status}
                title={e?.product?.title}
                description={e?.product?.description}
                img={e?.product?.images[0]?.imageLink}
                totalBids={e?._count?.bids}
                endingTime={e?.expiryDate}
                price={e?.bids[0]?.amount || e?.acceptedAmount}
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

export default SoldAuctions;
