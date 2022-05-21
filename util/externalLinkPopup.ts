type ExternalLinkPopupArgs = {
  url: string
  title: string
  width: number
  height: number
}

export function externalLinkPopup({
  url,
  title,
  width: w,
  height: h,
}: ExternalLinkPopupArgs) {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left},
      location=yes,
      status=yes
      `
  )

  if (window.focus) newWindow.focus()

  return newWindow
}

export function externalLinkPopupAutoWidth(
  args: Omit<ExternalLinkPopupArgs, 'width' | 'height'>
) {
  const width = Math.max(450, Math.round(window.innerWidth * 0.35))
  const height = Math.max(300, Math.round(window.innerHeight * 0.8))
  return externalLinkPopup({
    ...args,
    width,
    height,
  })
}
