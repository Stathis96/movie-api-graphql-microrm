import { EntityManager } from '@mikro-orm/core'
import { RentalInputData } from 'src/types/classes/RentalInputData'
import { Rental } from 'src/types/entities/Rental'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { createRentalAction, deleteRentalAction, getRentalAction, getRentalsAction, updateRentalAction } from '../actions/RentalActions'

@Resolver()
export class RentalResolver {
  @Query(() => [Rental])
  async getRentals (
    @Ctx('em') em: EntityManager
  ): Promise<Rental[]> {
    return await getRentalsAction(em)
  }

  @Mutation(() => Rental)
  async createRental (
    @Ctx('em') em: EntityManager,
      @Arg('data', () => RentalInputData) data: RentalInputData
  ): Promise<Rental> {
    return await createRentalAction(data, em)
  }

  @Mutation(() => Rental)
  async getRental (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <Rental> {
    return await getRentalAction(id, em)
  }

  @Mutation(() => Rental)
  async updateRental (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => RentalInputData) data: RentalInputData
  ): Promise<Rental> {
    return await updateRentalAction(id, data, em)
  }

  @Mutation(() => Boolean)
  async deleteRental (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteRentalAction(id, em)
  }
}
