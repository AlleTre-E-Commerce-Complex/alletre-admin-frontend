
import React from "react";
import { Modal } from "semantic-ui-react";
import content from "../../../localization/content";

import LottieSuccess from "../lotties-file/LottieSuccess";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "../../../routes";
import { useLanguage } from "../../../context/language-context";
const SuccessModal = ({open, setOpen,message,returnUrl,isWithdrawal,isAddAccount,closeAddNewBankAccountModal}) => {
    const history = useHistory()
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    
    const HandleSubmit = () => {
        setOpen(false)
        history.push(returnUrl)
    };
  


  
    return (
      <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onOpen={() => setOpen(true)}
        open={open}
      >
        <div className=" sm:w-[500px] h-auto rounded-2xl bg-white border-2 border-primary">
            <LottieSuccess/>
        <div className='px-3 py-2 mt-5 text-center font-semibold text-lg' >
            <h1>{message}</h1>
        </div>
          <div className="gap-3 flex justify-center">
            <button
              className="bg-primary hover:bg-primary-light border border-primary-light text-white py-2 px-3 rounded-md my-2"
              onClick={HandleSubmit}
            >
                OK
            </button>
          </div>
        </div>
      </Modal>
    );
}

export default SuccessModal

