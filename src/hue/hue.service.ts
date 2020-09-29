import {
  Injectable,
  HttpService,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class HueService {
  constructor(private http: HttpService) {
    this.setColor(0);
  }

  private color;
  private username;

  setColor(hue: number) {
    if (hue <= 65535 || hue >= 0) {
      this.color = hue;
    } else {
      throw new HttpException(
        'Maximum value is 65535',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async discover() {
    // discovery.meethue.com
    let ipRange;
    await this.http
      .get('http://discovery.meethue.com')
      .toPromise()
      .then(response => {
        ipRange = response.data[0];
      });
    return ipRange;
  }

  async lightsDown() {
    /*
        PUT
        http://192.168.0.167/api/ZVJgckeiew82iNZ8Ip1A-wkrbzObC7JQbsCHXMJw/groups/1/action
        {
            "on":true,
            "hue":9220,
            "bri":254
        }
        */
    await this.http
      .put(
        'http://192.168.0.167/api/ZVJgckeiew82iNZ8Ip1A-wkrbzObC7JQbsCHXMJw/groups/1/action',
        {
          on: true,
          hue: 0,
          bri: 254,
          sat: 254,
        },
      )
      .toPromise()
      .then(res => {
        console.log(res.data);
      });
    return true;
  }

  async lightsUp() {
    await this.http
      .put(
        'http://192.168.0.167/api/ZVJgckeiew82iNZ8Ip1A-wkrbzObC7JQbsCHXMJw/groups/1/action',
        {
          on: true,
          hue: 0,
          bri: 254,
          sat: 0,
        },
      )
      .toPromise()
      .then(res => {
        console.log(res.data);
      });
    return true;
  }
  async register(ip: string) {
    let body = { devicetype: 'roku-lights' };
    let data;
    await this.http
      .post(`http://${ip}/api`, body)
      .toPromise()
      .then(response => {
        try {
          this.username = response.data[0].success.username;
          console.log(this.username);
        } catch (err) {
          console.log(err);
        }
        data = response.data;
      });
    return data;
  }

  pollRoku() {
    setInterval(() => {
      this.http
        .get('http://192.168.0.120:8060/query/media-player')
        .toPromise()
        .then(res => {
          let parseString = require('xml2js').parseString;
          parseString(res.data, (err, result) => {
            let state = result.player.$.state;
            if (state === 'play') {
              this.lightsDown();
            } else if (state === 'pause') {
              this.lightsUp();
            } else if (state === 'close') {
              this.http
                .get('http://192.168.0.120:8060/query/active-app')
                .toPromise()
                .then(res => {
                    parseString(res.data,(err,result)=>{
                        console.log(result);
                        result = JSON.stringify(result);
                        if(!result.includes("Roku"))
                        {
                            // Do nothing
                            this.lightsUp();
                        }
                    })
                });

              
            }
          });
        });
    }, 5000);
  }

  onModuleInit() {
    console.log('init');
    this.pollRoku();
  }
}
