import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { useHeaderActionStore } from '../../components/Header';
import { useWallet } from '../../providers';
import { useRouteExecutionStore } from '../../stores';
import { useSwapHistory } from '../../stores/routes';
import { SwapHistoryEmpty } from './SwapHistoryEmpty';
import { SwapHistoryItem } from './SwapHistoryItem';
import { motion } from 'framer-motion'
import { AppContainer } from '../../components/AppContainer';
import { FlexContainer } from '../../components/AppContainer';
import { Header } from '../../components/Header';
import { Initializer } from '../../components/Initializer';
import { PoweredBy } from '../../components/PoweredBy';
import { SwapRoutesExpanded } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';

export const SwapHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const swaps = useSwapHistory(account.address);
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (swaps.length) {
      return useHeaderActionStore.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon style={{ fontSize: '25px' }} />
        </IconButton>,
      );
    }
  }, [swaps.length, toggleDialog]);

  let body;

  if (!swaps.length) {
    body = <SwapHistoryEmpty />;
  } else {

    body =
      <Container sx={(theme) => ({
        [theme.breakpoints.up('xs')]: {
          padding: theme.spacing(0, 2.6),
        },
      })}>
        <Stack spacing={2} mt={1}>
          {swaps.length ? (
            swaps.map(({ route }) => (
              <SwapHistoryItem key={route.id} route={route} />
            ))
          ) : (
            <SwapHistoryEmpty />
          )}
        </Stack>
        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle>{t('swap.warning.title.deleteSwapHistory')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('swap.warning.message.deleteSwapHistory')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
            <Button
              variant="contained"
              onClick={() => deleteRoutes('completed')}
              autoFocus
            >
              {t('button.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container >
      ;
  }

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
          {body}
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </motion.div>
  );
};
