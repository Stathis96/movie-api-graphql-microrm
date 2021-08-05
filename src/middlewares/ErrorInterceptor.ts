import { ApolloError, ValidationError } from 'apollo-server-koa'
import { CustomContext } from 'src/types/interfaces/CustomContext'
import { MiddlewareFn } from 'type-graphql'

export const ErrorInterceptor: MiddlewareFn<CustomContext> = async (_context, next) => {
  try {
    return await next()
  } catch (err) {
    console.log('DES EDW', err.name)
    if (err.name === 'NotFoundError') {
      console.log('NotFoundError: ', err.message)
      throw new ValidationError(err.message)
    } else if (err.name === 'UserInputError') {
      console.log('UserInputError: ', err.message)
      throw err
      // context.ctx.message = 'USER INPUT ERROR'
      // context.ctx.status = 422
      // {context.ctx.response.status}: ${info.returnType} ${context.ctx.message}
    }

    throw new ApolloError('INTERNAL_ERROR')
  }
}
// NotFoundError
// UserInputError
