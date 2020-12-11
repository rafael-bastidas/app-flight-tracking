<template>
    <div class="mt-4">
        <b-container fluid>        
            <!--<b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-variant="primary">-->
            <b-card title="Información de Vuelos en seguimiento" class="mb-3">
                <b-table
                ref="selectableTable"
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
            <!--</b-overlay>-->

            <b-modal id="bv-modal-example" hide-footer>
                <div class="d-block text-center">
                    <h3>¿Eliminar de mis vuelos?</h3>
                </div>
                <b-button class="mt-3" block @click="updateDataUser">Eliminar</b-button>
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
import router from '../routes/router';

  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fields: ['Vuelo', 'Aerolinea', 'Salida', 'Hrs_Salida', 'Llegada', 'Hrs_Llegada', 'Estado'],
        items: [
          { isActive: true, index: '', Vuelo: '---', Salida: '---', Hrs_Salida: '----', Llegada: '---', Hrs_Llegada: '----', Estado: '---', Aerolinea: '----' }
        ],
        busy: true,
        selected: [],
        counter: 1,
        interval: null
      }
    },
    mounted() {
      if(typeof this.$root.userCurrent.name !== 'undefined'){
        this.previewLoad();
      } else {
        router.push('/');
      }
    },
    methods: {
      async updateDataUser(){
        this.$bvModal.hide('bv-modal-example');
        let trackAPI = new service();
        await trackAPI.postDeleteOneDataUser({email: this.$root.userCurrent.email, index: this.selected[0].index});
        let arrayAux = [];
        let arrayAux2 = [];
        let count = 0;
        this.items.forEach(element => {
          if(element.index !== this.selected[0].index){
            arrayAux[arrayAux.length] = {Salida: element.Salida, Llegada: element.Llegada, Aerolinea: element.Aerolinea, Vuelo: element.Vuelo, Hrs_Salida: element.Hrs_Salida, Hrs_Llegada: element.Hrs_Llegada, Estado: element.Estado, index: arrayAux.length};
            arrayAux2[arrayAux2.length] = {departure: element.Salida, arrival: element.Llegada, airline: this.$root.userCurrent.info[count].airline, flight: element.Vuelo, index: arrayAux2.length};
          }
          count++;
        }); 
        this.items = arrayAux;
        this.$root.userCurrent.info = arrayAux2;
        this.$refs.selectableTable.clearSelected();
      },
      async initLoadDataUser(){
        this.items = [];
        let arrayItem = [];
        let trackService = new service();
        let dataFligth;
        let dataUser = this.$root.userCurrent.info;
        let count = 0;
        for (let i = 0; i < dataUser.length; i++) {
          dataFligth = await trackService.getTimeTables(dataUser[i].departure, 'departure');
          if (typeof dataFligth[0] !== 'undefined'){
            count = 0;
            dataFligth.forEach(element => {
              if(element.flight.number === dataUser[i].flight && element.airline.icaoCode === dataUser[i].airline && element.departure.iataCode === dataUser[i].departure && element.arrival.iataCode === dataUser[i].arrival){
                arrayItem[arrayItem.length] = {
                  isActive: false,
                  index: dataUser[i].index,
                  Vuelo: element.flight.number,
                  Aerolinea: element.airline.name,
                  Salida: element.departure.iataCode,
                  Hrs_Salida: element.departure.scheduledTime,
                  Llegada: dataUser[i].arrival,
                  Hrs_Llegada: element.arrival.scheduledTime,
                  Estado: element.status,
                }
              } else {
                count++;
                if (dataFligth.length === count){
                  console.log('El Vuelo', dataUser[i].flight, 'ya no esta en la tabla TIMESTABLES de aviation-edge.com', count, dataFligth.length);
                  arrayItem[arrayItem.length] = {
                    isActive: false,
                    index: dataUser[i].index,
                    Vuelo: dataUser[i].flight,
                    Aerolinea: dataUser[i].airline,
                    Salida: dataUser[i].departure,
                    Hrs_Salida: '---',
                    Llegada: dataUser[i].arrival,
                    Hrs_Llegada: '---',
                    Estado: 'unknown',
                  }
                }
              }
            });
          } else {
            console.log('Error de busqueda: El Vuelo', dataUser[i].flight, 'no tiene ninguna coincidencia de busqueda.');
            arrayItem[arrayItem.length] = {
              isActive: false,
              index: dataUser[i].index,
              Vuelo: dataUser[i].flight,
              Aerolinea: dataUser[i].airline,
              Salida: dataUser[i].departure,
              Hrs_Salida: '---',
              Llegada: dataUser[i].arrival,
              Hrs_Llegada: '---',
              Estado: 'unknown',
            }
          }
        }
        this.items = arrayItem;
        this.busy = false;
      },
      onRowSelected(items) {
        if(this.$root.userCurrent !== '' && items.length > 0){
          this.selected = items;
          this.$bvModal.show('bv-modal-example');
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
            try {
                this.onOK();
                await this.initLoadDataUser();
                //this.sendEmail();
            } catch (error) {
                this.busy = false;
                console.log(error);
            }
        },
        async sendEmail(){
          let trackService = new service();
          let msg = "<h1>Informe de vuelos:</h1><br>";
          if (this.items.length > 0){
            for (let index = 0; index < this.items.length; index++) {
              const element = this.items[index];
              msg += "<h3>Vuelo: "+element.Vuelo+", Estado: "+element.Estado+"</h3><br>";
            }
            await trackService.postSendEmail({email: "rafaelbastidas93@gmail.com", msgHtml: msg});
          }
        },
    }
  }
</script>

