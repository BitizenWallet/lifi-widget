import type { ExtendedChain } from '@lifi/sdk';
import { Avatar, Container, List, ListItemAvatar } from '@mui/material';
import { useChainSelect } from '../../components/ChainSelect';
import { ListItemButton } from '../../components/ListItemButton';
import { ListItemText } from '../../components/ListItemText';
import { useTokenSelect } from '../../components/TokenList';
import { useNavigateBack } from '../../hooks';
import type { SelectChainPageProps } from './types';
import { motion } from 'framer-motion'
import { AppContainer } from '../../components/AppContainer';
import { FlexContainer } from '../../components/AppContainer';
import { Header } from '../../components/Header';
import { Initializer } from '../../components/Initializer';
import { PoweredBy } from '../../components/PoweredBy';
import { SwapRoutesExpanded } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';

export const SelectChainPage: React.FC<SelectChainPageProps> = ({
  formType,
  selectNativeToken,
}) => {
  const { navigateBack } = useNavigateBack();
  const { chains, setCurrentChain } = useChainSelect(formType);
  const selectToken = useTokenSelect(formType, navigateBack);

  const handleClick = async (chain: ExtendedChain) => {
    if (selectNativeToken) {
      selectToken(chain.nativeToken.address, chain.id);
    } else {
      setCurrentChain(chain.id);
      navigateBack();
    }
  };

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
            <List
              sx={{
                paddingLeft: 1.5,
                paddingRight: 1.5,
              }}
            >
              {chains?.map((chain) => (
                <ListItemButton key={chain.id} onClick={() => handleClick(chain)}>
                  <ListItemAvatar>
                    <Avatar src={chain.logoURI} alt={chain.name}>
                      {chain.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={chain.name} />
                </ListItemButton>
              ))}
            </List>
          </Container>
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </motion.div>
  );
};
