import { EntityManager } from '@mikro-orm/core'
import { UserInputData } from 'src/types/classes/UserInputData'
import { User } from 'src/types/entities/User'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { createUserAction, deleteUserAction, getUserAction, getUsersAction, updateUserAction } from '../actions/UserActions'

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers (
    @Ctx('em') em: EntityManager
  ): Promise<User[]> {
    return await getUsersAction(em)
  }

  @Mutation(() => User)
  async createUser (
    @Ctx('em') em: EntityManager,
      @Arg('data', () => UserInputData) data: UserInputData
  ): Promise<User> {
    return await createUserAction(data, em)
  }

  @Mutation(() => User)
  async getUser (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <User> {
    return await getUserAction(id, em)
  }

  @Mutation(() => User)
  async updateUser (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => UserInputData) data: UserInputData
  ): Promise<User> {
    return await updateUserAction(id, data, em)
  }

  @Mutation(() => Boolean)
  async deleteUser (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteUserAction(id, em)
  }
}
