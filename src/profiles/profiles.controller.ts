import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile-dto';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { ProfilesService } from './profiles.service';
import { ProfilesGuard } from './profiles.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private ProfilesService: ProfilesService) {}

  // GET /profiles
  @Get()
  findAll() {
    try {
      return this.ProfilesService.findAll();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  // GET /profiles/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ProfilesService.findOne(id);
  }

  // POST /profiles
  @Post()
  create(@Body(new ValidationPipe()) CreateProfileDto: CreateProfileDto) {
    return this.ProfilesService.save(CreateProfileDto);
  }

  // PUT /profiles/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) UpdateProfileDto: UpdateProfileDto,
  ) {
    return this.ProfilesService.edit(id, UpdateProfileDto);
  }

  // DELETE /profiles/:id
  @Delete(':id')
  @UseGuards(ProfilesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ProfilesService.destroy(id);
  }
}
