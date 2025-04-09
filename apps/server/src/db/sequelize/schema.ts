import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @Column(DataType.STRING(255))
  name: string;

  @Column(DataType.INTEGER)
  age: number;
}
