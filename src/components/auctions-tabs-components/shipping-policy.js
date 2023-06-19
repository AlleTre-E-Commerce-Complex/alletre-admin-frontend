import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="animate-in">
      <div>
        <h1 className="text-gray-dark text-base font-normal">
          US $9.64 Standard International Shipping.
          <p className="text-gray-med text-base font-normal py-2">
            International shipment of items may be subject to customs
            processingand additional charges.
          </p>
        </h1>
      </div>
      <div className="mt-4 mb-40">
        <div
          className={`flex bg-[#F2F2F2] drop-shadow my-2 py-3 rounded ${""}`}
        >
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            Located in:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            Pen Argyl, Pennsylvania, United States
          </p>
        </div>
        <div
          className={`flex bg-[#FEFEFE] drop-shadow my-2 py-3 rounded ${""}`}
        >
          <p className="text-gray-med font-normal text-sm px-5 w-1/2">
            Located in:
          </p>
          <p className="text-gray-dark font-normal text-sm flex justify-start w-full mx-auto ">
            Save money with combined shipping !! $0.75 each additional item !!!
            Also $0.50 each additional trading card !!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
