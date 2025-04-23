import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div>
      <h3>Hello!</h3>
      <p>
        <a href="/private">Go to Private</a>
      </p>
    </div>
  )
})

app.get('/private', (c) => {
  return c.render(
    <div>
      <h3>Private</h3>
      <p>
        <a href="/">Go home</a>
      </p>
    </div>
  )
})

export default app
