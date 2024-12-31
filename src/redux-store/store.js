import { configureStore } from "@reduxjs/toolkit";
import deliveryRequestsSlice from "./delivery-requests-slice";

export const store = configureStore({
    reducer: {
        deliveryRequests: deliveryRequestsSlice,
    }
})