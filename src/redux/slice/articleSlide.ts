import { callFetchArticle } from "@/config/api";
import { IArticles } from "@/types/backend";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IArticles[]
}
export const fetchArticle = createAsyncThunk(
    'article/fetchArticle',
    async ({ query }: { query: string }) => {
        const response = await callFetchArticle(query);
        return response;
    }
)

const initialState: IState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    },
    result: []
};

export const articleSlide = createSlice({
    name: 'article',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchArticle.pending, (state) => {
            state.isFetching = true
        });
        builder.addCase(fetchArticle.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchArticle.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })

    }
})

export const { setActiveMenu } = articleSlide.actions;

export default articleSlide.reducer