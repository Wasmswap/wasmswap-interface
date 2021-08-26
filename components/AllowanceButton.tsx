import Image from 'next/image'
import React from 'react'

export const AllowanceButton = ({
  tokenName,
  isVisible,
  isLoading,
  isActive,
  onClick,
}: {
  tokenName: string
  isVisible: boolean
  isLoading: boolean
  isActive: boolean
  onClick: () => void
}) => (
  <div>
  {isVisible ? (
  <button
    onClick={isLoading ? () => {} : onClick}
    type="submit"
    className={
      'object-contain w-full flex justify-center h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600  ' +
      ((isLoading || !isActive)
        ? 'cursor-not-allowed opacity-50'
        : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500')
    }
    disabled={!isActive}
  >
    {isLoading ? (
      <Image
        src={'/spinner.svg' as any}
        alt="loading"
        className="h-6 animate-spin"
        width={24}
        height={24}
      />
    ) : (
      `Allow Wasmswap to access your ${tokenName}`
    )}
  </button>
  ) : ''}
  </div>
)
