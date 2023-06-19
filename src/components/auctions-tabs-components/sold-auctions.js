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

  return (
    <div className="">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {soldAuctionsData?.length}{" "}
          {selectedContent[localizationKeys.totalSold]}
        </p>
      </div>
      {soldAuctionsData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
          </div>
        </div>
      ) : (
        <div>
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
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={10} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldAuctions;
