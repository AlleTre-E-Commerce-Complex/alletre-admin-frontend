import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import api from "../../api";
import { axios } from "../../config/axios-config";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const ItemDetails = ({ itemDetailsData }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [sysField, setSysField] = useState([]);
  const itemDetailsDataObject = Object.keys(itemDetailsData || {});
  const itemDetailsArray = sysField
    .map((field) => {
      const matchedKey = itemDetailsDataObject.find(
        (key) => key === field.resKey
      );
      if (!matchedKey) return null;
      return {
        label: {
          en: field?.labelEn,
          ar: field?.labelAr,
        },
        value: itemDetailsData?.[matchedKey],
      };
    })
    .filter((item) => item !== null);

  const { run: runSysField, isLoading: isLoadingysField } = useAxios([]);

  useEffect(() => {
    runSysField(
      axios.get(api.app.customField.systemField).then((res) => {
        setSysField(res?.data?.data?.filter((field) => !!field) || []);
      })
    );
  }, [runSysField]);

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingysField}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="animate-in ">
        {/* item description */}
        <div
          id="itemDescription"
          className="text-gray-dark text-base font-normal"
        >
          <h1 className="pb-8">
            {selectedContent[localizationKeys.aboutTheBrand]}:
          </h1>
          <p>{itemDetailsData?.description}</p>
        </div>
        <div className="grid sm:grid-rows-5 sm:grid-flow-col gap-x-4 mt-4 mb-20">
          {itemDetailsArray.map((field, index) => {
            const colors = ["bg-[#F2F2F2]", "bg-[#FEFEFE]"];
            const bgColor = colors[index % colors.length];
            return (
              <div
                className={`flex ${bgColor} drop-shadow my-2 py-3 rounded ${
                  itemDetailsArray.length > 4 ? "w-auto" : "sm:w-1/2 w-auto "
                }`}
                key={index}
              >
                <p className="text-gray-med font-normal text-sm  px-5 w-1/2">
                  {field?.label[lang]} :
                </p>
                <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
                  {field.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ItemDetails;
