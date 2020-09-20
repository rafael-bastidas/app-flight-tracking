<template>
    <div>
        <b-container fluid>        
            <b-card title="Vuelos" class="text-center mb-4 mt-2">     
                <b-row class="mt-4">
                    <b-col md="6">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-plane-departure"></i>
                            </b-input-group-prepend>
                            <b-form-input v-on:update="loadAutoComplete" v-model="departure" list="list-departure" placeholder="Salidas" class="bg-light"></b-form-input>
                            <datalist id="list-departure">
                                <option>Cargando opciones...</option>
                                <option v-for="opcionSalida in opcionesSalida" :key="opcionSalida.value">
                                    {{ opcionSalida.text }}
                                </option>
                            </datalist>
                        </b-input-group>
                    </b-col>
                    <b-col md="6">
                        <b-input-group size="sm" class="mb-2">
                            <b-input-group-prepend is-text>
                                <i class="fas fa-plane-arrival"></i>
                            </b-input-group-prepend>
                            <b-form-input v-on:update="loadAutoComplete2" v-model="arrival" list="list-arrival" placeholder="Llegadas" class="bg-light"></b-form-input>
                            <datalist id="list-arrival">
                                <option>Cargando opciones...</option>
                                <option v-for="opcionLlegada in opcionesLlegada" :key="opcionLlegada.value">
                                    {{ opcionLlegada.text }}
                                </option>
                            </datalist>
                        </b-input-group>
                    </b-col>
                </b-row>
                <b-button class="mt-2" variant="primary" v-on:click="previewLoad">Cargar Información</b-button>
            </b-card>

            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-variant="primary"
            >
            <b-card title="Información de Vuelos" class="mb-3">
                <b-table 
                selectable
                select-mode="single"
                @row-selected="onRowSelected"
                sticky-header="300px" 
                no-border-collapse 
                striped 
                hover 
                :items="items" 
                :fields="fields"></b-table>
            </b-card>
            </b-overlay>

            <b-modal id="bv-modal-example" hide-footer>
                <div class="d-block text-center">
                    <h3>¿Añadir a mis vuelos?</h3>
                </div>
                <b-button class="mt-3" block @click="updateDataUser">Agregar</b-button>
            </b-modal>
        
        </b-container>
    </div>
</template>

<script>
import service from '../service/trankingService';
  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fields: ['Vuelo', 'Aerolinea', 'Hrs_Salida', 'Hrs_Llegada'],
        items: [
          { isActive: true, icaoAirline: '', Vuelo: '---', Hrs_Salida: '----', Hrs_Llegada: '----', Aerolinea: '----' }
        ],
        departure: null,
        arrival: null,
        //Area del INPUT SELECTOR
        opcionesSalida: [
            { text: '--', value: '--' }
        ],
        opcionesLlegada: [
            { text: '--', value: '--' }
        ],
        busy: false,
        selected: []
      }
    },
    methods: {
        async onRowSelected(items){
            if(this.$root.userCurrent !== ''){
                this.selected = items;
                console.log(this.selected);
                this.$bvModal.show('bv-modal-example');
            }
        },
        async updateDataUser(){
            this.$bvModal.hide('bv-modal-example');
            if (this.selected[0].icaoAirline !== '' && this.selected[0].Vuelo !== '') {
                let dataUser = {email: this.$root.userCurrent.email, info: {departure: this.departure, arrival: this.arrival, airline: this.selected[0].icaoAirline, flight: this.selected[0].Vuelo}};
                let trackAPI = new service();
                await trackAPI.postDataUser(dataUser);
                this.$root.userCurrent.info[this.$root.userCurrent.info.length] = dataUser.info;
            } else {
                alert('No se dispone de la informacón suficiente para identificar el vuelo.');
            }
        },
        async previewLoad(){
            this.busy = true;
            try {
                await this.loadInfo();
            } catch (error) {
                console.log(error);
            }
            this.busy = false;
        },
        async loadInfo(){
            this.items = [];
            let trackAPI = new service();
            let dataFligth = await trackAPI.getInfoFlight(this.departure, this.arrival);
            console.log('pasa el PRIMER AWAIT');
            if (typeof dataFligth[0] !== 'undefined'){
                this.items = await this.getArray(dataFligth);
                console.log('SALE FOR ASIGNA Y LIBERA');
            }
        },
        async getArray(dataFligth){
            let arrayItems = [];
            let airlineName;
            let i = 0;
            let trackAPI = new service();
            for (let index = 0; index < dataFligth.length; index++) {
                const element = dataFligth[index];
                airlineName = await trackAPI.getInfoAirline(element.airlineIata, element.airlineIcao);
                arrayItems[arrayItems.length] = {
                    isActive: true,
                    icaoAirline: element.airlineIcao,
                    Vuelo: element.flightNumber,
                    Aerolinea: airlineName,
                    Hrs_Salida: element.departureTime === null ? '---' : element.departureTime,
                    Hrs_Llegada: element.arrivalTime === null ? '---' : element.arrivalTime
                };
            }
            return arrayItems;
        },
        async loadAutoComplete(){
            if(this.departure.length>2){
                this.opcionesSalida = [];
                let arrayItem = [];
                let trackAPI = new service();
                let dataAirport = await trackAPI.getAutoComplete(this.departure);
                
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
                            this.opcionesSalida = arrayItem;
                        }
                    }else if (typeof dataAirport.cities === 'undefined') {
                        let icaoDeparture = this.departure.split(' || ');
                        icaoDeparture = icaoDeparture[1].split(' - ');
                        if (typeof icaoDeparture[0] !== 'undefined'){
                            this.departure = icaoDeparture[0].replace(' -','');
                        }
                    }
                })();
            }
        },
        async loadAutoComplete2(){
            if(this.arrival.length>2){
                this.opcionesLlegada = [];
                let arrayItem = [];
                let trackAPI = new service();
                let dataAirport = await trackAPI.getAutoComplete(this.arrival);
                
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
                            this.opcionesLlegada = arrayItem;
                        }
                    }else if (typeof dataAirport.cities === 'undefined') {
                        let icaoArrival = this.arrival.split(' || ');
                        icaoArrival = icaoArrival[1].split(' - ');
                        if (typeof icaoArrival[0] !== 'undefined'){
                            this.arrival = icaoArrival[0].replace(' -','');
                        }
                    }
                })();
            }
        }
    }
  }
</script>

