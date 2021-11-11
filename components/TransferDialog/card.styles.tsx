import { IconWrapper } from '../IconWrapper'
import { spaces } from '../../util/constants'
import styled from 'styled-components'
import { CreditCardIcon } from '@heroicons/react/solid'
import { AppLogoIcon } from '../AppLogoIcon'
import { TransactionOrigin } from './types'

export const StyledIconWrapper = styled(IconWrapper)`
  ${(p) =>
    p.$enableGradient
      ? `
  background: linear-gradient(
    143.8deg,
    rgba(119, 170, 203, 0.7) -8.73%,
    rgba(88, 144, 213, 0.7) 54.85%,
    rgba(159, 98, 186, 0.7) 91.29%
  );
  background-blend-mode: overlay, overlay, normal;
  `
      : ''}
  padding: ${(p) => (p.$enablePadding ? '7px' : 0)};
  margin-right: ${spaces[12]};
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${spaces[14]} 0 ${spaces[24]};
`

export const StyledDivForBalance = styled.div`
  display: flex;
  align-items: center;
  line-height: 18px;
  padding: ${(p) => spaces[p.$paddingY] || p.$paddingY || '10px'} 0;
`

export const WalletIcon = ({
  transactionOrigin,
}: {
  transactionOrigin: TransactionOrigin
}) =>
  transactionOrigin === 'wallet' ? (
    <StyledIconWrapper
      size="44px"
      color="#1a44af"
      rounded
      $enableGradient
      $enablePadding
      icon={<CreditCardIcon />}
    />
  ) : (
    <StyledIconWrapper
      size="44px"
      color="#1a44af"
      rounded
      icon={<AppLogoIcon />}
    />
  )
