import { Hono } from 'hono'
import { renderer } from './renderer'
import { logger } from 'hono/logger'
import { buildHome } from './routes/buildHome'
import { buildPrivate } from './routes/buildPrivate'
import { buildCount } from './routes/buildCount'
import { buildIncrement } from './routes/buildIncrement'
import { PATHS } from './constants'
import { Bindings } from './local-types'

const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())
app.use(renderer)

buildHome(app)
buildPrivate(app)
buildCount(app)
buildIncrement(app)

console.log('Registered paths:')
Object.values(PATHS).forEach((path) => console.log(path))

export default app
