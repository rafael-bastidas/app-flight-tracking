class ServiceTracking {

    constructor() {
      this.key = '8af1a5-06b638';
      this.URI1 = 'https://aviation-edge.com/v2/public/flights?';
      this.URI2 = 'https://aviation-edge.com/v2/public/routes?';
      this.URI3 = 'https://aviation-edge.com/v2/public/timetable?';
      this.URI4= 'https://aviation-edge.com/v2/public/autocomplete?';
      this.URI5 = 'https://aviation-edge.com/v2/public/airlineDatabase?';
    }

    async getAutoComplete(city){
        const response = await fetch(`${this.URI4}key=${this.key}&city=${city}`, {
          method: 'GET'
        });
        const data = await response.json();
        return data;
    }

    async getInfoAirline(iata, icao){
      console.log('icao: '+icao);
      const response = await fetch(`${this.URI5}key=${this.key}&codeIataAirline=${iata}`, {
        method: 'GET'
      });
      const data = await response.json();
      let nameAirline = '';
      if(typeof data[0] !== 'undefined'){
        if(data.length === 1){
          nameAirline = data[0].nameAirline;
        } else{
          data.forEach(element => {
            if (element.codeIcaoAirline === icao){
              nameAirline = element.nameAirline;
            }
          });
        }
      }

      if(nameAirline === ''){
        nameAirline = '---';
      }
      return nameAirline;
    }
  
    async getFligth(center, radio){
        const response = await fetch(`${this.URI1}key=${this.key}&lat=${center.lat}&lng=${center.lng}&distance=${radio}`, {
          method: 'GET'
        });
        const data = await response.json();
        return data;
    }

    async getInfoFlight(departure, arrival){
      console.log(departure + ' -> ' + arrival);
        const response = await fetch(`${this.URI2}key=${this.key}&departureIata=${departure}&arrivalIata=${arrival}`, {
          method: 'GET'
        });
        const data = await response.json();
        console.log(data);
        return data;
    }

    async getTimeTables(iataCode, type){
      const response = await fetch(`${this.URI3}key=${this.key}&iataCode=${iataCode}&type=${type}`, {
        method: 'GET'
      });
      const data = await response.json();
      return data;
  }
  
  getFligthPRUEBA(center, radio){
      const data = [
        {
          "geography": { 
            "latitude": 51.505, 
            "longitude": -0.09, 
            "altitude": 7833.36, 
            "direction": 70 
            }, 
            "speed": { 
            "horizontal": 833.4, 
            "isGround": 0, 
            "vertical": 0 
            }, 
            "departure": { 
            "iataCode": "CCS", 
            "icaoCode": "CYHM" 
            }, 
            "arrival": { 
            "iataCode": "BOG", 
            "icaoCode": "CYQM" 
            }, 
            "aircraft": { 
            "icaoCode": "B763", 
            "regNumber": "CGYAJ", 
            "icao24": "C08412" 
            }, 
            "airline": { 
            "iataCode": "W8", 
            "icaoCode": "CJT" 
            }, 
            "flight": { 
            "iataNumber": "W8620", 
            "icaoNumber": "CJT620", 
            "number": "620" 
            }, 
            "system": { 
            "updated": 1513148168, 
            "squawk": "0000" 
            }, 
            "status": "en-route" 
        },
        {
          "geography": { 
            "latitude": 51.503, 
            "longitude": -0.07, 
            "altitude": 7833.36, 
            "direction": 70 
            }, 
            "speed": { 
            "horizontal": 833.4, 
            "isGround": 0, 
            "vertical": 0 
            }, 
            "departure": { 
            "iataCode": "MIA", 
            "icaoCode": "CYHM" 
            }, 
            "arrival": { 
            "iataCode": "LIM", 
            "icaoCode": "CYQM" 
            }, 
            "aircraft": { 
            "icaoCode": "B767", 
            "regNumber": "CGYAJ", 
            "icao24": "C08412" 
            }, 
            "airline": { 
            "iataCode": "W8", 
            "icaoCode": "ESTELLAR" 
            }, 
            "flight": { 
            "iataNumber": "W8620", 
            "icaoNumber": "CJT620", 
            "number": "620" 
            }, 
            "system": { 
            "updated": 1513148168, 
            "squawk": "0000" 
            }, 
            "status": "en-route" 
        }
        ];
      return data;
    }
  
    getInfoFlightPRUEBA(a, b){
      const data = [
        { "departureIata": "OTP",
          "departureIcao": "LROP",
          "departureTerminal": null,
          "departureTime": "09:15:00",
          "arrivalIata": "TRN",
          "arrivalIcao": "LIMF",
          "arrivalTerminal": null,
          "arrivalTime": "10:45:00",
          "airlineIata": "0B",
          "airlineIcao": "BMS",
          "flightNumber": "101",
          "codeshares": null,
          "regNumber": "YR-BAP"
        },
        { "departureIata": "OTP",
          "departureIcao": "LROP",
          "departureTerminal": null,
          "departureTime": "09:15:00",
          "arrivalIata": "TRN",
          "arrivalIcao": "LIMF",
          "arrivalTerminal": null,
          "arrivalTime": "10:45:00",
          "airlineIata": "0B",
          "airlineIcao": "BMS",
          "flightNumber": "101",
          "codeshares": null,
          "regNumber": "YR-BAP"
        }
      ];
      return data;
    }

    getSimulateTables(a, b){
      const dataDeparture = [
        {
          airline: {
              iataCode: "9V",
              icaoCode: "ROI",
              name: "Avior"},
          arrival: {
              actualRunway: null,
              actualTime: null,
              baggage: null,
              delay: null,
              estimatedRunway: null,
              estimatedTime: null,
              gate: null,
              iataCode: "BLA",
              icaoCode: "SVBC",
              scheduledTime: "2020-09-08T21:15:00.000",
              terminal: null},
          codeshared: null,
          departure: {
              actualRunway: null,
              actualTime: null,
              baggage: null,
              delay: null,
              estimatedRunway: null,
              estimatedTime: null,
              gate: null,
              iataCode: "CCS",
              icaoCode: "SVMI",
              scheduledTime: "2020-09-08T20:30:00.000",
              terminal: null},
          flight: {
              iataNumber: "9V42",
              icaoNumber: "ROI42",
              number: "42"},
          status: "scheduled",
          type: "departure"
        }
      ];

      const dataArrival = [
        {
          airline: {
            iataCode: "P5",
            icaoCode: "RPB",
            name: "Copa Airlines Colombia"},
          arrival: {
            actualRunway: null,
            actualTime: null,
            baggage: null,
            delay: null,
            estimatedRunway: null,
            estimatedTime: null,
            gate: null,
            iataCode: "CCS",
            icaoCode: "SVMI",
            scheduledTime: "2020-09-08T20:07:00.000",
            terminal: null},
          codeshared: null,
          departure: {
            actualRunway: null,
            actualTime: null,
            baggage: null,
            delay: null,
            estimatedRunway: null,
            estimatedTime: null,
            gate: null,
            iataCode: "BOG",
            icaoCode: "SKBO",
            scheduledTime: "2020-09-08T17:10:00.000",
            terminal: null},
          flight: {
            iataNumber: "P57010",
            icaoNumber: "RPB7010",
            number: "7010"},
          status: "scheduled",
          type: "arrival"
        }
      ];

      if (b === 'departure'){
        return dataDeparture;
      }else if (b === 'arrival'){
        return dataArrival;
      }
    }
  
    
  }
  
  //tambien se puede exportar con module.exports = BookService;
  export default ServiceTracking;
  
