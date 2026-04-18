import { HttpStatus, Injectable } from '@nestjs/common';
import { update_restaurantDto } from './dto/update-data.dto';
import { Restaurant, RestaurantDocument } from './schema/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CustomError from '../utils/customError.utils';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // GET: /restaurant/
  async getAllRestaurant() {
    const restaurants = await this.restaurantModel.find();

    if (restaurants.length <= 0)
      throw new CustomError('No restaurants registered', HttpStatus.NOT_FOUND);

    return restaurants;
  }

  // PUT: /restaurant/:id
  async updateRestaurantData(
    id: string,
    { restaurantName }: update_restaurantDto,
  ) {
    if (!id)
      throw new CustomError(
        'Please pass the restaurant Id',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant)
      throw new CustomError('Restaurant Not found', HttpStatus.NOT_FOUND);

    if (restaurantName) restaurant.restaurantName = restaurantName;

    const updatedRestaurand = restaurant.save({ validateModifiedOnly: true });

    return updatedRestaurand;
  }
}
