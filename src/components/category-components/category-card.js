import React from "react";
import CategoryUplodImgModel from "./category-uplod-img-model";
import addimage from "../../../src/assets/icons/add-image-icon.png";

const CategoryCard = ({ GatogryOptions, onReload, setCategoryId, setShowModal }) => {
  console.log("====================================");
  console.log({ GatogryOptions });
  console.log("====================================");
  return (
    <div className="flex gap-10 flex-wrap py-4 ">
      {GatogryOptions?.map((e) => (
        <div className="relative  ">
          <div className="group hover:border-primary border-transparent border-[1px] shadow w-[300px] h-[240px] rounded-xl  bg-white mx-auto cursor-pointer overflow-hidden ">
            <div
              className="group w-[300px] h-[240px]  rounded-xl
                hover:bg-gradient-to-t hover:from-[#25252562] absolute z-20 "
            >
              <CategoryUplodImgModel
                bannerLink={e?.bannerLink || addimage}
                sliderLink={e?.sliderLink || addimage}
                bannerLinkAr={e?.bannerLinkAr || addimage}
                text={e?.text}
                id={e?.value}
                onReload={onReload}
              />
            </div>
            <img
              className="w-full h-40 object-cover rounded-lg group-hover:scale-110 duration-300 ease-in-out transform"
              src={e?.bannerLink || e?.bannerLinkAr || addimage}
              alt="bannerLink"
            />
            <div className="rounded-full w-32 h-32 absolute top-[100px] left-8 flex gap-x-5">
              <img
                className="w-full h-full object-cover rounded-full group-hover:scale-110 duration-300 ease-in-out transform"
                src={e?.sliderLink || e?.sliderLinkAr || addimage}
                alt="sliderLink"
              />
              <h1 className="text-gray-dark mx-auto mt-[64px] font-semibold group-hover:scale-110 duration-300 ease-in-out transform">
                {e?.text}
              </h1>
            </div>
          </div>
          <button
       className="bg-primary text-white mb-2 mt-4 px-4 py-2 w-full rounded-md hover:bg-primary-dark"
       onClick={()=>{
        setShowModal(true)
        setCategoryId(e?.key)
       }}
      >
        Edit category
      </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
