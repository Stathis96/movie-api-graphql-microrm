import { Context, Next } from 'koa'

export async function Error (ctx: Context, next: Next): Promise<void> {
  try {
    await next()
  } catch (err) {
    console.log('err Koa', err)
    if (err.name === 'ValidationError') {
      ctx.status = 422
      ctx.body = {
        message: err.message
      }
    } else {
      console.log('err', err.message)

      ctx.status = 500
      ctx.body = {
        message: 'Internal Error'
      }
    }
  }
}
