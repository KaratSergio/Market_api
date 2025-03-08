import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestWithUser } from '@common/interfaces/request.interface';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Announcements')
@Controller('ad')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an ad' })
  @ApiResponse({ status: 201, description: 'Ad created' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() createAdDto: CreateAdDto) {
    return this.adsService.create(req.user.id, createAdDto);
  }

  @ApiOperation({ summary: 'Get all ads' })
  @ApiResponse({ status: 200, description: 'Returns a list of ads' })
  @Get('list')
  findAll() {
    return this.adsService.findAll();
  }

  @ApiOperation({ summary: 'Get ad by ID' })
  @ApiResponse({ status: 200, description: 'Ad found' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ad' })
  @ApiResponse({ status: 200, description: 'Ad updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() UpdateAdDto: UpdateAdDto,
  ) {
    return this.adsService.update(id, req.user.id, UpdateAdDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete ad' })
  @ApiResponse({ status: 200, description: 'Ad deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.adsService.remove(id, req.user.id);
  }
}
