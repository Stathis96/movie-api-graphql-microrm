
import { IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class MovieInputData {
  @Field()
  @IsString()
  title: string

  @Field(() => [String])
  @IsString({ each: true })
  genres: string[]
}
