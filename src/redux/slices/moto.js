import { sum, map, filter, uniqBy, reject } from 'lodash';
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
  chartSelect: 'Hebdomadaire'
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
