import Lottie from "react-lottie";
import animationData from "./trash-lotifile.json";

const Trash = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={70} width={70} />
    </div>
  );
};

export default Trash;
