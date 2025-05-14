import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetGatogry = () => {
  const [lang] = useLanguage();
  const [GatogryOptions, setGatogryOptions] = React.useState([]);
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
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
          sliderLink: d?.sliderLink,
          bannerLink: d?.bannerLink,
          sliderLinkAr: d?.sliderLinkAr,
          bannerLinkAr: d?.bannerLinkAr,
          hasUsageCondition: d?.hasUsageCondition,
        })
      );

      setGatogryOptions(options);
    });
  }, [lang, run, forceReload]);

  return {
    GatogryOptions,
    onReload,
    loadingGatogry: isLoading,
    errorGatogry: error,
    isErrorGatogry: isError,
  };
};

export default useGetGatogry;
