import React from 'react'
import { useAppContext } from 'contexts/app'
import { swapNativeForToken, swapTokenForNative } from 'services/swap'
import TokenList from 'public/token_list.json'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import {
  tokenAmountState,
  tokenANameState,
  tokenBNameState,
} from '../state/atoms/tokenAtoms'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { transactionStatusState } from '../state/atoms/transactionAtoms'
import { useTokenPrice } from '../hooks/useTokenPrice'

export default function Home() {
  const { address, client } = useAppContext()

  const contract = process.env.NEXT_PUBLIC_AMM_CONTRACT_ADDRESS

  const [transactionStatus, setTransactionState] = useRecoilState(
    transactionStatusState
  )

  const [tokenAName, setTokenAName] = useRecoilState(tokenANameState)
  const [tokenAmount, setTokenAmount] = useRecoilState(tokenAmountState)

  const tokenABalance = useTokenBalance(tokenAName)
  const [tokenBName, setTokenBName] = useRecoilState(tokenBNameState)

  const tokenBPrice = useTokenPrice(tokenAName, tokenAmount)
  const tokenBBalance = useTokenBalance(tokenBName)

  const handleTokenANameChange = (e: any) => {
    setTokenAmount(0)
    if (e.target.value === tokenBName) {
      setTokenBName(tokenAName)
    }
    setTokenAName(e.target.value)
  }

  const handleTokenBNameChange = (e: any) => {
    if (e.target.value === tokenAName) {
      setTokenAName(tokenBName)
    }
    setTokenBName(e.target.value)
  }

  const handletokenAmountChange = (e: any) => {
    setTokenAmount(Number(e.target.value))
  }

  console.log('re-rendered')

  const handleSwitch = () => {
    setTokenAName(tokenBName)
    setTokenBName(tokenAName)
    setTokenAmount(tokenBPrice)
  }

  // TODO don't hardwire everything, just for testing
  const handleSwap = async () => {
    console.log(client)
    if (client == undefined) {
      toast.error('Please connect wallet', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      console.log(tokenBPrice)
      setTransactionState('FETCHING')
      try {
        if (tokenAName === 'JUNO') {
          await swapNativeForToken({
            nativeAmount: tokenAmount * 1000000,
            price: tokenBPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            swapAddress: contract as string,
            client,
          })
        } else {
          const token = TokenList.tokens.find((x) => x.symbol === tokenAName)
          if (token) {
            await swapTokenForNative({
              tokenAmount: tokenAmount * 1000000,
              price: tokenBPrice * 1000000,
              slippage: 0.1,
              senderAddress: address,
              tokenAddress: token.address,
              swapAddress: contract as string,
              client,
            })
          }
        }
        toast.success('🎉 Swap Succesful', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } catch (e) {
        toast.error(`Error with swap ${e}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
      setTransactionState('SUCCESS')
    }
  }

  const loading = transactionStatus === 'FETCHING'

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            Swap
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="token-a" className="sr-only">
                    Token
                  </label>
                  <select
                    id="token-a"
                    name="token-a"
                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    onChange={handleTokenANameChange}
                    value={tokenAName}
                  >
                    <option>JUNO</option>
                    {TokenList.tokens.map((value, key) => {
                      return <option key={key}>{value.symbol}</option>
                    })}
                  </select>
                </div>
                <input
                  type="number"
                  name="token-a-amount"
                  id="token-a-amount"
                  className="text-right text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                  min={0}
                  // max={tokenABalance || 0}
                  value={tokenAmount}
                  onChange={handletokenAmountChange}
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-start">
                <div>Balance:</div> <div className="px-2">{tokenABalance}</div>
              </div>
              <div className="flex justify-center">
                <div>
                  <button
                    onClick={handleSwitch}
                    type="submit"
                    className="text-center opacity-70 hover:opacity-90 py-2 px-4 text-sm font-medium text-white focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM7 9l3-3.5L13 9h-2v4H9V9H7zm10 6l-3 3.5-3-3.5h2v-4h2v4h2z"
                        fill="#000"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="token-b" className="sr-only">
                    Token
                  </label>
                  <select
                    id="token-b"
                    name="token-b"
                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    onChange={handleTokenBNameChange}
                    value={tokenBName}
                  >
                    <option>JUNO</option>
                    {TokenList.tokens.map((value, key) => {
                      return <option key={key}>{value.symbol}</option>
                    })}
                  </select>
                </div>
                <input
                  type="text"
                  name="token-b-amount"
                  id="token-b-amount"
                  className="text-right block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
                  value={tokenBPrice}
                  autoComplete="off"
                  readOnly
                />
              </div>
              <div className="flex justify-start">
                <div>Balance:</div> <div className="px-2">{tokenBBalance}</div>
              </div>
            </div>
            <div>
              <button
                onClick={loading ? () => {} : handleSwap}
                type="submit"
                className={
                  'object-contain w-full flex justify-center h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  ' +
                  (loading
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500')
                }
              >
                {loading ? (
                  <Image
                    src={'/spinner.svg' as any}
                    alt="loading"
                    className="h-6 animate-spin"
                    width={24}
                    height={24}
                  />
                ) : (
                  'Swap'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
