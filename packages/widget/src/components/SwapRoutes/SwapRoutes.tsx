import type { BoxProps } from '@mui/material';
import { Box, Button, ButtonBase, Collapse } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardTitle } from '../../components/Card';
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate';
import {
  SwapRouteCard,
  SwapRouteCardSkeleton,
  SwapRouteNotFoundCard,
} from '../../components/SwapRouteCard';
import { useSwapRoutes } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import { SVGProps } from 'react';

const ArrowIcon = (props: SVGProps<SVGSVGElement>) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <path d="M7.48568 5.99965L3.77139 9.77108L4.57139 10.5711L9.14282 5.99965L4.57139 1.42822L3.77139 2.22822L7.48568 5.99965Z" fill="white" fill-opacity="0.5" />
</svg>);

export const SwapRoutes: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { variant, useRecommendedRoute } = useWidgetConfig();
  const { isValid, isValidating } = useFormState();
  const {
    routes,
    isLoading,
    isFetching,
    isFetched,
    dataUpdatedAt,
    refetchTime,
    refetch,
  } = useSwapRoutes();

  const currentRoute = routes?.[0];

  if (!currentRoute && !isLoading && !isFetching && !isFetched) {
    return null;
  }

  const handleCardClick = () => {
    navigate(navigationRoutes.swapRoutes);
  };

  const routeNotFound = !currentRoute && !isLoading && !isFetching;
  const onlyRecommendedRoute = variant === 'refuel' || useRecommendedRoute;
  const showAll =
    !onlyRecommendedRoute && !routeNotFound && (routes?.length ?? 0) > 1;

  return (
    <Card {...props}>
      <Box>
        <CardTitle sx={{
          display: 'inline-block',
          paddingRight: 'unset'
        }}>
          {variant === 'nft' ? t('swap.fromAmount') : t('header.routes')}
        </CardTitle>
        <ProgressToNextUpdate
          updatedAt={dataUpdatedAt || new Date().getTime()}
          timeToUpdate={refetchTime}
          isLoading={isFetching}
          onClick={() => refetch()}
          sx={{
            display: 'inline-block',
            marginLeft: '2px',
          }}
        />
        <ButtonBase onClick={handleCardClick} disabled={isValidating} sx={(theme) => ({
          position: 'absolute',
          top: 16,
          right: 14,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.5)'
        })}>{t('button.showAll') + ''} <ArrowIcon style={{
          marginLeft: '3px'
        }} /> </ButtonBase>
      </Box>
      <Box pt={'unset'} mt={isLoading ? 1 : -1} pl={2} pr={2} pb={2}>
        {(isLoading) ? (
          <SwapRouteCardSkeleton variant="cardless" />
        ) : !currentRoute ? (
          <SwapRouteNotFoundCard />
        ) : (
          <SwapRouteCard route={currentRoute} variant="cardless" active />
        )}

        {/* <Collapse timeout={225} in={showAll} unmountOnExit mountOnEnter appear>
          <Box mt={2}>
            <Button
              onClick={handleCardClick}
              disabled={isValidating || !isValid}
              fullWidth
            >
              {t('button.showAll')}
            </Button>
          </Box>
        </Collapse> */}
      </Box>
    </Card >
  );
};
