import Lottie from "react-lottie";
import paymentsucsess from "./payment-sucsess.json";

const PaymentSucsess = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: paymentsucsess,
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

export default PaymentSucsess;
