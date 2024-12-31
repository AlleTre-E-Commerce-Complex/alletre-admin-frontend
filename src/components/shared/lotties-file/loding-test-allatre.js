import Lottie from "react-lottie";
import lodingTestAllatre from "./loding-test-allatre.json";
import loadingTest from "../../../../src/assets/logo/lodingIcon.gif";


const LodingTestAllatre = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lodingTestAllatre,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="mt-6 cursor-wait">
     <img 
      src={loadingTest} 
      alt="loading" 
      className="cursor-wait"
      style={{ width: "550px", height: "auto" }}
      />
    </div>
  );
};

export default LodingTestAllatre;
