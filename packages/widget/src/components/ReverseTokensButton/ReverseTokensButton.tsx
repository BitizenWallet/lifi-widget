import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey, useWallet } from '../../providers';
import { IconButton } from './ReverseTokensButton.style';
import { ReverseTokensIcon } from '../../icons';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setValue, getValues } = useFormContext();
  const { account } = useWallet();

  const handleClick = async () => {
    if (localStorage.getItem('bitizen_switchAccount')) {
      return;
    }
    localStorage.setItem('bitizen_switchAccount', 'true');
    try {
      const [fromChain, fromToken, toChain, toToken, toAddress] = getValues([
        SwapFormKey.FromChain,
        SwapFormKey.FromToken,
        SwapFormKey.ToChain,
        SwapFormKey.ToToken,
        SwapFormKey.ToAddress,
      ]);
      const oldFromAddress = account.address;
      const oldToChain = toChain;
      const oldToAddress = toAddress;
      await (window as any).ethereum.request({
        method: 'bitizen_switchAccount',
        params: [oldToChain.toString(), oldToAddress],
      });
      setValue(SwapFormKey.FromAmount, '', { shouldTouch: true });
      setValue(SwapFormKey.FromChain, toChain, { shouldTouch: true });
      setValue(SwapFormKey.FromToken, toToken, { shouldTouch: true });
      setValue(SwapFormKey.ToChain, fromChain, { shouldTouch: true });
      setValue(SwapFormKey.ToToken, fromToken, { shouldTouch: true });
      setValue(SwapFormKey.ToAddress, oldFromAddress, { shouldTouch: true });
    } finally {
      setTimeout(() => {
        localStorage.removeItem('bitizen_switchAccount')
      }, 1500);
    }
  };

  return (
    <IconButton sx={{
      backgroundColor: '#39424D',
      borderColor: 'rgba(30, 36, 43, 1)',
      borderWidth: '7px',
      padding: '9px',
    }} onClick={handleClick} size="small">
      {vertical ? <ReverseTokensIcon width={'18px'} height={'18px'} /> : <SwapHorizIcon />}
    </IconButton>
  );
};
