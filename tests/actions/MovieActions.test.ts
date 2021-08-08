import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from 'tests/createConnection'
import { createMovieAction, deleteMovieAction, getMovieAction, getMoviesAction, updateMovieAction } from 'src/lib/actions/MovieActions'
import { Movie } from 'src/types/entities/Movie'

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

const data = { title: 'Movie Title', genres: ['action', 'drama'], available: true }

describe('MoviesAction: getMoviesAction', () => {
  test('empty', async () => {
    expect.assertions(1)

    const result = await getMoviesAction(em)

    expect(result).toHaveLength(0)
  })
  test('return all', async () => {
    expect.assertions(3)

    const m1 = await createBasicMovie()
    await createBasicMovie('Movie 2')
    await createBasicMovie('Movie 3')
    const m4 = await createBasicMovie('Movie 4')

    const result = await getMoviesAction(em)

    expect(result).toHaveLength(4)
    expect(result[0]).toBe(m1)
    expect(result[3]).toBe(m4)
  })
})

describe('MoviesAction: getMovieAction', () => {
  test('invalid-id should throw error', async () => {
    expect.assertions(1)

    await createBasicMovie()

    await expect(async () => await getMovieAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  test('can fetch movie with valid data', async () => {
    expect.assertions(1)

    const m1 = await createBasicMovie()

    const result = await getMovieAction(m1.id, em)
    expect(result).toBe(m1)
  })
})

describe('MoviesAction: createMovieAction', () => {
  test('can create movie with valid data', async () => {
    expect.assertions(4)

    const result = await createMovieAction(data, em)

    expect(await em.find(Movie, {})).toHaveLength(1)
    expect(result.title).toBe(data.title)
    expect(result.genres).toBe(data.genres)
    expect(result.available).toBe(data.available)
  })
})

describe('MoviesAction: updateMovieAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    // await createBasicMovie()
    await expect(async () => await updateMovieAction('invalid-id', data, em))
      .rejects.toThrow('not found')
  })
  test('can update movie with valid data', async () => {
    expect.assertions(3)

    const result = await createBasicMovie()
    const id = result.id

    await updateMovieAction(id, data, em)

    expect(result.title).toBe(data.title)
    expect(result.genres).toBe(data.genres)
    expect(result.available).toBe(data.available)
  })
})

describe('MoviesAction: deleteMovieAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    await expect(async () => await deleteMovieAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  test('can delete movie with valid data', async () => {
    expect.assertions(1)

    const result = await createBasicMovie()
    const id = result.id

    await deleteMovieAction(id, em)
    await expect(async () => await deleteMovieAction(id, em)).rejects.toThrow('not found')
  })
})
