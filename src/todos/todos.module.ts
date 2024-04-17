import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controllers';
import { TodosRepository } from './todos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { File } from './files.entity';
import { FilesService } from './files.service';

const ACCESS = 'Estanoes';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, File])],
  controllers: [TodosController],
  providers: [
    TodosService,
    FilesService,
    TodosRepository,
    {
      provide: 'ACCESS_TOKEN',
      useValue: ACCESS,
    },
  ],
})
export class TodosModule {}
