# Homebridge plugin for RF433 / RF315 receiver on Raspberry PI

Plugin for receiving multiple RF buttons codes using Raspberry PI. No root access rights needed but the user account for running homebridge service should be in `gpio` group. 

RF buttons will appear as stateless programmable buttons in Homekit (supported since iOS 10.3) so you can simply assign button actions in Homekit app.

Every button can be triggered by multiple RF codes. It can be useful for joining multiple RF buttons to one Homekit button.

## Raspberry PI Wiring 

It's very simple: RF433 / RF315 receiver has 3 wires: +5V, GND and data output. Data output should go to GPIO2 ([pin number 27 on Raspberry PI 2 and 3](https://projects.drogon.net/raspberry-pi/wiringpi/pins/)) or just follow this [tutorial how to connect RF receiver to Raspberry PI](http://www.princetronics.com/how-to-read-433-mhz-codes-w-raspberry-pi-433-mhz-receiver/).

## Wall Buttons (switches) tips

Cheap from Aliexpress: 
 - [86 Wall Panel Remote Transmitter with 1, 2 or 3 Buttons](https://www.aliexpress.com/item/86-Wall-Panel-Remote-Transmitter-1-2-3-Button-Sticky-RF-TX-Smart-Home-Room-Living/32676914264.html?spm=2114.13010608.0.0.hg1sfc)
 // The seller offers a lof of 433 Mhz remote controls, not just wall buttons

 - [VHome seller](https://www.aliexpress.com/store/group/Switch-shape-remote-control/1112973_510025631/1.html?spm=2114.12010612.0.0.ZfO0nC&SortType=bestmatch_sort&g=y)
 // Better design, only "touch" version

## How to install 

Install [wiringPi](https://projects.drogon.net/raspberry-pi/wiringpi/) library using [this tutorial](https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/). 

OR here is simplified version: 

```bash
pi@raspberrypi ~ $ git clone git://git.drogon.net/wiringPi
...
pi@raspberrypi ~ $ cd wiringPi/wiringPi
pi@raspberrypi ~/wiringPi/wiringPi $ sudo su
...
root@raspberrypi:/home/pi/wiringPi/wiringPi# ./build
```

## Homebridge Configuration 

```json
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "011-22-333"
    },

    "description": "This is an example configuration file with one fake accessory and one fake platform. You can use this as a template for creating your own configuration file containing devices you actually own.",

    "accessories": [],
    "platforms": [
        {
           "platform": "RFButtons",
           "pin": 2,
           "debounceDelay": 300,
           "buttons": [
             {
                "name": "Switch1",
                "codes": [2184098]
             },
             {
                "name": "Switch2",
                "codes": [2184104]
             },
             {
                "name": "Switch3",
                "codes": [2184100]
             }
           ]

        }
   ]
}
```

## Credits 

- [rpi-433 npm package](https://www.npmjs.com/package/rpi-433)
- [wiringPi library](https://projects.drogon.net/raspberry-pi/wiringpi/)
- Based on: [homebridge-platform-rcswitch](https://github.com/rainlake/homebridge-platform-rcswitch)
