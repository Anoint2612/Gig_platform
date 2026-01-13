import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            state.unreadCount = 0;
        },
    },
});

export const { addNotification, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
