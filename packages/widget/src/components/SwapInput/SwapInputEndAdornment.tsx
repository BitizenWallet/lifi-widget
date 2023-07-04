import { InputAdornment, Skeleton } from '@mui/material';
import Big from 'big.js';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  useChains,
  useGasRecommendation,
  useTokenAddressBalance,
} from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { formatTokenAmount } from '../../utils';
import { Button } from './SwapInputAdornment.style';

export const SwapInputEndAdornment = ({ formType }: SwapFormTypeProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const { getChainById } = useChains();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { data } = useGasRecommendation(chainId);

  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress);

  const handleMax = () => {
    const chain = getChainById(chainId);
    let maxAmount = token?.amount;
    if (
      chain?.nativeToken.address === tokenAddress &&
      data?.available &&
      data?.recommended
    ) {
      const tokenAmount = Big(token?.amount ?? 0);
      const recommendedAmount = Big(data.recommended.amount)
        .div(10 ** data.recommended.token.decimals)
        .div(2);
      if (tokenAmount.gt(recommendedAmount)) {
        maxAmount = formatTokenAmount(
          tokenAmount.minus(recommendedAmount).toString(),
        );
      }
    }

    setValue(SwapFormKeyHelper.getAmountKey(formType), maxAmount || '', {
      shouldTouch: true,
    });
  };

  return (
    <InputAdornment position="end">
      {isLoading && tokenAddress ? (
        <Skeleton
          variant="rectangular"
          width={46}
          height={24}
          sx={{ borderRadius: 1 }}
        />
      ) : formType === 'from' && token?.amount ? (
        <Button sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(0, 183, 140, 0.65)',
          borderRadius: 1,
          paddingLeft: 1.4,
          paddingRight: 1.4,
          fontWeight: 600,
        }} onClick={handleMax}>{t('button.max')}</Button>
      ) : null}
    </InputAdornment>
  );
};
