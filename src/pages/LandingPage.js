// material
import { styled } from '@material-ui/core/styles';
// components
import Page from '../components/Page';
import { LandingHero, LandingDarkMode, LandingThemeColor } from '../sections/landing';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <RootStyle title="Leader Scoot" id="move_top">
      <LandingHero />
      <ContentStyle>
        <LandingDarkMode />
        <LandingThemeColor />
      </ContentStyle>
    </RootStyle>
  );
}
