import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * @class RoutesController
 * @description This controller exposes endpoints for managing delivery routes and stops.
 * @tags routes
 */
@ApiTags('routes')
@ApiBearerAuth()
@Controller('routes')
@UseGuards(JwtAuthGuard)
export class RoutesController {
  /**
   * @constructor
   * @param {RoutesService} routesService - Service for route-related business logic.
   */
  constructor(private readonly routesService: RoutesService) {}

  /**
   * @method create
   * @description Creates a new delivery route.
   * @param {CreateRouteDto} createRouteDto - The data needed to create the route.
   * @returns {Promise<Route>} A promise that resolves to the newly created route.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Create a new delivery route' })
  @ApiResponse({ status: 201, description: 'The route has been successfully created.' })
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  /**
   * @method findAll
   * @description Retrieves all delivery routes.
   * @returns {Promise<Route[]>} A promise that resolves to an array of all routes.
   */
  @Get()
  @ApiOperation({ summary: 'Get all delivery routes' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all routes.' })
  async findAll() {
    return this.routesService.findAll();
  }

  /**
   * @method myRoutes
   * @description Retrieves all routes assigned to the currently authenticated driver.
   * @param {Request} req - The Express request object, containing the authenticated user data.
   * @returns {Promise<Route[]>} A promise that resolves to an array of the driver's routes.
   */
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles('driver')
  @ApiOperation({ summary: 'Get routes assigned to the current driver' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved driver\'s routes.' })
  async myRoutes(@Req() req: any) {
    return this.routesService.findDriverRoutes(req.user.id, req.user.tenantId);
  }

  /**
   * @method findOne
   * @description Retrieves a single route by its unique ID.
   * @param {string} id - The unique identifier of the route.
   * @returns {Promise<Route>} A promise that resolves to the requested route.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single route by its ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the route.' })
  @ApiResponse({ status: 404, description: 'Route not found.' })
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  /**
   * @method update
   * @description Updates an existing delivery route.
   * @param {string} id - The unique identifier of the route to update.
   * @param {UpdateRouteDto} updateRouteDto - The data to update the route with.
   * @returns {Promise<Route>} A promise that resolves to the updated route.
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Update an existing route' })
  @ApiResponse({ status: 200, description: 'The route has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Route not found.' })
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  /**
   * @method assignDriver
   * @description Assigns a driver to a specific route.
   * @param {string} id - The unique identifier of the route.
   * @param {object} body - The request body containing the driver's user ID.
   * @param {string} body.driverUserId - The ID of the driver to assign.
   * @returns {Promise<Route>} A promise that resolves to the updated route.
   */
  @Post(':id/assign-driver')
  @UseGuards(RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Assign a driver to a route' })
  @ApiResponse({ status: 200, description: 'Driver successfully assigned to the route.' })
  @ApiResponse({ status: 404, description: 'Route not found.' })
  async assignDriver(@Param('id') id: string, @Body() body: { driverUserId: string }) {
    return this.routesService.assignDriver(id, body.driverUserId);
  }

  /**
   * @method remove
   * @description Deletes a route.
   * @param {string} id - The unique identifier of the route to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ops', 'admin')
  @ApiOperation({ summary: 'Delete a route' })
  @ApiResponse({ status: 200, description: 'The route has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Route not found.' })
  async remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }

  /**
   * @method completeStop
   * @description Marks a specific stop on a route as complete and records proof of delivery.
   * @param {string} routeId - The ID of the route the stop belongs to.
   * @param {string} stopId - The ID of the stop to complete.
   * @param {CompleteStopDto} dto - The data for the proof of delivery.
   * @returns {Promise<object>} A promise that resolves to an object containing the completed stop and ePOD information.
   */
  @Post(':routeId/stops/:stopId/complete')
  @UseGuards(RolesGuard)
  @Roles('driver', 'ops', 'admin')
  @ApiOperation({ summary: 'Complete a route stop and attach ePOD' })
  @ApiResponse({ status: 200, description: 'Stop completed successfully.' })
  @ApiResponse({ status: 404, description: 'Stop not found.' })
  async completeStop(@Param('routeId') routeId: string, @Param('stopId') stopId: string, @Body() dto: CompleteStopDto) {
    return this.routesService.completeStop({ ...dto, routeId, stopId });
  }
}