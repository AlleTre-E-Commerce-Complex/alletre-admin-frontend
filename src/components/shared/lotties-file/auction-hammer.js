import Lottie from "react-lottie";
import animationData from "./auction-hammer.json";

const AuctionHammer = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="mt-6">
      <Lottie options={defaultOptions} height={110} width={130} />
    </div>
  );
};

export default AuctionHammer;
