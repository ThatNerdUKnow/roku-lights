import { Injectable, HttpService } from '@nestjs/common';


@Injectable()
export class HueService {
    

   constructor(private http:HttpService)
   {

   }

   private username;

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
