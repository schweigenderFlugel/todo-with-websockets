import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { TodoModel } from './todo.model';
import { Todo, TodoSchema } from './todo.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
    ]),
  ],
  providers: [TodoService, TodoModel],
  exports: [TodoService],
})
export class TodoModule {}
