import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewRounded';
import WalletIcon from '@mui/icons-material/Wallet';
import { Avatar, Button, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks';
import { SwapFormKey, SwapFormKeyHelper, SwapFormTypeProps, useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes, openUrlInBitizen, shortenAddress } from '../../utils';
import { HeaderAppBar, WalletButton } from './Header.style';
import { WalletMenu } from './WalletMenu';
import { supportedWallets } from '@lifi/wallet-management';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { useSendToWalletStore, useSettings, useSettingsStore } from '../../stores';

export const WalletHeader: React.FC = () => {
  return (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton formType='from' />
    </HeaderAppBar>
  );
};

export const WalletMenuButton: React.FC<SwapFormTypeProps> = ({ formType }) => {
  const { account } = useWallet();
  const [address, chainId] = useWatch({
    name: [SwapFormKey.ToAddress, SwapFormKeyHelper.getChainKey(formType)],
  });
  const connected = formType == 'from' ? account.isActive : (chainId == account.chainId || address?.toString().length > 0);
  return connected ? <ConnectedButton formType={formType} /> : <ConnectButton formType={formType} />;
};

const ConnectButton = ({ formType }: SwapFormTypeProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { walletManagement, subvariant } = useWidgetConfig();
  const { connect: connectWallet, disconnect } = useWallet();
  const navigate = useNavigate();
  const { setValue, getValues, trigger } = useFormContext();
  const { setSendToWallet, showSendToWallet } =
    useSendToWalletStore();

  const connect = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (formType == 'from') {
      // disconnect();
      connectWallet(supportedWallets[0]);
    } else {
      const chainId = getValues(SwapFormKeyHelper.getChainKey(formType));
      const resp = await (window as any).ethereum.request({
        method: 'bitizen_swapRequestToAddress',
        chainId: '0x' + chainId.toString(16),
      });
      setSendToWallet(resp?.toString().length > 0)
      if (resp?.toString().length) {
        setValue(SwapFormKey.ToAddress, resp?.toString(), { shouldTouch: true });
        trigger(SwapFormKey.ToAddress);
      }
    }
  };
  return (
    <WalletButton
      endIcon={subvariant !== 'split' ? <WalletIcon style={{ fontSize: '12px' }} /> : undefined}
      startIcon={subvariant === 'split' ? <WalletIcon /> : undefined}
      onClick={
        !pathname.includes(navigationRoutes.selectWallet) ? connect : undefined
      }
      style={{ fontSize: '12px', fontWeight: '700', padding: 'unset', paddingLeft: '8px', paddingRight: '8px' }}
    >
      {t(`button.connectWallet`)}
    </WalletButton>
  );
};

const ConnectedButton = ({ formType }: SwapFormTypeProps) => {
  const { t } = useTranslation();
  const { account, disconnect, connect } = useWallet();
  const walletAddress = shortenAddress(account.address);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { setValue, getValues, trigger } = useFormContext();
  const { chain } = useChain(account.chainId);
  const { setSendToWallet } =
    useSendToWalletStore();

  const [toAddress] = useWatch({
    name: [SwapFormKey.ToAddress],
  });

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (formType == 'from') {
      // disconnect();
      connect(supportedWallets[0]);
    } else {
      const chainId = getValues(SwapFormKeyHelper.getChainKey(formType));
      const resp = await (window as any).ethereum.request({
        method: 'bitizen_swapRequestToAddress',
        chainId: '0x' + chainId.toString(16),
        params: [toAddress?.toString()],
      });
      setSendToWallet(resp?.toString().length > 0)
      if (resp?.toString().length) {
        setValue(SwapFormKey.ToAddress, resp?.toString(), { shouldTouch: true });
        trigger(SwapFormKey.ToAddress)
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(account.address ?? '');
    handleClose();
  };

  return (
    <>
      <WalletButton
        endIcon={<ExpandMoreIcon style={{ fontSize: '12px', marginLeft: '-7px' }} />}
        // startIcon={
        //   <Avatar
        //     src={chain?.logoURI}
        //     alt={chain?.key}
        //     sx={{ width: 24, height: 24 }}
        //   >
        //     {chain?.name[0]}
        //   </Avatar>
        // }
        onClick={handleClick}
        sx={{
          fontSize: '12px', fontWeight: '700', padding: 'unset', paddingLeft: '8px', paddingRight: '8px',
          color: 'rgba(255, 255, 255, 0.75)',
        }}
      >
        {formType == 'from' ? walletAddress : (toAddress?.toString().length > 0 ? toAddress.toString().substring(0, 5) + '...' + toAddress.toString().substring(toAddress.toString().length - 4, toAddress.toString().length) : walletAddress)}
      </WalletButton>
      <WalletMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCopyAddress}>
          <ContentCopyIcon />
          {t(`button.copyAddress`)}
        </MenuItem>
        <MenuItem
          component="a"
          onClick={() => {
            openUrlInBitizen(`${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`);
            handleClose();
          }}
        >
          <OpenInNewIcon />
          {t(`button.viewOnExplorer`)}
        </MenuItem>
        <Button
          onClick={handleDisconnect}
          fullWidth
          startIcon={<PowerSettingsNewIcon />}
          sx={{
            marginTop: 1,
          }}
        >
          {t(`button.disconnect`)}
        </Button>
      </WalletMenu>
    </>
  );
};
