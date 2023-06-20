import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetSubGatogry = (categoryId) => {
  const [lang] = useLanguage();
  const [SubGatogryOptions, setSubGatogryOptions] = React.useState([]);
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (categoryId) {
      run(axios.get(api.app.subCategory.default(categoryId))).then(
        ({ data }) => {
          const SubGatogryOptions = data.data;
          const options = [];

          SubGatogryOptions.forEach((d) =>
            options.push({
              text: lang === "en" ? d?.nameEn : d?.nameAr,
              key: d?.id,
              value: d.id,
              imageLink: d?.imageLink,
            })
          );
          setSubGatogryOptions(options);
        }
      );
    }
  }, [forceReload, categoryId]);

  return {
    SubGatogryOptions,
    onReload,
    loadingSubGatogry: isLoading,
    errorSubGatogry: error,
    isErrorSubGatogry: isError,
  };
};

export default useGetSubGatogry;
