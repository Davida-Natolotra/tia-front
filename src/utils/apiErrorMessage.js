// Readable reason from a failed backend request, for error messages.
// DRF answers e.g. {"detail": "..."} or {"PJ_CIN_Client_2_recto": ["..."]}.
export function apiErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return '';
  if (typeof data === 'string') return data.length <= 200 ? data : '';
  if (data.detail) return String(data.detail);
  const first = Object.values(data).flat()[0];
  return first ? String(first) : '';
}

// "Erreur d'enregistrement", followed by the backend's reason when there is one.
export const saveErrorMessage = (error) => {
  const reason = apiErrorMessage(error);
  return reason ? `Erreur d'enregistrement : ${reason}` : "Erreur d'enregistrement";
};
