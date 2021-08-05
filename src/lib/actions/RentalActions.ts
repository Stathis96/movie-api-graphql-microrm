import { EntityManager } from '@mikro-orm/core'
import { UserInputError } from 'apollo-server-koa'
import { RentalInputData } from 'src/types/classes/RentalInputData'
import { Movie } from 'src/types/entities/Movie'
import { Rental } from 'src/types/entities/Rental'
import { User } from 'src/types/entities/User'

export async function getRentalsAction (em: EntityManager): Promise<Rental[]> {
  return await em.find(Rental, {}, ['movie', 'user'])
}

export async function createRentalAction (data: RentalInputData, em: EntityManager): Promise<Rental> {
  const movie = await em.findOneOrFail(Movie, { id: data.movie_id })
  const user = await em.findOneOrFail(User, { id: data.user_id })

  if (!movie.available) {
    throw new UserInputError('MOVIE_UNAVAILABLE')
  }
  const rental = em.create(Rental, { movie: movie, user: user, dateOfRental: data.date })
  rental.movie.available = false
  await em.persistAndFlush(rental) // persist mono gia create !!
  return rental
}

export async function getRentalAction (id: string, em: EntityManager): Promise<Rental> {
  const rental = await em.findOneOrFail(Rental, { id }, ['movie', 'user']) // ['movie', 'user'] --> passing entities so i can see them from playground,query them
  return rental
}

export async function updateRentalAction (id: string, data: RentalInputData, em: EntityManager): Promise<Rental> {
  const rental = await em.findOneOrFail(Rental, { id })
  const movie = await em.findOneOrFail(Movie, { id: data.movie_id })
  const user = await em.findOneOrFail(User, { id: data.user_id })

  rental.user = user
  rental.movie = movie
  rental.dateOfRental = data.date
  rental.movie.available = false
  // wrap(rental).assign(data)
  await em.flush()
  return rental
}

export async function deleteRentalAction (id: string, em: EntityManager): Promise<boolean> {
  const rental = await em.findOneOrFail(Rental, { id })
  const movie = await em.findOneOrFail(Movie, { id: rental.movie.id })
  movie.available = true
  console.log(rental.movie.available)
  await em.removeAndFlush(rental)
  console.log('Rental removed')
  return true
}
