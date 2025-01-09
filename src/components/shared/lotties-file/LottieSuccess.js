import React from 'react'
import SuccessLottie from './lottieSuccess.json'
import Lottie from 'react-lottie';
const LottieSuccess = () => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: SuccessLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
  return (
    <div>
      <div className="mt-2">
      <Lottie options={defaultOptions} height={110} width={130} />
    </div>
    </div>
  )
}

export default LottieSuccess
