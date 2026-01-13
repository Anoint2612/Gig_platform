import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('user'),
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('user');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
