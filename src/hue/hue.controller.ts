import { Controller, Get, Query, Post } from '@nestjs/common';
import {HueService} from './hue.service';
import { stringify } from 'querystring';
import { get } from 'http';

@Controller('hue')
export class HueController {

    

    constructor(private hueService:HueService)
    {}

    @Get("/color")
    setColor(@Query("hue")hue:number)
    {
        return this.hueService.setColor(hue);
    }

    @Get("/roku")
    setRoku(@Query("ip") ip:string)
    {
        return this.hueService.setRokuIP(ip);
    }

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
        this.hueService.setHueIP(bridge);
        return data;
    }
}
