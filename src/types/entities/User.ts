import { Cascade, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Movie } from './Movie'
import { Rental } from './Rental'

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @Property()
  @Field()
  title: string

  @Property()
  @Field()
  dateOfBirth: string

  @Property()
  @Field()
  dateOfRegistration: string
  // rental relation

  @OneToMany(() => Rental, r => r.user, { cascade: [Cascade.ALL] })
  rentals = new Collection<Movie>(this)
}
