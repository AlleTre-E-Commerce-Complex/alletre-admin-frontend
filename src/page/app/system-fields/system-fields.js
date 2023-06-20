import React, { useEffect } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import { Dimmer } from "semantic-ui-react";
import useGetALLBrand from "../../../hooks/use-get-all-brands";
import useGetAllSysFields from "../../../hooks/use-get-all-sys-fields";

const SystemFields = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const { AllSysFieldsOptions, loadingAllSysFieldsOptions } =
    useGetAllSysFields();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingAllSysFieldsOptions}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">
        All System Fields
      </h1>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md ">
        <div className="flex flex-wrap gap-5">
          {AllSysFieldsOptions?.map((e) => (
            <div className="bg-white shadow-md p-3 rounded-lg hover:scale-105 delay-75 duration-75 transform cursor-pointer ">
              <li className="text-gray-med">
                <span className="text-gray-dark pr-2">Key:</span>
                {e?.key}
              </li>
              <li className="text-gray-med">
                <span className="text-gray-dark pr-2">Type:</span>
                {e?.type}
              </li>
              <li className="text-gray-med">
                {" "}
                <span className="text-gray-dark pr-2">Label English:</span>
                {e?.labelEn}
              </li>
              <li className="text-gray-med ">
                <span className="text-gray-dark pr-2 font-serifAR">
                  Lable Arabic:
                </span>
                <span className="font-serifAR">{e?.labelAr}</span>
              </li>
            </div>
          ))}
        </div>
        <div />
      </div>
    </div>
  );
};

export default SystemFields;
