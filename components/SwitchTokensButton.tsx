import React from 'react'

export const SwitchTokensButton = ({ onClick }: { onClick: () => void }) => (
  <div className="flex justify-center">
    <div>
      <button
        onClick={onClick}
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
)
