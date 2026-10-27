// Address of the site printed in the QR code on each invoice, e.g. "https://leaderscoot.mg".
// Set it in production so every QR code points there, wherever the invoice is printed from.
// Without it, the QR code uses the address of the page the invoice is printed from.
const SITE_URL = process.env.REACT_APP_SITE_URL;

// Link encoded in an invoice's QR code: its Facture page (managers only, after login).
export function factureUrl(token, siteUrl = SITE_URL || window.location.origin) {
  return `${siteUrl.replace(/\/+$/, '')}/facture/${token}`;
}
