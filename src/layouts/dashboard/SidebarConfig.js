// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  banking: getIcon('ic_banking'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  {
    subheader: 'Tia moto',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Caisse', path: PATH_DASHBOARD.general.caisseMoto, icon: ICONS.banking }
    ]
  }
];

export default sidebarConfig;
