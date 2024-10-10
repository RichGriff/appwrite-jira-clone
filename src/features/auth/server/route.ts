import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema } from '../schemas'

const app = new Hono()
  .post('/login', zValidator('json', loginSchema), (ctx) => {
    return ctx.json({ success: 'ok' })
  })

export default app