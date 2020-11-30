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

            <!--
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-variant="primary"
              class="d-inline-block"
            >-->
            <b-card title="Vuelos de llegada" class="mb-3">
              <b-table 
              selectable
              select-mode="single"
              @row-selected="onRowSelected"
              fixed 
              sticky-header="300px" 
              no-border-collapse 
              striped 
              hover 
              :items="itemsArrival" 
              :fields="fieldsArrival"></b-table>
            </b-card>

            <b-card title="Vuelos de salida">
              <b-table 
              selectable
              select-mode="single"
              @row-selected="onRowSelected"
              fixed 
              sticky-header="300px" 
              no-border-collapse 
              striped 
              hover 
              :items="itemsDeparture" 
              :fields="fieldsDeparture"></b-table>
            </b-card>
            <!--</b-overlay>-->

            <b-modal id="bv-modal-example" hide-footer>
                <div class="d-block text-center">
                    <h3>¿Añadir a mis vuelos?</h3>
                </div>
                <b-button class="mt-3" block @click="updateDataUser">Agregar</b-button>
            </b-modal>

        </b-container>

        <!-- OVERLAY Temporizado-->
        <b-overlay :show="busy" no-wrap>
          <template #overlay>
            <div class="text-center p-4 bg-primary text-light rounded">
              <b-icon icon="cloud-upload" font-scale="4"></b-icon>
              <div class="mb-3">Processing...{{counter}}%</div>
              <b-progress
                min="0"
                max="100"
                :value="counter"
                variant="success"
                height="3px"
                class="mx-n4 rounded-0"
              ></b-progress>
            </div>
          </template>
        </b-overlay>
        <!-- Fin de prueba OVERLAY Temporizado-->
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
          { isActive: true, icaoAirline: '', iataArrival: '', iataDeparture: '', Desde: '----', Hora: '----', Vuelo: '----', Aerolinea: '----', Status: '----' }
        ],
        // Note `isActive` is left out and will not appear in the rendered table
        fieldsDeparture: ['Vuelo', 'Hacia', 'Aerolinea', 'Hora', 'Status'],
        itemsDeparture: [
          { isActive: true, icaoAirline: '', iataArrival: '', iataDeparture: '', Hacia: '----', Hora: '----', Vuelo: '----', Aerolinea: '----', Status: '----' }
        ],
        f_airport: null,
        optionsAirports: [
            { text: '--', value: '--' }
        ],
        busy: false,
        selected: [],
        counter: 1,
        interval: null
      }
    },
    methods:{
      onRowSelected(items){
          if(this.$root.userCurrent !== ''){
              this.selected = items;
              this.$bvModal.show('bv-modal-example');
          }
      },
      async updateDataUser(){
            this.$bvModal.hide('bv-modal-example');
            if (this.selected[0].icaoAirline !== '' && this.selected[0].Vuelo !== '' && this.selected[0].iataArrival !== '' && this.selected[0].iataDeparture !== '') {
                let dataUser = {email: this.$root.userCurrent.email, info: {departure: this.selected[0].iataDeparture, arrival: this.selected[0].iataArrival, airline: this.selected[0].icaoAirline, flight: this.selected[0].Vuelo}};
                let trackAPI = new service();
                await trackAPI.postDataUser(dataUser);
                this.$root.userCurrent.info[this.$root.userCurrent.info.length] = dataUser.info;
            } else {
                alert('No se dispone de la informacón suficiente para identificar el vuelo.');
            }
      },
      onOK() {
        this.counter = 0;
        // Simulate an async request
        this.clearInterval();
        this.interval = setInterval(() => {
          if (this.counter < 100) {
            this.counter = this.counter + 5;
          } else {
            this.clearInterval();
            this.$nextTick(() => {
              this.busy = false;
            });
          }
        }, 350);
      },
      clearInterval() {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
      },
      async previewLoad(){
        this.busy = true;
        try {
          this.onOK();
          await this.loadTimesTables();
        } catch (error) {
          this.busy = false;
          console.log(error);
        }
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
              Vuelo: element.flight.number,
              Aerolinea: element.airline.name,
              icaoAirline: element.airline.icaoCode,
              iataDeparture: this.f_airport,
              iataArrival: element.arrival.iataCode,
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
              Vuelo: element.flight.number,
              Aerolinea: element.airline.name,
              icaoAirline: element.airline.icaoCode,
              iataDeparture: element.departure.iataCode,
              iataArrival: this.f_airport,
              Desde: element.departure.iataCode,
              Status: element.status,
              Hora: element.departure.scheduledTime
            }
          });
          this.itemsArrival = arrayItem;
        }

        this.busy = false;
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