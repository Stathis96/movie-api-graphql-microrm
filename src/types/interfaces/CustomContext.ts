import { Context } from 'koa'
import { EntityManager } from '@mikro-orm/core'

export interface CustomContext {
  ctx: Context

  em: EntityManager
}
