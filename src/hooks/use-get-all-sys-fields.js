import React, { useEffect } from "react";
import api from "../api";
import { authAxios, axios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetAllSysFields = () => {
  const [lang] = useLanguage();
  const [AllSysFieldsOptions, setSysFieldsOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.systemField.default)).then(({ data }) => {
      const AllOptions = data.data;
      const options = [];

      console.log("====================================");
      console.log(AllOptions);
      console.log("====================================");

      AllOptions.forEach((d) =>
        options.push({
          key: d?.key,
          type: d?.type,
          resKey: d.resKey,
          labelEn: d?.labelEn,
          labelAr: d?.labelAr,
        })
      );

      setSysFieldsOptions(options);
    });
  }, [lang, run]);

  return {
    AllSysFieldsOptions,
    loadingAllSysFieldsOptions: isLoading,
    errorAllSysFieldsOptions: error,
    isErrorAllSysFieldsOptions: isError,
  };
};

export default useGetAllSysFields;
