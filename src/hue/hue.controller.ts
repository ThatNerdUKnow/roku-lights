import { Controller, Get, Query } from '@nestjs/common';
import {HueService} from './hue.service';
import { stringify } from 'querystring';

@Controller('hue')
export class HueController {

    

    constructor(private hueService:HueService)
    {}

    

    @Get("/discover")
    async discover()
    {
        console.log(await this.hueService.discover());
        
        return await this.hueService.discover();
    }

    @Get("/register")
    async register(@Query('bridge')bridge:string)
    {
        
        let data= await this.hueService.register(bridge);
        return data;
    }
}
