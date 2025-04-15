import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
