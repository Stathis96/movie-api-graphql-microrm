import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ID, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'
import { Movie } from './Movie'
import { User } from './User'

@Entity()
@ObjectType()
export class Rental {
  @PrimaryKey()
  @Field(() => ID)
  id: string = v4()

  @ManyToOne(() => Movie)
  @Field(() => Movie)
  movie: Movie

  @ManyToOne(() => User)
  @Field(() => User)
  user: User

  @Property()
  @Field()
  dateOfRental: Date
  // rental relation
}
