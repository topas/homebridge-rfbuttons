var Service, Characteristic;
var rpi433 = require('rpi-433');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-rfbutton", "RFButton", RFButtonAccessory);
}

function RFButtonAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.buttonName = config["button_name"] || this.name; // fallback to "name" if you didn't specify an exact "button_name"
  this.state = 0; // default state is OFF
  this.pin = config["pin"] || 2; // Listen on GPIO 2 (or Physical PIN 13)
  this.delay = config["delay"] || 500; // Wait 500 ms before reading another code

  this.service = new Service.ContactSensor();
    
  this.log("RF button '" + this.buttonName + "' init...");

  var rfSniffer = rpi433.sniffer({
      pin: this.pin,                     
      debounceDelay: this.delay          
   });

  var self = this;

  rfSniffer.on('data', function (data) {
    console.log('Code received: '+ data.code +' pulse length : ' + data.pulseLength);
    self.state = self.state == 1 ? 0 : 1;
    self.service.getCharacteristic(Characteristic.ContactSensorState).setValue(self.state == 1 ?
				Characteristic.ContactSensorState.CONTACT_DETECTED : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
  });

}

RFButtonAccessory.prototype.getServices = function() {  
    return [this.service];
}
