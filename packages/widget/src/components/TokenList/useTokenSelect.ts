import { useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { SwapFormType } from '../../providers';
import { SwapFormKey, SwapFormKeyHelper, useWallet } from '../../providers';
import { supportedWallets } from '@lifi/wallet-management';

export const useTokenSelect = (
  formType: SwapFormType,
  onClick?: () => void,
) => {
  const tokenKey = SwapFormKeyHelper.getTokenKey(formType);
  const {
    field: { onChange, onBlur },
  } = useController({ name: tokenKey });
  const { setValue, getValues } = useFormContext();
  const { connect: connectWallet, disconnect } = useWallet();

  return useCallback(
    async (tokenAddress: string, chainId?: number) => {
      onChange(tokenAddress);
      onBlur();

      const selectedChainId =
        chainId ?? getValues(SwapFormKeyHelper.getChainKey(formType));
      const prevChainId = getValues(SwapFormKeyHelper.getPrevChainKey(formType));

      if (prevChainId != selectedChainId) {
        setValue(SwapFormKeyHelper.getPrevChainKey(formType), selectedChainId);
        if (formType == 'from') {
          (window as any).ethereum.chainId = '0x' + selectedChainId?.toString(16);
          // disconnect();
          (supportedWallets[0] as any).doNotShowWalletSelector = true;
          connectWallet(supportedWallets[0]);
        } else {
          setValue(SwapFormKey.ToAddress, '', { shouldTouch: true });
          const resp = await (window as any).ethereum.request({
            method: 'eth_accounts',
            chainId: '0x' + selectedChainId.toString(16),
          });
          setValue(SwapFormKey.ToAddress, resp[0], { shouldTouch: true });
        }
      }

      // Set chain again to trigger URL builder update
      setValue(SwapFormKeyHelper.getChainKey(formType), selectedChainId, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(SwapFormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChainId] = getValues([
        SwapFormKeyHelper.getTokenKey(oppositeFormType),
        SwapFormKeyHelper.getChainKey(oppositeFormType),
      ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId
      ) {
        setValue(SwapFormKeyHelper.getTokenKey(oppositeFormType), '', {
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      onClick?.();
    },
    [formType, getValues, onBlur, onChange, onClick, setValue],
  );
};
