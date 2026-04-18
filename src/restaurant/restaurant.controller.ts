import { Body, Controller, Param, Put, Get } from '@nestjs/common';
import { update_restaurantDto } from './dto/update-data.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}
  @Get('/')
  getAllRestaurant() {
    return this.restaurantService.getAllRestaurant();
  }

  @Put(':id')
  updateRestaurant(
    @Param('id') id: string,
    @Body() data: update_restaurantDto,
  ) {
    return this.restaurantService.updateRestaurantData(id, data);
  }
}
