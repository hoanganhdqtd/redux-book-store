import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apiService";

const initialState = {
  books: [],
  pageNum: 1,
  status: "",
  bookDetail: "",
  readingList: [],
};

// export const fetchBooks = async ({ pageNum, limit, query }) => {
//   try {
//     let url = `/books?_page=${pageNum}&_limit=${limit}`;
//     if (query) url += `&q=${query}`;
//     const res = await api.get(url);
//     return res;
//   } catch (error) {
//     return error;
//   }
// };

// export const fetchBooks = createAsyncThunk(
//   "books/fetchBooks",
//   async ({ pageNum, limit, query }) => {
//     let url = `/books?_page=${pageNum}&_limit=${limit}`;
//     if (query) url += `&q=${query}`;
//     const res = await api.get(url);
//     return res.data;
//   }
// );

const fetchBooks = async ({ pageNum, limit, query }) => {
  try {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const fetchData = createAsyncThunk("books/fetchData", async (props) => {
  const response = await fetchBooks(props);
  return response;
});

export const fetchBookDetail = createAsyncThunk(
  "books/fetchBookDetail",
  async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);

export const addToReadingList = createAsyncThunk(
  "books/addToReadingList",
  async (book) => {
    const response = await api.post(`/favorites`, book);
    return response.data;
  }
);

export const fetchReadingList = createAsyncThunk(
  "books/fetchReadingList",
  async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  }
);

export const removeBook = createAsyncThunk(
  "books/removeBook",
  async (removedBookId) => {
    const response = await api.delete(`/favorites/${removedBookId}`);

    console.log(response);
    return response.data;
  }
);

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducer: {
    changePage: (state, action) => {
      console.log("changePage", action.payload);
      state.pageNum = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(fetchBooks.pending, (state, action) => {
    //     // Add user to the state array
    //     state.status = "loading";
    //   })
    //   .addCase(fetchBooks.fulfilled, (state, action) => {
    //     state.status = "";
    //     state.books = action.payload;
    //   })
    //   .addCase(fetchBooks.rejected, (state, action) => {
    //     // state.loading = false;
    //     state.status = "rejected";

    //     console.log(action.error.message);
    //   });

    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "";
        state.books = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "rejected";
      });

    builder
      .addCase(addToReadingList.pending, (state) => {})
      .addCase(addToReadingList.fulfilled, (state, action) => {
        console.log(action.payload);
        console.log("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        console.log(action.error.message);
      });

    builder
      .addCase(fetchReadingList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReadingList.fulfilled, (state, action) => {
        state.status = "";
        state.readingList = action.payload;
      })
      .addCase(fetchReadingList.rejected, (state, action) => {
        state.status = "failed";
      });

    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.status = "";
        console.log("The book has been removed");
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = "failed";
        console.log("Failed to remove");
      });

    builder
      .addCase(fetchBookDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        state.status = "";
        state.bookDetail = action.payload;
      })
      .addCase(fetchBookDetail.rejected, (state, action) => {
        state.status = "Failed to fetch book's detail";
      });
  },
});

const { reducer } = bookSlice;

export default reducer;
