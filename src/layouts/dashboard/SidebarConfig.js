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

// DashboardSidebar picks one entry by role: [0] for every role except commercial, [1] for commercial.
const sidebarConfig = [
  {
    subheader: 'Leader Scoot',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Caisse', path: PATH_DASHBOARD.general.caisseMoto, icon: ICONS.banking }
    ]
  },
  // Commercial: no access to the Caisse
  {
    subheader: 'Leader Scoot',
    items: [{ title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }]
  }
];

export default sidebarConfig;
