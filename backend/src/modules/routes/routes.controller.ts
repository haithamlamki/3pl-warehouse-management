import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('routes')
@ApiBearerAuth()
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Create route' })
  @ApiResponse({ status: 201, description: 'Route created' })
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: 200, description: 'Routes retrieved' })
  async findAll() {
    return this.routesService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'Get routes assigned to current driver' })
  @ApiResponse({ status: 200, description: 'Driver routes retrieved' })
  async myRoutes(@Req() req: any) {
    return this.routesService.findDriverRoutes(req.user.id, req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiResponse({ status: 200, description: 'Route retrieved' })
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Update route' })
  @ApiResponse({ status: 200, description: 'Route updated' })
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Post(':id/assign-driver')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Assign driver to route' })
  @ApiResponse({ status: 200, description: 'Driver assigned' })
  async assignDriver(@Param('id') id: string, @Body() body: { driverUserId: string }) {
    return this.routesService.assignDriver(id, body.driverUserId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Delete route' })
  @ApiResponse({ status: 200, description: 'Route deleted' })
  async remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }

  @Post(':routeId/stops/:stopId/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver', 'ops', 'admin')
  @ApiOperation({ summary: 'Complete a route stop and attach ePOD' })
  @ApiResponse({ status: 200, description: 'Stop completed with ePOD' })
  async completeStop(@Param('routeId') routeId: string, @Param('stopId') stopId: string, @Body() dto: CompleteStopDto) {
    return this.routesService.completeStop({ ...dto, routeId, stopId });
  }
}
