import React, { useEffect } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import { Dimmer } from "semantic-ui-react";
import useGetALLBrand from "../../../hooks/use-get-all-brands";

const Brands = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingAllBranOptions}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">All Brands</h1>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md ">
        <div className="flex flex-wrap gap-5">
          {AllBranOptions?.map((e) => (
            <div className="bg-white shadow-md p-3 rounded-lg text-gray-dark hover:scale-105 delay-75 duration-75 transform cursor-pointer">
              {e?.text}
            </div>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
};

export default Brands;
