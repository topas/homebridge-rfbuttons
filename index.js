var Service, Characteristic;
var rpi433 = require('rpi-433');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerPlatform("homebridge-rcbuttons", "RCButtons", RCButtonsPlatform);
}

function RCButtonsPlatform(log, config) {
    var self = this;
    self.config = config;
    self.log = log;
    self.pin = config["pin"] || 2; // Listen on GPIO 2 (or Physical PIN 13)
    self.delay = config["delay"] || 500; // Wait 500 ms before reading another code

    self.rfSniffer = rpi433.sniffer({
            pin: self.pin,                     
            debounceDelay: self.delay          
        });
}

RCButtonsPlatform.prototype.accessories = function(callback) {
    var self = this;
    self.accessories = [];
    self.config.buttons.forEach(function(sw) {
        self.accessories.push(new RCButtonAccessory(sw, self.log, self.config));
    });

    self.rfSniffer.on('data', function (data) {
        self.log('Code received: '+ data.code +' pulse length : ' + data.pulseLength);
        if(self.accessories) {
            self.accessories.forEach(function(accessory) {
                accessory.notify.call(accessory, data.code);
            });
        }
    });

    callback(self.accessories);
}

function RCButtonAccessory(sw, log, config) {
    var self = this;
    self.name = sw.name;
    self.sw = sw;
    self.log = log;
    self.config = config;
    self.currentState = false;

    self.service = new Service.Switch(self.name);

    self.service.getCharacteristic(Characteristic.On).value = self.currentState;
    
    self.service.getCharacteristic(Characteristic.On).on('get', function(cb) {
        cb(null, self.currentState);
    }.bind(self));
}

RCButtonAccessory.prototype.notify = function(code) {
    var self = this;
    if(this.sw.on.code === code) {
        self.log("%s is turned on", self.sw.name);
        self.service.getCharacteristic(Characteristic.On).setValue(true);
    } else if (this.sw.off.code === code) {
        self.log("%s is turned off", self.sw.name);
        self.service.getCharacteristic(Characteristic.On).setValue(false);
    }
}

RCButtonAccessory.prototype.getServices = function() {
    return [this.service];
}