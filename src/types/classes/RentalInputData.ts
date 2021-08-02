import { Property } from '@mikro-orm/core'
import { Field, InputType } from 'type-graphql'

@InputType()
export class RentalInputData {
  @Property()
  @Field()
  movie_id: string

  @Property()
  @Field()
  user_id: string

  @Property()
  @Field()
  date: string
}
