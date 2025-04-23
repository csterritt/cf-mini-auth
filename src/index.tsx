import { Hono } from 'hono'
import { renderer } from './renderer'
import { PATHS } from './constants'

const app = new Hono()

app.use(renderer)

app.get(PATHS.HOME, (c) => {
  return c.render(
    <div>
      <h3>Hello!</h3>
      <p>
        <a href={PATHS.PRIVATE}>Go to Private</a>
      </p>
    </div>
  )
})

app.get(PATHS.PRIVATE, (c) => {
  return c.render(
    <div>
      <h3>Private</h3>
      <p>
        <a href={PATHS.HOME}>Go home</a>
      </p>
    </div>
  )
})

export default app
