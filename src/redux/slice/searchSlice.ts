import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISearchTemp {
    location: string[];
    skills: string[];
}

// Khởi tạo state ban đầu
const initialState: ISearchTemp = {
    location: [],
    skills: []
};

const searchSlice = createSlice({
    name: 'searchTemp',
    initialState,
    reducers: {
        // Hàm cập nhật searchTemp
        setSearchTemp(state, action: PayloadAction<ISearchTemp>) {
            state.location = action.payload.location;
            state.skills = action.payload.skills;
        }
    }
});

// Xuất ra action và reducer
export const { setSearchTemp } = searchSlice.actions;
export default searchSlice.reducer;