## Wasmswap interface

An open-sourced platform/library for developing interfaces of CosmosSDK based tokens decentralized exchanges.

* **Declarative configuration:** Easily swap the example blockchain configuration with your protocol parameters and provide your token list and ibc assets list to allow for trading real assets.
* **Design system based:** Uses our internal UI framework for smooth UI tweaking based on your project needs. Configure branding, color palette, typography style, spacing, etc., based on how your designer feels it should look.
* **Built for best UX:** Use our framework to build the next-level DEXes. The app is optimized to achieve the next level of fluidity in the web 3.0 apps space.

Run the app in dev mode locally.

```bash
npm run dev
# or
yarn dev
```

Access the app on `http://localhost:3000/`.

## Blockchain configuration

The app configuration, feature flags, etc., is located in the .env config file.

To configure the app and enable actual assets trading, you will need to swap the demo example configuration set with your chain information and add your token and ibc assets listing if you want to allow for inter blockchain asset transfers.

### Suggest chain feature / Chain info
Swap our test chain info example with your configuration to suggest your chain for Keprl and allow the wallet to be used in the app. It expects to receive data in the `ChainInfo` format. Refer to [Keplr documentation](https://docs.keplr.app/api/suggest-chain.html) for more information.
> Keplr's 'suggest chain' feature allows front-ends to request adding new Cosmos-SDK based blockchains that isn't natively integrated to Keplr extension.

Use this `env` variable to update the chain info path. The app will dynamically load the configuration so that the path can point to anything, either locally served in the public folder or something deployed onto a CDN. Make sure there are no CORS issues.

```
NEXT_PUBLIC_CHAIN_INFO_URL=/chain_info.testnet.json
```

### Provide token listing
You will need to provide a token listing with real endpoints to allow for trading real assets. By default, the platform has only the example token listing that only serves testing purposes, i.e., does not allow for real assets to be traded. Refer to the token list [example](https://github.com/Wasmswap/wasmswap-interface/blob/develop/public/token_list.testnet.json) for more information.

Similarly to `NEXT_PUBLIC_CHAIN_INFO_URL` variable, the config will be loaded dynamically.

```
NEXT_PUBLIC_TOKEN_LIST_URL=/token_list.testnet.json
```

### Provide IBC assets list

By default, the platform only renders the example IBC assets lists. To allow for real interchain asset transfers you will need to provide your ibc tokens lists. Refer to the token list [example](https://github.com/Wasmswap/wasmswap-interface/blob/develop/public/ibc_assets.json) for more information.

Similarly to `NEXT_PUBLIC_CHAIN_INFO_URL` & `NEXT_PUBLIC_TOKEN_LIST_URL` variables, the config will be loaded dynamically.

```
NEXT_PUBLIC_IBC_ASSETS_URL=/ibc_assets.json
```

## Branding configuration

### App name

By default, the app uses the project name. We don't necessarily mind if you use our project name but prefer to be unique and creative. To update the app name, go to the `.env` file and change the following variable:

```
NEXT_PUBLIC_SITE_TITLE=CoolSwap
```

That will change the site title and update what it renders in the footer.

### Demo mode

By default, the app renders demo mode warning to warn the users that the app runs in a demo/simulation mode and does not allow for trading real assets. If you'd like to disable the demo mode, update this env variable:

```
NEXT_PUBLIC_TEST_MODE_DISABLED=false
```

### App version

Very simple, if the app you've built using our open-source platform differs in the versioning, go ahead and update this variable.

```
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Branding

We want to encourage you to use vector graphics for your project's logo and name. Go to `/icons/Logo.tsx` and swap our branded logo symbol with yours to update the app logo.

Go to `/icons/LogoText.tsx` and update the file accordingly to update the logo text.

### Color palette

To update the color palette, go to `components/theme.ts` and provide your custom values.

### Typography and buttons

#### Font

To swap the font, navigate to `components/theme.ts` and update the font family tokens. Don't forget to connect your fonts. Refer to `styles/globals.scss` for an example.

#### Color palette

Update your project colors in the same file by updating the color tokens, and values for `textColors`, `iconColors`, `backgroundColors`, `borderColors`. It's important to keep color tokens in one space as we're planning on supporting dark & sepia modes in the future.

#### Buttons

To update the styling for buttons go to `components/Button.tsx` and provide your custom styling for the variants we use.

#### Typography

To update the typography component configuration, go to `components/Text.tsx` and provide your custom styling for our variants.

## How to deploy

This is a nextjs app; thus everything that a nextjs app supports for deployment technically is supported by `wasmswap-interface`. We would recommend looking into Vercel.

@todo

## Contributing

Raise the bar for Web 3.0 with us! Like any other open-source code, project would love you to contribute. Submit your PR contributions and issues directly on this repo.

## License

Wasmswap interface is MIT licensed. Use this software however you want at your own risk. Note that you must include a link to this repo.
