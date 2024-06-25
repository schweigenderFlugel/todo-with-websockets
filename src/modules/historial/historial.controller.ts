import { Controller, Get, Post, Put, Param, Body, Req } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { HistorialService } from './historial.service';
import { ObjectIdPipe } from 'src/common/pipes/object-id.pipe';
import { Historial } from './historial.schema';
import { UserRequest } from 'src/common/interfaces/auth.interface';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get(':id')
  async getHistorial(
    @Param('id', ObjectIdPipe) id: ObjectId,
  ): Promise<Historial> {
    return await this.historialService.getHistorial(id);
  }

  @Post()
  async createHistorial(@Req() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.historialService.createHistorial(userId);
  }

  @Put()
  async updateHistorial(
    @Req() req: UserRequest,
    @Body() data: any,
  ): Promise<void> {
    const userId = req.user.id;
    return await this.historialService.updateHistorial(userId, data);
  }
}
