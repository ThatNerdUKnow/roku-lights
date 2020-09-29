import { Injectable, HttpService, HttpException, HttpCode, HttpStatus } from '@nestjs/common';


@Injectable()
export class HueService {
    

   constructor(private http:HttpService)
   {
    this.setColor(0);
   }

   private color;
   private username;

   setColor(hue:number)
   {
      if(hue <= 65535|| hue >=0)
      {
        this.color = hue;
      }
      else
      {
          throw new HttpException("Maximum value is 65535",HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

    async discover()
    {
        // discovery.meethue.com
        let ipRange;
        await this.http.get("http://discovery.meethue.com").toPromise().then((response)=>{
            ipRange = response.data[0];
            
        })
        return ipRange
    }

    async register(ip:string)
    {
        let body = {"devicetype":"roku-lights"}
        let data;
        await this.http.post(`http://${ip}/api`,body).toPromise().then((response)=>{
            try{
            this.username = response.data[0].success.username
            console.log(this.username);
            }
            catch(err){console.log(err)}
            data = response.data;
        })
        return data;
    }


}
