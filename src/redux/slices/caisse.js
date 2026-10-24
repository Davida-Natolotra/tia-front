import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';
import moment from 'moment';
// Endpoint
export const url = process.env.REACT_APP_BACKEND_URL;
// export const url = 'https://tiamoto.com/backend';

const initialState = {
  isLoading: false,
  error: null,
  caisse: { libellee: null, date: null, depense: 0, recette: 0, PJ: null, id: null, is_depense: false, is_moto: false },
  caisses: [],
  solde: { solde_initial: 0, solde_actuel: 0 },
  // Set once the server answered, so the balance is never saved from empty defaults
  isCaissesLoaded: false,
  isSoldeLoaded: false,
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
      state.isCaissesLoaded = true;
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
      state.isSoldeLoaded = true;
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
        url: `${url}/api/caisseMotos`
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
        url: `${url}/api/caisseMotos/get/${id}`
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
        url: `${url}/api/soldes/`
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

// Cash book entry for a sold moto, in the shape /caisseMotos/add_or_update expects
export function caisseEntryFromMoto(moto) {
  return {
    libellee: `Vente du moto ${moto.nom_moto}-${moto.num_moteur}`,
    date: moment(moto.date_vente).format('YYYY-MM-DD'),
    recette: Number(moto.PV),
    depense: 0,
    is_depense: false,
    is_moto: true,
    id_moto: Number(moto.ID_Moto)
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
