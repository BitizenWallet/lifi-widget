import { Box, Container } from '@mui/material';
import { ColorSchemeButtonGroup } from './ColorSchemeButtonGroup';
import { EnabledToolsButton } from './EnabledToolsButton';
import { GasPriceSelect } from './GasPriceSelect';
import { LanguageSelect } from './LanguageSelect';
import { ResetSettingsButton } from './ResetSettingsButton';
import { RoutePrioritySelect } from './RoutePrioritySelect';
import { ShowDestinationWallet } from './ShowDestinationWallet';
import { SlippageInput } from './SlippageInput';
import LiFiLogo from "../../icons/LiFiLogo.png";
import { motion } from 'framer-motion'
import { AppContainer } from '../../components/AppContainer';
import { FlexContainer } from '../../components/AppContainer';
import { Header } from '../../components/Header';
import { Initializer } from '../../components/Initializer';
import { PoweredBy } from '../../components/PoweredBy';
import { SwapRoutesExpanded } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';

export const SettingsPage = () => {
  const expandable = useExpandableVariant();

  return (
    <motion.div
      initial={{ x: '100vw' }}
      animate={{ x: 0 }}
      exit={{ x: ['10vw', '50vw', '100vw'] }}
      transition={{ duration: 0.4, bounce: false, ease: 'easeInOut' }}
    >
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <Container disableGutters>
            <Box px={2.5} pt={1}>
              <ColorSchemeButtonGroup />
              <LanguageSelect />
              <RoutePrioritySelect />
              <Box sx={{ display: 'flex', alignItems: 'center' }} mt={2}>
                <Box pr={2} flex={1}>
                  <SlippageInput />
                </Box>
                <GasPriceSelect />
              </Box>
            </Box>
            <ShowDestinationWallet />
            <Box px={1.5}>
              <EnabledToolsButton type="Bridges" />
              <EnabledToolsButton type="Exchanges" />
            </Box>
            <ResetSettingsButton />
            <p style={{
              display: "flex",
              position: "absolute",
              bottom: 10,
              justifyContent: "center",
              width: '100vw',
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '14px',
            }}>
              Powered by <img style={{
                marginLeft: "7px",
              }} src={LiFiLogo} />
            </p>
          </Container>
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </motion.div>
  );
};
