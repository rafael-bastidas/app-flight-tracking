<template>
    <div>
        <b-container fluid>        
            <b-card title="Aeropuerto" class="text-center mb-4 mt-2">     
                <b-row class="mt-4">
                    <b-col md="9">
                        <b-input-group size="md" class="mb-2 ml-4">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-map-marker-alt"></i>
                            </b-input-group-prepend>
                            <b-form-input v-on:update="loadAutoComplete3" list="list-airport" v-model="f_airport" type="text" placeholder="Aeropuerto" class="bg-light"></b-form-input>
                            <datalist id="list-airport">
                                <option>Cargando opciones...</option>
                                <option v-for="optionAirport in optionsAirports" :key="optionAirport.value">
                                    {{ optionAirport.text }}
                                </option>
                            </datalist>
                        </b-input-group>
                    </b-col>
                    <b-col md="3">
                          <b-button v-on:click="previewLoad" variant="primary">Cargar Información</b-button>
                    </b-col>
                </b-row>
            </b-card>
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-variant="primary"
              class="d-inline-block"
            >
            <b-card title="Vuelos de llegada" class="mb-3">
              <b-table fixed sticky-header="300px" no-border-collapse striped hover :items="itemsArrival" :fields="fieldsArrival"></b-table>
            </b-card>

            <b-card title="Vuelos de salida">
              <b-table fixed sticky-header="300px" no-border-collapse striped hover :items="itemsDeparture" :fields="fieldsDeparture"></b-table>
            </b-card>
            </b-overlay>
        </b-container>
    </div>
</template>

<script>
import service from '../service/trankingService';
  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fieldsArrival: ['Vuelo', 'Desde', 'Aerolinea', 'Hora', 'Status'],
        itemsArrival: [
          { isActive: true, Desde: '----', Hora: '----', Vuelo: '----', Aerolinea: '----', Status: '----' }
        ],
        // Note `isActive` is left out and will not appear in the rendered table
        fieldsDeparture: ['Vuelo', 'Hacia', 'Aerolinea', 'Hora', 'Status'],
        itemsDeparture: [
          { isActive: true, Hacia: '----', Hora: '----', Vuelo: '----', Aerolinea: '----', Status: '----' }
        ],
        f_airport: null,
        optionsAirports: [
            { text: '--', value: '--' }
        ],
        busy: false,
      }
    },
    methods:{
      async previewLoad(){
        this.busy = true;
        try {
          await this.loadTimesTables();
        } catch (error) {
          console.log(error);
        }
        this.busy = false;
      },
      async loadTimesTables(){
        this.itemsDeparture = [];
        let arrayItem = [];
        let trackAPI = new service();
        let dataFligth_out = await trackAPI.getTimeTables(this.f_airport, 'departure');
        if (typeof dataFligth_out[0] !== 'undefined'){
          dataFligth_out.forEach(element => {
            arrayItem[arrayItem.length] = {
              isActive: false,
              Vuelo: element.flight.iataNumber,
              Aerolinea: element.airline.name,
              Hacia: element.arrival.iataCode,
              Status: element.status,
              Hora: element.arrival.scheduledTime
            }
          });
          this.itemsDeparture = arrayItem;
        }

        this.itemsArrival = [];
        arrayItem = [];
        //trackAPI = new service();
        let dataFligth_in = await trackAPI.getTimeTables(this.f_airport, 'arrival');
        if (typeof dataFligth_in[0] !== 'undefined'){
          dataFligth_in.forEach(element => {
            arrayItem[arrayItem.length] = {
              isActive: false,
              Vuelo: element.flight.iataNumber,
              Aerolinea: element.airline.name,
              Desde: element.departure.iataCode,
              Status: element.status,
              Hora: element.departure.scheduledTime
            }
          });
          this.itemsArrival = arrayItem;
        }
      },
      async loadAutoComplete3(){
            if(this.f_airport.length>2){
                this.optionsAirports = [];
                let arrayItem = [];
                let trackAPI = new service();
                let dataAirport = await trackAPI.getAutoComplete(this.f_airport);

                await (() => {
                    if (typeof dataAirport.cities !== 'undefined'){
                        if (dataAirport.cities.length < 21) {
                            dataAirport.airportsByCities.forEach(element => {
                                let opcionalElement;
                                typeof dataAirport.cities[arrayItem.length] === 'undefined' ? opcionalElement = element.codeIataCity : opcionalElement = dataAirport.cities[arrayItem.length].nameCity;
                                arrayItem[arrayItem.length] = {
                                    text: opcionalElement +' - '+ element.codeIso2Country +' || '+ element.codeIataCity +' - '+ element.codeIcaoAirport,
                                    value: element.codeIcaoAirport
                                }
                            });
                            this.optionsAirports = arrayItem;
                        }
                    }else if (typeof dataAirport.cities === 'undefined') {
                        let icaoCodeAirport = this.f_airport.split(' || ');
                        icaoCodeAirport = icaoCodeAirport[1].split(' - ');
                        if (typeof icaoCodeAirport[0] !== 'undefined'){
                            this.f_airport = icaoCodeAirport[0].replace(' -','');
                        }
                    }
                })();
            }
        }
    }
  }
</script>