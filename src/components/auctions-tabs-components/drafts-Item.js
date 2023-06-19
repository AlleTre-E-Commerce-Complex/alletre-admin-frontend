import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import { useState } from "react";
import useAxios from "../../hooks/use-axios";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { truncateString } from "../../utils/truncate-string";
import moment from "moment";
import { Button, Modal } from "semantic-ui-react";

import emtyPhotos from "../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../src/assets/icons/pen-icon.png";
import { Trash } from "tabler-icons-react";

export const DraftsItem = ({ img, itemName, date, auctionId, onReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios();
  const deleteAuction = () => {
    run(authAxios.delete(api.app.auctions.delete(auctionId)))
      .then((res) => {
        setOpen(false);
        toast.success(selectedContent[localizationKeys.successDelete]);
        onReload();
      })
      .catch((err) => {
        toast.error(selectedContent[localizationKeys.errorDelete]);
      });
  };
  return (
    <>
      <div className="w-[154px] h-[139px] rounded-lg border-[1px] border-solid mb-14 relative mx-auto">
        {img ? (
          <img
            className="w-full h-full rounded-lg object-cover "
            src={img}
            alt="img"
          />
        ) : (
          <div className="w-full h-full rounded-lg object-cover">
            <img className="mx-auto pt-16" src={emtyPhotos} alt="emtyPhotos" />
          </div>
        )}
        <div className="group w-[154px] h-[139px] rounded-lg border-[1px] hover:bg-gradient-to-t hover:from-[#25252562] absolute bottom-0 z-10 ">
          <div className="group-hover:flex justify-center gap-x-9 hidden h-full ">
            <button
              onClick={() =>
                history.push(routes.app.createAuction.productDetails, {
                  auctionId: auctionId,
                })
              }
              className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5"
            >
              <img className="p-2.5" src={PenIcon} alt="PenIcon" />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5"
            >
              <img className="p-[9px]" src={TrashIcon} alt="TrashIcon" />
            </button>
          </div>
        </div>
        <p className="text-gray-dark text-sm font-normal text-center pt-2">
          {truncateString(itemName, 15)}
        </p>
        <p
          dir="ltr"
          className="text-gray-med text-sm font-normal text-center pt-1"
        >
          {moment(date).format("D. MMM. YYYY")}
        </p>
      </div>
      <Modal
        className="sm:w-[392px] w-full h-auto bg-transparent "
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="sm:w-[392px] w-full  h-auto border-2 border-primary rounded-2xl bg-background">
          <div className="mt-24">
            <Trash />
          </div>
          <p className="text-gray-dark text-center text-base font-normal pt-8">
            {
              selectedContent[
                localizationKeys.areYouSureYouWantToDeleteThisDraft
              ]
            }
          </p>
          <div className="flex justify-center gap-x-10 mt-10 mb-12">
            <button
              onClick={() => setOpen(false)}
              className="w-[136px] h-[48px] bg-white border-[1px] border-primary text-primary rounded-lg text-base font-normal ltr:font-serifEN rtl:font-serifAR"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
            <Button
              loading={isLoading}
              onClick={() => deleteAuction()}
              className="w-[136px] h-[48px] bg-primary hover:bg-primary-dark opacity-100 text-white rounded-lg text-base font-normal ltr:font-serifEN rtl:font-serifAR "
            >
              {selectedContent[localizationKeys.yesDelete]}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
