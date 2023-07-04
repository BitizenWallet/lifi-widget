import { Skeleton, Box } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useSwapOnly, useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { TokenAvatar, TokenAvatarDefault } from '../TokenAvatar';
import { SelectTokenCardHeader } from './SelectTokenButton.style';
import { WalletHeader, WalletMenuButton } from '../../components/Header/WalletHeader';

export const SelectTokenButton: React.FC<
  SwapFormTypeProps & {
    compact: boolean;
  }
> = ({ formType, compact }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { disabledUI, variant } = useWidgetConfig();
  const swapOnly = useSwapOnly();
  const tokenKey = SwapFormKeyHelper.getTokenKey(formType);
  const [chainId, tokenAddress] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType), tokenKey],
  });
  const { chain, isLoading: isChainLoading } = useChain(chainId);
  const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(
      formType === 'from'
        ? navigationRoutes.fromToken
        : variant === 'refuel'
          ? navigationRoutes.toTokenNative
          : navigationRoutes.toToken,
    );
  };

  const isSelected = !!(chain && token);
  const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
  const defaultPlaceholder =
    formType === 'to' && variant === 'refuel'
      ? t('swap.selectChain')
      : formType === 'to' && swapOnly
        ? t('swap.selectToken')
        : t('swap.selectChainAndToken');
  const cardTitle =
    formType === 'from' && variant === 'nft'
      ? t(`header.payWith`)
      : t(`swap.${formType}`);
  return (
    <Card flex={1} onClick={onClick}>
      <Box display={'flex'} justifyContent={'space-between'} marginTop={'12px'} paddingLeft={'14px'} paddingRight={'14px'} alignItems={'center'}>
        <CardTitle style={{
          margin: 'unset',
          padding: 'unset',
        }} fontSize={'14px'} display={'inline-block'}>{cardTitle}</CardTitle>

        {chainId && tokenAddress && (
          <WalletMenuButton formType={formType} />
        )}

      </Box>
      {chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (
        <SelectTokenCardHeader
          avatar={<Skeleton variant="circular" width={32} height={32} />}
          title={<Skeleton variant="text" width={64} height={24} />}
          subheader={<Skeleton variant="text" width={64} height={16} />}
          compact={compact}
          sx={{
            marginTop: -1,
          }}
        />
      ) : (
        <SelectTokenCardHeader
          avatar={
            isSelected ? (
              <TokenAvatar token={token} chain={chain} />
            ) : (
              <TokenAvatarDefault />
            )
          }
          style={{
            fontSize: '15px',
            fontWeight: '600',
            paddingTop: 'unset',
          }}
          title={isSelected ? token.symbol : defaultPlaceholder}
          subheader={
            isSelected ? t(`swap.onChain`, { chainName: chain.name }) : null
          }
          selected={isSelected}
          compact={compact}
        />
      )}
    </Card>
  );
};
