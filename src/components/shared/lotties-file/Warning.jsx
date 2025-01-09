import React from 'react'
import warningLottie from './Warning.json'
import Lottie from 'react-lottie';
const Warning = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: warningLottie,
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

export default Warning
