import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes } from '../../utils';
import type { SwapButtonProps } from './types';

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  hasRoute,
  text,
  disabled,
  loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { variant, walletManagement } = useWidgetConfig();
  const { account, connect } = useWallet();

  const handleSwapButtonClick = async () => {
    if (!account.isActive) {
      if (walletManagement) {
        await connect();
      } else {
        navigate(navigationRoutes.selectWallet);
      }
    } else {
      onClick?.();
    }
  };

  const getButtonText = () => {
    if (!hasRoute) {
      switch (variant) {
        case 'nft':
          return t(`button.buy`);
        case 'refuel':
          return t(`button.getGas`);
        default:
          return t(`button.swap`);
      }
    }
    if (text) {
      return text;
    }
    switch (variant) {
      case 'nft':
        return t(`button.reviewPurchase`);
      case 'refuel':
        return t(`button.reviewGasSwap`);
      default:
        return t(`button.reviewSwap`);
    }
  };

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSwapButtonClick}
      disabled={disabled || !account.isActive}
      loading={loading}
      loadingPosition="center"
      fullWidth
      sx={{
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      {getButtonText()}
    </LoadingButton>
  );
};
