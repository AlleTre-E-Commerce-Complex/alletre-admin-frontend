import React, { useEffect, useState } from "react";
import useGetGatogry from "../../../hooks/use-get-category";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";
import CategoryCard from "../../../components/category-components/category-card";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";

const SubCategory = () => {
  const { SubGatogryOptions, loadingSubGatogry, onReload } = useGetSubGatogry();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingSubGatogry}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Sub Gatogry</h1>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md "></div>
    </div>
  );
};

export default SubCategory;
