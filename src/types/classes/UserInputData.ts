import { IsDate, IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UserInputData {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsDate()
  dateOfBirth: string

  @Field()
  @IsString()
  dateOfRegistration: string
}
