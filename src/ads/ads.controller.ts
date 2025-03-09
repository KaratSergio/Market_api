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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Announcements')
@Controller('ad')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // CREATE AD
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ad' })
  @ApiResponse({ status: 201, description: 'Ad created successfully' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  create(
    @Request() req: any,
    @Body() createAdDto: CreateAdDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.adsService.create(
      req.user.id,
      createAdDto,
      files?.images || [],
    );
  }

  // GET ADS LIST
  @ApiOperation({ summary: 'Get all ads' })
  @ApiResponse({ status: 200, description: 'Returns a list of ads' })
  @Get('list')
  findAll() {
    return this.adsService.findAll();
  }

  // GET BY ID AD
  @ApiOperation({ summary: 'Get ad by ID' })
  @ApiResponse({ status: 200, description: 'Ad found' })
  @ApiResponse({ status: 404, description: 'Ad not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  // UPDATE AD
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ad' })
  @ApiResponse({ status: 200, description: 'Ad updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() UpdateAdDto: UpdateAdDto,
  ) {
    return this.adsService.update(id, req.user.id, UpdateAdDto);
  }

  // DELETE AD
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete ad' })
  @ApiResponse({ status: 200, description: 'Ad deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.adsService.remove(id, req.user.id);
  }
}
