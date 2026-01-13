import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBidsByGigId = createAsyncThunk('bids/fetchBidsByGigId', async (gigId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/bids/${gigId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createBid = createAsyncThunk('bids/createBid', async (bidData, { rejectWithValue }) => {
    try {
        const response = await api.post('/bids', bidData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const hireFreelancer = createAsyncThunk('bids/hireFreelancer', async (bidId, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/bids/${bidId}/hire`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const bidsSlice = createSlice({
    name: 'bids',
    initialState: {
        bids: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Bids
            .addCase(fetchBidsByGigId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBidsByGigId.fulfilled, (state, action) => {
                state.loading = false;
                state.bids = action.payload;
            })
            .addCase(fetchBidsByGigId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Create Bid
            .addCase(createBid.fulfilled, (state, action) => {
                state.bids.push(action.payload);
            })
            // Hire Freelancer
            .addCase(hireFreelancer.fulfilled, (state, action) => {
                // Update the specific bid status
                const index = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
                if (index !== -1) {
                    state.bids[index] = action.payload.bid;
                }
                // Update other bids to rejected
                state.bids.forEach(bid => {
                    if (bid._id !== action.payload.bid._id) {
                        bid.status = 'rejected';
                    }
                });
            });
    },
});

export default bidsSlice.reducer;
