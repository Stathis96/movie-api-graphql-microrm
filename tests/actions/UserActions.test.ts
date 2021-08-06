import '../dbSetup'
import { EntityManager } from '@mikro-orm/core'
import { getConnection } from 'tests/createConnection'
import { createUserAction, deleteUserAction, getUsersAction, updateUserAction } from 'src/lib/actions/UserActions'
import { User } from 'src/types/entities/User'

let em: EntityManager
beforeEach(async () => {
  em = (await getConnection()).em.fork()

  await em.begin()
})

afterEach(async () => {
  await em.rollback()
})

async function createBasicUser (title = 'Senior'): Promise<User> {
  const user = em.create(User, {
    title: title,
    dateOfBirth: '15/05/2005',
    dateOfRegistration: '10/03/2020'
  })

  await em.persistAndFlush(user)

  return user
}

const data = { title: 'A kind user', dateOfBirth: '01/00/2000', dateOfRegistration: '10/03/2020' }

describe('UsersAction: getUsersAction', () => {
  test('empty', async () => {
    expect.assertions(1)

    const result = await getUsersAction(em)

    expect(result).toHaveLength(0)
  })

  test('return all', async () => {
    expect.assertions(3)

    const m1 = await createBasicUser()
    await createBasicUser('User 2')
    await createBasicUser('User 3')
    const m4 = await createBasicUser('User 4')

    const result = await getUsersAction(em)

    expect(result).toHaveLength(4)
    expect(result[0]).toBe(m1)
    expect(result[3]).toBe(m4)
  })
})

describe('MoviesAction: createUserAction', () => {
  test('can create a user with valid data', async () => {
    expect.assertions(4)

    const result = await createUserAction(data, em)

    expect(await em.find(User, {})).toHaveLength(1)
    expect(result.title).toBe(data.title)
    expect(result.dateOfBirth).toBe(data.dateOfBirth)
    expect(result.dateOfRegistration).toBe(data.dateOfRegistration)
  })
})

describe('MoviesAction: updateUserAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    await createBasicUser()

    await expect(async () => await updateUserAction('invalid-id', data, em))
      .rejects.toThrow('not found')
  })
  test('can update movie with valid data', async () => {
    expect.assertions(3)

    const result = await createBasicUser()
    const id = result.id

    await updateUserAction(id, data, em)

    expect(result.title).toBe(data.title)
    expect(result.dateOfBirth).toBe(data.dateOfBirth)
    expect(result.dateOfRegistration).toBe(data.dateOfRegistration)
  })
})

describe('MoviesAction: deleteMovieAction', () => {
  test('invalid id should throw Error', async () => {
    expect.assertions(1)

    await expect(async () => await deleteUserAction('invalid-id', em))
      .rejects.toThrow('not found')
  })
  test('can delete movie with valid data', async () => {
    expect.assertions(1)

    const result = await createBasicUser()
    const id = result.id

    await deleteUserAction(id, em)
    await expect(async () => await deleteUserAction(id, em)).rejects.toThrow('not found')
  })
})
