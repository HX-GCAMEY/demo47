import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  UseInterceptors,
  Post,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(
    private todosService: TodosService,
    private filesService: FilesService,
  ) {}

  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Post()
  createTodo(@Body() todo: any) {
    return this.todosService.createTodo(todo);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const todo = await this.todosService.findById(id);

    return this.filesService.saveFile({
      name: file.originalname,
      mimeType: file.mimetype,
      data: file.buffer,
      todo,
    });
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getTodoById(@Param('id') id: number) {
    console.log(typeof id);
    return `Este es el todo con id ${id}`;
  }
}
