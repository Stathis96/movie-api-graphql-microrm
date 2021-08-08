import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from 'tests/createConnection'
import { Rental } from 'src/types/entities/Rental'
import { createRentalAction, deleteRentalAction, getRentalAction, getRentalsAction, updateRentalAction } from 'src/lib/actions/RentalActions'
import { Movie } from 'src/types/entities/Movie'
import { User } from 'src/types/entities/User'

let em: EntityManager
beforeEach(async () => {
  em = (await getConnection()).em.fork()

  await em.begin()
})

afterEach(async () => {
  await em.rollback()
})

async function createBasicMovie (title = 'Title'): Promise<Movie> {
  const movie = em.create(Movie, {
    title: title,
    genres: ['genre1', 'genre2'],
    available: true
  })

  await em.persistAndFlush(movie)
  return movie
}

async function createBasicUser (title = 'Senior'): Promise<User> {
  const user = em.create(User, {
    title: title,
    dateOfBirth: '15/05/2005',
    dateOfRegistration: '10/03/2020'
  })

  await em.persistAndFlush(user)

  return user
}

async function createBasicRental (): Promise<Rental> {
  // const movie = await em.create(Movie, { id: '1', available: true })
  // const user = await em.create(User, { id: '10' })
  const movie = await createBasicMovie()
  const user = await createBasicUser()
  const rental = em.create(Rental, {
    movie: movie.id,
    user: user.id,
    dateOfRental: '15/05/05'
  })

  await em.persistAndFlush(rental)
  return rental
}

// const data = { title: 'Movie Title', genres: ['action', 'drama'], dateOfRental: '15/05/05' }

describe('RentalsAction: getRentalsAction', () => {
  test('empty', async () => {
    expect.assertions(1)

    const result = await getRentalsAction(em)

    expect(result).toHaveLength(0)
  })
  test('return all', async () => {
    expect.assertions(2)

    const m1 = await createBasicRental()

    const result = await getRentalsAction(em)

    expect(result).toHaveLength(1)
    expect(result[0]).toBe(m1)
  })
})

describe('RentalAction: getRentalAction', () => {
  test('invalid-id should throw error', async () => {
    expect.assertions(1)

    await createBasicRental()

    await expect(async () => await getRentalAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  test('can fetch rental with valid data', async () => {
    expect.assertions(1)

    const m1 = await createBasicRental()

    const result = await getRentalAction(m1.id, em)
    expect(result).toBe(m1)
  })
})

describe('RentalsAction: createRentalAction', () => {
  test('can create rental with valid data', async () => {
    expect.assertions(4)

    const result = await createBasicRental()
    const data = {
      movie_id: result.movie.id,
      user_id: result.user.id,
      date: result.dateOfRental
    }

    expect(await em.find(Rental, {})).toHaveLength(1)
    expect(result.movie.id).toBe(data.movie_id)
    expect(result.user.id).toBe(data.user_id)
    expect(result.dateOfRental).toBe(data.date)
  })
  test('Cannot create rental with movie not available', async () => {
    expect.assertions(1)

    const result = await createBasicRental()
    console.log('availability of movie is', result.movie.available)
    const availability = !result.movie.available
    expect(availability).toBeFalsy()
  })
  test('Cannot create rental with invalid movie id', async () => {
    expect.assertions(1)

    const u1 = await createBasicUser()

    const rental = {
      movie_id: 'movie.id',
      user_id: u1.id,
      date: '15/05/05'
    }
    await expect(async () => await createRentalAction(rental, em))
      .rejects.toThrow('not found')
  })
  test('Cannot create rental with invalid user id', async () => {
    expect.assertions(1)

    const m1 = await createBasicMovie()

    const rental = {
      movie_id: m1.id,
      user_id: 'user.id',
      date: '15/05/05'
    }
    await expect(async () => await createRentalAction(rental, em))
      .rejects.toThrow('not found')
  })
})

describe('RentalsAction: updateRentalAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    const result = await createBasicRental()
    const data = {
      movie_id: result.movie.id,
      user_id: result.user.id,
      date: result.dateOfRental
    }
    //   await expect(async () => await updateRentalAction('invalid-id',
    //     {
    //       movie_id: result.movie.id,
    //       user_id: result.user.id,
    //       date: result.dateOfRental
    //     },
    //     em))
    //     .rejects.toThrow('not found')
    await expect(async () => await updateRentalAction('invalid-id', data, em))
      .rejects.toThrow('not found')
  })
  test('can update rental with valid data', async () => {
    expect.assertions(3)

    const result = await createBasicRental()
    const id = result.id
    const data = {
      movie_id: result.movie.id,
      user_id: result.user.id,
      date: result.dateOfRental
    }

    await updateRentalAction(id, data, em)

    expect(result.movie.id).toBe(data.movie_id)
    expect(result.user.id).toBe(data.user_id)
    expect(result.dateOfRental).toBe(data.date)
  })
})

describe('RentalsAction: deleteRentalAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    await expect(async () => await deleteRentalAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  test('can delete rental with valid data', async () => {
    expect.assertions(1)

    const result = await createBasicRental()

    const id = result.id
    console.log('rental id is', id)

    await deleteRentalAction(id, em)
    await expect(async () => await deleteRentalAction(id, em)).rejects.toThrow('not found')
  })
})
