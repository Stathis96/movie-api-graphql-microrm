import { Property } from '@mikro-orm/core'
import { Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class RentalInputData {
  @Property()
  @Field()
  movie_id: string

  @Property()
  @Field()
  @Length(2)
  user_id: string

  @Property()
  @Field()
  date: string
}
