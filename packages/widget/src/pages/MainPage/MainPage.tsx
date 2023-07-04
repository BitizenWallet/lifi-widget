import { Box } from '@mui/material';
import { ActiveSwaps } from '../../components/ActiveSwaps';
import { ContractComponent } from '../../components/ContractComponent';
import { GasRefuelMessage } from '../../components/GasMessage';
import { SelectChainAndToken } from '../../components/SelectChainAndToken';
import {
  SendToWallet,
  SendToWalletButton,
} from '../../components/SendToWallet';
import { SwapInput } from '../../components/SwapInput';
import { SwapRoutes } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { MainGasMessage } from './MainGasMessage';
import { FormContainer } from './MainPage.style';
import { MainSwapButton } from './MainSwapButton';
import { AppContainer } from '../../components/AppContainer';
import { FlexContainer } from '../../components/AppContainer';
import { Header } from '../../components/Header';
import { Initializer } from '../../components/Initializer';
import { PoweredBy } from '../../components/PoweredBy';
import { SwapRoutesExpanded } from '../../components/SwapRoutes';

export const MainPage: React.FC = () => {
  const expandable = useExpandableVariant();
  const { variant } = useWidgetConfig();
  const nft = variant === 'nft';
  return (
    <>
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <FormContainer disableGutters>
            <ActiveSwaps mx={2.6} mt={1} mb={1} />
            {nft ? <ContractComponent mx={3} mt={1} mb={1} /> : null}
            <SelectChainAndToken mt={1} mx={2.6} mb={2} />
            {!nft ? <SwapInput formType="from" mx={2.6} mb={2} /> : null}
            {!expandable ? <SwapRoutes mx={2.6} mb={2} /> : null}
            {/* <SendToWallet mx={3} mb={2} /> */}
            {/* <GasRefuelMessage mx={3} mb={2} /> */}
            {/* <MainGasMessage mx={3} mb={2} /> */}
            {/* <Box height={'48px'}></Box> */}
            <Box display="flex" mx={2.6} mb={1}
            // style={{ position: 'fixed', bottom: '10px', width: 'calc(100% - 48px)', maxWidth: '552px', minWidth: '270px', zIndex: 9999 }}
            >
              <MainSwapButton />
              {/* <SendToWalletButton /> */}
            </Box>
          </FormContainer>
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </ >
  );
};
