import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang='en'>
      <head>
        <link rel='stylesheet' href='/style/normalize.css' type='text/css' />
        <link rel='stylesheet' href='/style/sakura.css' type='text/css' />
        <title>CF Mini Auth</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
