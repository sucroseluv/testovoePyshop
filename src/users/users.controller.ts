import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getInfo(@Req() req: Request) {
    return this.usersService
      .findById(req.user['sub'])
      .select('-_id -refreshToken -password -__v');
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(req.user['sub'], updateUserDto);
    return res.redirect('/users/me');
  }

  @UseGuards(AccessTokenGuard)
  @Delete('me')
  remove(@Req() req: Request) {
    return this.usersService.remove(req.user['sub']);
  }
}
