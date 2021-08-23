import Image from 'next/image'
import React from 'react'

export const SwapButton = ({
  isLoading,
  onClick,
}: {
  isLoading: boolean
  onClick: () => void
}) => (
  <button
    onClick={isLoading ? () => {} : onClick}
    type="submit"
    className={
      'object-contain w-full flex justify-center h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600  ' +
      (isLoading
        ? 'cursor-not-allowed opacity-70'
        : 'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500')
    }
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
      'Swap'
    )}
  </button>
)
