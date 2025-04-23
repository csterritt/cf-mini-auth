import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link rel='stylesheet' href='/style/normalize.css' type='text/css' />
        <link rel='stylesheet' href='/style/sakura.css' type='text/css' />
        <title>Hono, D1</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
