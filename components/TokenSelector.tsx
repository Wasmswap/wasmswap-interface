import React from 'react'

type TokenSelectorProps = {
  amount: number
  balance?: number
  tokensList: Array<{ symbol: string; [k: string]: any }>
  tokenName: string
  onAmountChange?: (amount: number) => void
  onTokenNameSelect: (tokenName: string) => void
}

export const TokenSelector = ({
  balance,
  tokensList,
  amount,
  tokenName,
  onAmountChange,
  onTokenNameSelect,
}: TokenSelectorProps) => {
  const handleAmountChange = ({ target: { value } }) =>
    onAmountChange(Number(value))
  const handleTokenNameSelect = ({ target: { value } }) =>
    onTokenNameSelect(value)
  return (
    <>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="token-a" className="sr-only">
            Token
          </label>
          <select
            id="token-a"
            name="token-a"
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            onChange={handleTokenNameSelect}
            value={tokenName}
          >
            {tokensList.map((value, key) => (
              <option key={key}>{value.symbol}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          name="token-a-amount"
          id="token-a-amount"
          className="text-right text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
          placeholder="0.0"
          min={0}
          value={amount}
          onChange={onAmountChange ? handleAmountChange : undefined}
          autoComplete="off"
          readOnly={!onAmountChange}
        />
      </div>
      {typeof balance === 'number' && (
        <div className="flex justify-start">
          <div>Balance:</div> <div className="px-2">{balance}</div>
        </div>
      )}
    </>
  )
}
