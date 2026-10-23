import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import gridFill from '@iconify/icons-eva/grid-fill';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Accueil',
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
    path: '/'
  },
  {
    title: 'Dashboard',
    icon: <Icon icon={gridFill} {...ICON_SIZE} />,
    path: PATH_DASHBOARD.root
  }
];

export default menuConfig;
