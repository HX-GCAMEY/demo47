import { Injectable, Inject } from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todos.entity';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    @InjectRepository(Todo)
    private readonly todosDbRepository: Repository<Todo>,
    @Inject('ACCESS_TOKEN') private accessToken: string,
  ) {}

  // getTodos() {
  //   return this.accessToken === 'Unaclavesecreta'
  //     ? this.todosRepository.getTodos()
  //     : 'No tienes accesso bro';
  // }
  getTodos() {
    return this.todosDbRepository.find({
      relations: ['files'],
    });
  }

  findById(id: number) {
    return this.todosDbRepository.findOneBy({ id });
  }

  createTodo(todo: Todo) {
    return this.todosDbRepository.save(todo);
  }
}
