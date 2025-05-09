import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import { DraftsItem } from "./drafts-Item";

const DraftsAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [draftAuctionData, setDraftAuctionData] = useState();

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const history = useHistory();

  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    run(
      authAxios.get(`${api.app.auctions}?status=DRAFTED`).then((res) => {
        setDraftAuctionData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

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
              Draft Auctions
            </h2>
            <p className="text-sm text-gray-500">
              {draftAuctionData?.length || 0} {selectedContent[localizationKeys.totalDraft]}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {draftAuctionData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border-2 border-dashed border-gray-200">
          <AuctionIcon className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No draft auctions
          </h3>
          <p className="text-sm text-gray-500">
            There are currently no draft auctions available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Draft Items Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {draftAuctionData?.map((e) => (
              <DraftsItem
                key={e?.id}
                auctionId={e?.id}
                img={e && e?.product?.images[0]?.imageLink}
                itemName={e?.product?.title}
                date={e?.createdAt}
                onReload={onReload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftsAuctions;
