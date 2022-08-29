import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';
// Endpoint
export const url = 'http://localhost:8000';
// export const url = 'https://tiamoto.com/backend';

const initialState = {
  isLoading: false,
  error: null,
  caisse: { libellee: null, date: null, depense: 0, recette: 0, PJ: null, id: null, is_depense: false, is_moto: false },
  caisses: [],
  solde: { solde_initial: 0, solde_actuel: 0 },
  isEdit: false,
  show: false
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

    // GET CAISSES
    getCaisseSuccess(state, action) {
      state.isLoading = false;
      state.caisses = action.payload;
    },
    // SET CAISSE
    setCaisse(state, action) {
      state.isLoading = false;
      state.caisse = action.payload;
    },
    resetCaisse(state) {
      state.isLoading = false;
      state.caisse = {
        libellee: null,
        date: null,
        depense: 0,
        recette: 0,
        PJ: null,
        id: null,
        is_depense: false,
        is_moto: false
      };
    },
    // SET SOLDES
    setSolde(state, action) {
      state.isLoading = false;
      state.solde = action.payload;
    },
    // GET SOLDES
    getSoldeSuccess(state, action) {
      state.isLoading = false;
      state.solde = action.payload;
    },
    // SET EDIT
    setEdit(state, action) {
      state.isEdit = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload;
    }
  }
});

export default slice.reducer;
export const { setCaisse, setSolde, setEdit, resetCaisse, setShow } = slice.actions;

export function getCaisseListe() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: `${url}/api/caisseMotos`,
        responseType: 'stream'
      });
      dispatch(slice.actions.getCaisseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addCaisseMoto(caisseData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'post',
        url: `${url}/api/caisseMotos/add`,
        data: caisseData,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getCaisseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCaisseMoto(caisseData, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'put',
        url: `${url}/api/caisseMotos/update/${id}`,
        data: caisseData,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getCaisseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCaisse(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: `${url}/api/caisseMotos/get/${id}`,
        responseType: 'stream'
      });
      dispatch(slice.actions.setCaisse(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteCaisse(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'delete',
        url: `${url}/api/caisseMotos/delete/${id}`,

        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getCaisseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSolde() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'get',
        url: `${url}/api/soldes/`,
        responseType: 'stream'
      });
      dispatch(slice.actions.getSoldeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateSolde(dataUpdate) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'put',
        url: `${url}/api/soldes/update`,
        data: dataUpdate,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getSoldeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createOrUpdateFromMoto(dataUpload) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios({
        method: 'post',
        url: `${url}/api/caisseMotos/add_or_update`,
        data: dataUpload,
        responseType: 'stream',
        headers: {
          'Content-Type': 'application/json; charset= utf-8'
        }
      });
      dispatch(slice.actions.getCaisseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
