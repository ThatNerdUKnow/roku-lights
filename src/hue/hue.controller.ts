import { Controller, Get, Query, Post, Body, Req,Request } from '@nestjs/common';
import {HueService} from './hue.service';
import { stringify } from 'querystring';
import { get } from 'http';
import { settingsDTO } from './settingsDTO';

@Controller('hue')
export class HueController {

    

    constructor(private hueService:HueService)
    {}

    @Get("/group")
    setGroup(@Query("group")group:number)
    {
        return this.hueService.setGroup(group);
    }
    
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

    @Post("/settings")
    async set(@Body() settings:settingsDTO)
    {
        
        if(settings.bridgeIp)
        {
            this.hueService.setHueIP(settings.bridgeIp);
        }

        if(settings.hue)
        {
            this.hueService.setColor(settings.hue);
        }

        if(settings.hueGroup)
        {
            this.hueService.setGroup(settings.hueGroup);
        }

        if(settings.lightness)
        {
            
        }

        if(settings.rokuIP)
        {
            this.hueService.setRokuIP(settings.rokuIP);
        }

        if(settings.sat)
        {
            
        }
        return settings;
    }
}
