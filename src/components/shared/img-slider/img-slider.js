import { useEffect, useState } from "react";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";

const ImgSlider = ({
  images,
  auctionId,
  WatshlistState,
  onReload,
  isMyAuction,
}) => {
  const { user } = useAuthState();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    if (images) setSelectedImg(images && images[0]?.imageLink);
  }, [images]);

  const onImageClick = (image) => {
    setSelectedImg(image?.imageLink);
    setTimeout(() => setIsClicked(false), 300);
  };

  const [isWatshlist, setWatshlist] = useState(false);
  useEffect(() => {
    setWatshlist(WatshlistState);
  }, [WatshlistState]);

  const { run, isLoading } = useAxios([]);

  return (
    <div className=" shadow rounded-2xl group overflow-hidden ">
      <div
        className={`w-full h-[480px] relative rounded-2xl ${
          isClicked ? "" : ""
        }`}
        onClick={() => setIsClicked(true)}
      >
        {selectedImg && (
          <div className="w-full h-full absolute rounded-2xl z-10">
            <img
              className={`absolute -z-10 w-full h-full object-contain p-2  ${
                isClicked ? "animate-in" : ""
              }`}
              src={selectedImg}
              alt=""
            />
          </div>
        )}
        <div className="w-full h-full relative top-0 left-0 hover:bg-gradient-to-t group-hover:from-[#25252562] rounded-2xl z-10 cursor-pointer ">
          <div className="flex absolute bottom-7 ltr:md:left-4 rtl:md:right-4 ltr:left-0 rtl:right-0 z-20">
            {images?.map((image, index) => (
              <div
                className="w-full md:w-[89px] sm:h-[89px] h-[60px] rounded-2xl sm:mx-2.5 mx-1 object-contain cursor-pointer bg-background  "
                key={index}
                onClick={() => onImageClick(image)}
              >
                <img
                  className="w-full md:w-[89px] sm:h-[89px] h-[60px] object-contain rounded-2xl"
                  src={image.imageLink}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgSlider;
