import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import Image from 'next/image'

interface NavType {
  title?: string
  logoURL?: string
  navItems?: Array<NavItemType>
  walletAddress: string
  onConnectWallet: Function
}

interface NavItemType {
  name: string
  href: string
  current?: boolean
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({
  title,
  logoURL,
  navItems = [],
  walletAddress,
  onConnectWallet,
}: NavType) {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  {logoURL ? (
                    <Image
                      className="lg:block h-10 w-auto"
                      src={logoURL}
                      alt="crab logo"
                      width={50}
                      height={40}
                      priority
                    />
                  ) : null}
                  {title ? (
                    <div className="ml-4 text-white">{title}</div>
                  ) : null}
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                    onClick={() =>
                      walletAddress?.length === 0 && onConnectWallet()
                    }
                  >
                    {walletAddress?.length === 0 && (
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}

                    <span>
                      {walletAddress?.length > 0
                        ? walletAddress
                        : 'Connect Wallet'}
                    </span>
                  </button>
                </div>
                {/* <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    </div> */}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
