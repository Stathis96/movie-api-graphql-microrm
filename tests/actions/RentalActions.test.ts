import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from 'tests/createConnection'
import { Rental } from 'src/types/entities/Rental'
import { deleteRentalAction, getRentalsAction, updateRentalAction } from 'src/lib/actions/RentalActions'
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

async function createBasicRental (): Promise<Rental> {
  const movie = await em.create(Movie, { id: '1', available: true })
  const user = await em.create(User, { id: '10' })
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
    expect(result.movie.available).toBeFalsy()
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
  //   test('can update rental with valid data', async () => {
  //     expect.assertions(0)

  //     const result = await createBasicRental()
  //     const id = result.id
  //     const data = {
  //       movie_id: result.movie.id,
  //       user_id: result.user.id,
  //       date: result.dateOfRental
  //     }

  //     await updateRentalAction(id, data, em)

//     expect(result.movie.id).toBe(data.movie_id)
//     expect(result.user.id).toBe(data.user_id)
//     expect(result.dateOfRental).toBe(data.date)
//   })
})

describe('RentalsAction: deleteRentalAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    await expect(async () => await deleteRentalAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  // test('can delete rental with valid data', async () => {
  //   expect.assertions(0)

  //   const result = await createBasicRental()

  //   const id = result.id
  //   console.log('rental id is', id)

  //   await deleteRentalAction(id, em)
  //   await expect(async () => await deleteRentalAction(id, em)).rejects.toThrow('not found')
  // })
})
