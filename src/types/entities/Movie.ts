import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Rental } from './Rental'

@Entity()
@ObjectType()
export class Movie {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  title: string

  @Property()
  @Field(() => [String])
  genres: string[]

  // available field
  @Property()
  @Field(() => Boolean)
  available: boolean
  // rental relation

  @OneToMany(() => Rental, r => r.movie, { cascade: [Cascade.ALL] })
  rentals = new Collection<Rental>(this)
}
