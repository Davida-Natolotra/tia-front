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
  lastID: 0,
  numWord: '',
  venteToday: [],
  currentData: {}
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
    getNumberWordSuccess(state, action) {
      state.isLoading = false;
      state.numWord = action.payload;
    },
    getVenteTodaySuccess(state, action) {
      state.isLoading = false;
      state.venteToday = action.payload;
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
    },
    getLastResponseMotoSuccess(state, action) {
      state.isLoading = false;
      state.currentData = action.payload;
    },
    resetCurrentData(state, action) {
      state.currentData = {};
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { filterDisplay, setChartSelect, resetCurrentData } = slice.actions;

// ----------------------------------------------------------------------

export function getMotos() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/');
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
        url: '/api/motos',
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
      const response = await axios.get('/api/', {
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
        url: '/api/motos/chart_hebdo_api',
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
        url: '/api/motos/chart_monthly_api',
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
        url: '/api/motos/stock_level_api',
        responseType: 'stream'
      });
      dispatch(slice.actions.getStockSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getVenteToday() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: '/api/motos/venteToday_API',
        responseType: 'stream'
      });
      dispatch(slice.actions.getVenteTodaySuccess(response.data));
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
        url: '/api/motos/last_facture_api',
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
        url: '/api/motos/last_BL_api',
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
        url: '/api/motos/ID_Last_API',
        responseType: 'stream'
      });
      dispatch(slice.actions.getLastIDSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getNumberWord(number) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: '/api/motos/total2word_API',
        responseType: 'stream',
        params: {
          number
        }
      });
      dispatch(slice.actions.getNumberWordSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addMoto(motoData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'post',
        url: '/api/motos/createMoto',
        data: motoData,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getLastResponseMotoSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateMoto(motoData, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'put',
        url: `/api/motos/updateMoto/${id}`,
        data: motoData,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getLastResponseMotoSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
