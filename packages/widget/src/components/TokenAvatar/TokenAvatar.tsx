import type { Chain, StaticToken } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Avatar, Badge, Skeleton } from '@mui/material';
import { useChain, useToken } from '../../hooks';
import { SmallAvatar, SmallAvatarSkeleton } from '../SmallAvatar';
import { AvatarDefault, AvatarDefaultBadge } from './TokenAvatar.style';

export const TokenAvatarFallback: React.FC<{
  token?: StaticToken;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, isLoading, sx }) => {
  const { chain } = useChain(token?.chainId);
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token?.chainId,
    token?.address,
  );
  return (
    <TokenAvatarBase
      token={chainToken ?? token}
      isLoading={isLoading || isLoadingToken}
      chain={chain}
      sx={sx}
    />
  );
};

export const TokenAvatarBase: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        chain && !isLoading ? (
          <SmallAvatar style={{
            width: 15,
            height: 15,
          }} src={chain.logoURI} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <SmallAvatarSkeleton />
        )
      }
      sx={sx}
    >
      {isLoading ? (
        <Skeleton width={35} height={35} variant="circular" />
      ) : (
        <Avatar style={{
          width: 35,
          height: 35,
        }} src={token?.logoURI} alt={token?.symbol}>
          {token?.symbol?.[0]}
        </Avatar>
      )}
    </Badge>
  );
};

export const TokenAvatar: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  if (!chain || !token?.logoURI) {
    return <TokenAvatarFallback token={token} isLoading={isLoading} sx={sx} />;
  }
  return (
    <TokenAvatarBase
      token={token}
      chain={chain}
      isLoading={isLoading}
      sx={sx}
    />
  );
};

export const TokenAvatarDefault: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<AvatarDefaultBadge width={15} height={15} />}
      sx={sx}
    >
      <AvatarDefault width={35} height={35} />
    </Badge>
  );
};
