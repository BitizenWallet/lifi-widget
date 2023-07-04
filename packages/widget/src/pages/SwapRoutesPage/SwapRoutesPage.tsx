/* eslint-disable react/no-array-index-key */
import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { useEffect } from 'react';
import { useHeaderActionStore } from '../../components/Header';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useNavigateBack, useSwapRoutes } from '../../hooks';
import { useSetExecutableRoute } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Stack } from './SwapRoutesPage.style';
import { motion } from 'framer-motion'
import { AppContainer } from '../../components/AppContainer';
import { FlexContainer } from '../../components/AppContainer';
import { Header } from '../../components/Header';
import { Initializer } from '../../components/Initializer';
import { PoweredBy } from '../../components/PoweredBy';
import { SwapRoutesExpanded } from '../../components/SwapRoutes';
import { useExpandableVariant } from '../../hooks';


export const SwapRoutesPage: React.FC<BoxProps> = () => {
  const { navigateBack, navigate } = useNavigateBack();
  const {
    routes: swapRoutes,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();
  const setExecutableRoute = useSetExecutableRoute();

  const handleRouteClick = (route: Route) => {
    setExecutableRoute(route);
    navigate(navigationRoutes.swapExecution, {
      state: { routeId: route.id },
    });
  };

  useEffect(() => {
    if (!swapRoutes?.length && !isLoading && !isFetching) {
      navigateBack();
    }
    // redirect to the home page if no routes are found on page reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return useHeaderActionStore
      .getState()
      .setAction(
        <ProgressToNextUpdate
          updatedAt={dataUpdatedAt || new Date().getTime()}
          timeToUpdate={refetchTime}
          isLoading={isFetching}
          onClick={() => refetch()}
          sx={{ marginRight: -1 }}
          size="medium"
          edge="end"
        />,
      );
  }, [dataUpdatedAt, isFetching, refetch, refetchTime]);

  const routeNotFound = !swapRoutes?.length && !isLoading && !isFetching;

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
          <Stack direction="column" spacing={2} flex={1}>
            {routeNotFound ? (
              <SwapRouteNotFoundCard />
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SwapRouteCardSkeleton key={index} />
              ))
            ) : (
              swapRoutes?.map((route: Route, index: number) => (
                <SwapRouteCard
                  key={route.id}
                  route={route}
                  onClick={() => handleRouteClick(route)}
                  active={index === 0}
                  expanded={swapRoutes?.length <= 2}
                />
              ))
            )}
          </Stack>
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </motion.div>
  );
};
