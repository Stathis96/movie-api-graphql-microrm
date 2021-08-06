import { EntityManager, wrap } from '@mikro-orm/core'
import { UserInputData } from 'src/types/classes/UserInputData'
import { User } from 'src/types/entities/User'

export async function getUsersAction (em: EntityManager): Promise<User[]> {
  return await em.find(User, {})
}

export async function getUserAction (id: string, em: EntityManager): Promise<User> {
  const user = await em.findOneOrFail(User, { id })
  return user
}

export async function createUserAction (data: UserInputData, em: EntityManager): Promise<User> {
  const user = em.create(User, data)

  await em.persistAndFlush(user)

  return user
}

export async function updateUserAction (id: string, data: UserInputData, em: EntityManager): Promise<User> {
  const user = await em.findOneOrFail(User, { id })
  wrap(user).assign(data)
  await em.persistAndFlush(user)
  return user
}

export async function deleteUserAction (id: string, em: EntityManager): Promise<boolean> {
  const user = await em.findOneOrFail(User, { id })
  await em.removeAndFlush(user)
  console.log('User removed')
  return true
}
