import { ApolloError, ValidationError } from 'apollo-server-koa'
import { CustomContext } from 'src/types/interfaces/CustomContext'
import { MiddlewareFn } from 'type-graphql'

export const ErrorInterceptor: MiddlewareFn<CustomContext> = async (_context, next) => {
  try {
    return await next()
  } catch (err) {
    console.log('error', err)
    console.log(err.constraints)
    if (err.validationErrors) {
      const errors = [] as string[]
      err.validationErrors.forEach((val: {property: string, value: string}) => {
        errors.push(val.property + ': ' + val.value)
      })
      if (errors.length) {
        let ret = ''
        errors.forEach(val => { ret = ret + val + ', ' })
        throw Error(ret)
      }
    }

    // if (err.validationErrors) {
    //   let ret = ''
    //   err.validationErrors.forEach((val: ValidationError, idx: number, err: ValidationError[]) => {
    //     if (idx === err.length - 1) {
    //       ret += (Object.values(val.constraints)).toString()
    //     } else {
    //       ret += (Object.values(val.constraints)).toString() + ', '
    //     }
    //   })
    //   console.log(ret)
    //   throw Error(ret)
    // }

    if (err.name === 'NotFoundError') {
      console.log('NotFoundError: ', err.message)
      throw new ValidationError(err.message)
    } else if (err.name === 'UserInputError') {
      console.log('UserInputError: ', err.message)
      throw err
    }

    throw new ApolloError('INTERNAL_ERROR')
  }
}

// NotFoundError
// UserInputError
