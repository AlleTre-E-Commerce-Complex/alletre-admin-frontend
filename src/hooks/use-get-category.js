import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetGatogry = () => {
  const [lang] = useLanguage();
  const [GatogryOptions, setGatogryOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.category.default)).then(({ data }) => {
      const GatogryOptions = data.data;
      const options = [];

      GatogryOptions.forEach((d) =>
        options.push({
          text: lang === "en" ? d?.nameEn : d?.nameAr,
          key: d?.id,
          value: d.id,
          hasUsageCondition: d?.hasUsageCondition,
        })
      );

      setGatogryOptions(options);
    });
  }, [lang, run]);

  return {
    GatogryOptions,
    loadingGatogry: isLoading,
    errorGatogry: error,
    isErrorGatogry: isError,
  };
};

export default useGetGatogry;
