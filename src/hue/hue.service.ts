import {
  Injectable,
  HttpService,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'file-system';
import { settingsDTO } from './settingsDTO';
import * as jsonfile from 'jsonfile';

@Injectable()
export class HueService {
  constructor(private http: HttpService) {
    // this.setColor(0);
    // Get our settings here
  }

  async getSettings() {
    try {
      let test = jsonfile.readFile('settings.json').then(result => {
        this.settings = result;
        if (this.settings === new settingsDTO()) {
          console.log("The api won't work until all settings are set");
        } else {
          console.log(this.settings);
        }
      });
    } catch {
      console.log("Couldn't get settings from settings.json");
    }
  }

  private settings: settingsDTO = new settingsDTO();

  setGroup(group: number) {
    this.settings.hueGroup = group;
    this.saveData();
    console.log('Group has been set');
    return 'Group has been set';
  }

  setColor(hue: number) {
    if (hue <= 65535 || hue >= 0) {
      this.settings.hue = hue;
      this.saveData();
      console.log('Color set successfully');
      return 'Color has set sucessfully';
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

  setHueIP(ip: string) {
    this.settings.bridgeIp = ip;
    this.saveData();
    console.log('Hue bridge IP updated');
    return 'Hue Bridge IP updated';
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
        `http://${this.settings.bridgeIp}/api/ZVJgckeiew82iNZ8Ip1A-wkrbzObC7JQbsCHXMJw/groups/${this.settings.hueGroup}/action`,
        {
          on: true,
          hue: this.settings.hue,
          bri: 254,
          sat: 254,
        },
      )
      .toPromise()
      .then(res => {});
    return true;
  }

  async lightsUp() {
    await this.http
      .put(
        `http://${this.settings.bridgeIp}/api/ZVJgckeiew82iNZ8Ip1A-wkrbzObC7JQbsCHXMJw/groups/${this.settings.hueGroup}/action`,
        {
          on: true,
          hue: 0,
          bri: 254,
          sat: 0,
        },
      )
      .toPromise()
      .then(res => {});
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
          this.settings.username = response.data[0].success.username;
        } catch (err) {
          console.log(err);
        }
        data = response.data;
      });
    this.saveData();
    console.log('Registered Hue Bridge');
    return data;
  }

  pollRoku() {
    setInterval(() => {
      this.http
        .get(`http://${this.settings.rokuIP}:8060/query/media-player`)
        .toPromise()
        .then(res => {
          let parseString = require('xml2js').parseString;
          parseString(res.data, (err, result) => {
            let state = result.player.$.state;
            console.log('State: ' + state);
            if (state === 'open') {
              // Do nothing
            } else if (state === 'play') {
              this.lightsDown();
            } else if (state === 'pause') {
              this.lightsUp();
            } else if (state === 'close') {
              this.http
                .get('http://192.168.0.120:8060/query/active-app')
                .toPromise()
                .then(res => {
                  parseString(res.data, (err, result) => {
                    console.log("Active App:" + JSON.stringify(result['active-app'].app))
                    
                    result = JSON.stringify(result);

                    if (result.includes('tvinput')) {
                      // do nothing
                    } else if (!result.includes('Roku')) {
                      // Turn the lights up

                      this.lightsUp();
                    }
                  });
                });
            }
          });
        });
    }, 5000);
  }

  setRokuIP(ip: string) {
    this.settings.rokuIP = ip;
    this.saveData();
    console.log('Roku IP Updated');
    return 'Roku IP Updated';
  }
  saveData() {
    fs.writeFile('settings.json', JSON.stringify(this.settings));
  }

  async onModuleInit() {
    await this.getSettings().then(() => {});
    this.pollRoku();
  }
}
