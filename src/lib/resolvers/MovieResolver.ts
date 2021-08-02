import { EntityManager } from '@mikro-orm/core'
import { MovieInputData } from 'src/types/classes/MovieInputData'
import { Movie } from 'src/types/entities/Movie'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { createMovieAction, deleteMovieAction, getMovieAction, getMoviesAction, updateMovieAction } from '../actions/MovieActions'

@Resolver()
export class MovieResolver {
  @Query(() => [Movie])
  async getMovies (
    @Ctx('em') em: EntityManager
  ): Promise<Movie[]> {
    return await getMoviesAction(em)
  }

  @Mutation(() => Movie)
  async createMovie (
    @Ctx('em') em: EntityManager,
      @Arg('data', () => MovieInputData) data: MovieInputData
  ): Promise<Movie> {
    return await createMovieAction(data, em)
  }

  @Mutation(() => Movie)
  async getMovie (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise <Movie> {
    return await getMovieAction(id, em)
  }

  @Mutation(() => Movie)
  async updateMovie (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string,
      @Arg('data', () => MovieInputData) data: MovieInputData
  ): Promise<Movie> {
    return await updateMovieAction(id, data, em)
  }

  @Mutation(() => Boolean)
  async deleteMovie (
    @Ctx('em') em: EntityManager,
      @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return await deleteMovieAction(id, em)
  }
}
