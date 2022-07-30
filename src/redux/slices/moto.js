import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  products: [],
  product: null,
  display: 1,
  motosHebdo: { date: [], data: [], nb: [] },
  motosMonth: { date: [], data: [], nb: [] },
  chartSelect: 'Hebdomadaire',
  stock: 0,
  lastFacture: 0,
  lastBL: 0,
  lastID: 0
};

const slice = createSlice({
  name: 'motos',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },
    getMotosHebdoSuccess(state, action) {
      state.isLoading = false;
      state.motosHebdo = action.payload;
      state.motosHebdo.date = action.payload.date.map((date) =>
        new Date(date).toLocaleDateString('fr-fr', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      );
      console.log(`dates: ${state.motosHebdo.date}`);
    },
    getMotosMonthSuccess(state, action) {
      state.isLoading = false;
      state.motosMonth = action.payload;
      state.motosMonth.date = action.payload.date.map((date) =>
        new Date(date).toLocaleDateString('fr-fr', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      );
      console.log(`dates: ${state.motosMonth.date}`);
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },
    filterDisplay(state, action) {
      state.display = action.payload;
    },
    setChartSelect(state, action) {
      state.chartSelect = action.payload;
    },

    getStockSuccess(state, action) {
      state.isLoading = false;
      state.stock = action.payload;
    },
    getLastFactureSuccess(state, action) {
      state.isLoading = false;
      state.lastFacture = action.payload;
    },
    getLastBLSuccess(state, action) {
      state.isLoading = false;
      state.lastBL = action.payload;
    },
    getLastIDSuccess(state, action) {
      state.isLoading = false;
      state.lastID = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { filterDisplay, setChartSelect } = slice.actions;

// ----------------------------------------------------------------------

export function getMotos() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8000/api/');
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getMotosByDate(newDateDebut, newDateFin) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos',
        responseType: 'stream',
        params: {
          dateEntree: newDateDebut,
          dateFin: newDateFin
        }
      });
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMoto(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:8000/api/', {
        params: { id }
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMotosHebdo(newDateDebut, newDateFin) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/chart_hebdo_api',
        responseType: 'stream',
        params: {
          dateEntree: newDateDebut,
          dateFin: newDateFin
        }
      });
      dispatch(slice.actions.getMotosHebdoSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getMotosMonthly(date) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/chart_monthly_api',
        responseType: 'stream',
        params: {
          month: date
        }
      });
      dispatch(slice.actions.getMotosMonthSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getStock() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/stock_level_api',
        responseType: 'stream'
      });
      dispatch(slice.actions.getStockSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getLastFacture() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/last_facture_api',
        responseType: 'stream'
      });
      dispatch(slice.actions.getLastFactureSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getLastBL() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/last_BL_api',
        responseType: 'stream'
      });
      dispatch(slice.actions.getLastBLSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getLastID() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/motos/ID_Last_API',
        responseType: 'stream'
      });
      dispatch(slice.actions.getLastIDSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
