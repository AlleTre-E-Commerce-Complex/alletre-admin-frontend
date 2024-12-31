import { createSlice } from "@reduxjs/toolkit";

export const deliveryRequestsSlice = createSlice({
    name:'deliveryRequests',
    initialState: {
        deliveryRequests: [],
        deliveryRequestsCount : 0,
    },
    reducers: {
        setDeliveryRequests: (state, action) => {
            state.deliveryRequests = action.payload.deliveryRequests;
            state.deliveryRequestsCount = action.payload.deliveryRequestsCount;
        }
    }
})

export const { setDeliveryRequests } = deliveryRequestsSlice.actions
export default  deliveryRequestsSlice.reducer;