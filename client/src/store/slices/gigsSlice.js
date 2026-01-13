import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchGigs = createAsyncThunk('gigs/fetchGigs', async ({ q = '', page = 1 }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs?q=${q}&page=${page}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMyGigs', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/gigs/my-gigs');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const fetchGigById = createAsyncThunk('gigs/fetchGigById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/gigs/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createGig = createAsyncThunk('gigs/createGig', async (gigData, { rejectWithValue }) => {
    try {
        const response = await api.post('/gigs', gigData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const gigsSlice = createSlice({
    name: 'gigs',
    initialState: {
        gigs: [],
        currentGig: null,
        loading: false,
        error: null,
        page: 1,
        pages: 1,
        total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Gigs
            .addCase(fetchGigs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload.gigs;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Fetch My Gigs
            .addCase(fetchMyGigs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload;
            })
            .addCase(fetchMyGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Fetch Gig By ID
            .addCase(fetchGigById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGigById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGig = action.payload;
            })
            .addCase(fetchGigById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // Create Gig
            .addCase(createGig.fulfilled, (state, action) => {
                state.gigs.unshift(action.payload);
            });
    },
});

export default gigsSlice.reducer;
