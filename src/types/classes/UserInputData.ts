import { IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UserInputData {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsString()
  dateOfBirth: string

  @Field()
  @IsString()
  dateOfRegistration: string
}
