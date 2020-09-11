<template>
    <div>
        <b-container fluid>        
            <b-row class="mt-2">
                <b-col md="4">
                    <b-card title="Información de Vuelo">
                        <b-row class="mt-4 mb-2">
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-departure"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.departure" placeholder="Salida" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-plane-arrival"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.arrival" placeholder="Llegada" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Tipo de avion / #Registro:</b-card-text>
                        <b-row class="mb-2">
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.aircraftCode" placeholder="Codigo ICAO" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.aircraftReg" placeholder="Num. de Registro" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                        <b-card-text class="mb-1">Aerolinea / #Vuelo:</b-card-text>
                        <b-row>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.airline" placeholder="Codigo ICAO" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="6">
                                <b-input-group size="sm" class="mb-2">
                                    <b-input-group-prepend is-text>
                                        <i class="fas fa-info"></i>
                                    </b-input-group-prepend>
                                    <b-form-input type="text" v-model="markerInfo.numFlight" placeholder="Num. de vuelo" class="bg-light" readonly></b-form-input>
                                </b-input-group>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
                <b-col md="8" align-self="stretch">
                    <div id="mapid"></div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import service from '../service/trankingService';
export default{
    mounted() {
        this.initMap();
        this.updateView();
    },
    methods: {
        initMap(){
            this.map = L.map('mapid', { center: [0, 0], zoom: 13 });
            this.titleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            this.titleLayer.addTo(this.map);

            this.map.locate({setView: true});

            this.listenerMap();
        },
        listenerMap(){
            var ref = this;
            this.map.on('locationfound', (ev) =>{
                //L.marker([ev.latitude, ev.longitude]).addTo(this.map);
                this.map.stopLocate();
            });

            this.map.on('moveend', async function(ev) {
                //Calculo del radio y transformación a KM
                let radio = ref.map.distance(ref.map.getCenter(), [ref.map.getBounds()._southWest.lat, ref.map.getBounds()._southWest.lng]);
                radio = (radio-(radio*0.4))/1000;

                //Solicitud de datos a: aviation-edge
                let trackAPI = new service();
                ref.dataFligth = await trackAPI.getFligth(ref.map.getCenter(), radio);
                ref.loadAircraft();

                //Ajuste del Size del map
                document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';                
            });
        },
        loadAircraft(){
            var ref = this;
            let myIcon = new L.Icon({
                iconUrl: 'http://localhost:3000/marker-png.png',
                iconSize: [40, 50],
                iconAnchor: [25, 40]
                });
            
            this.dataFligth.forEach(element => {
                let marker = L.marker([element.geography.latitude, element.geography.longitude], {icon: myIcon, title: 'Algo'}).addTo(this.map);
                marker.bindPopup(`<h3>${element.aircraft.icaoCode}</h3>`);
                marker.info = {
                    'departure': element.departure.iataCode,
                    'arrival': element.arrival.iataCode,
                    'aircraftCode': element.aircraft.icaoCode,
                    'aircraftReg': element.aircraft.regNumber,
                    'airline': element.airline.icaoCode,
                    'numFlight': element.flight.icaoNumber
                };
                marker.on('click', ref.onClickMarker);
            });
        },
        onClickMarker(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();

            console.log(content);
            this.markerInfo = e.target.info;
            this.updateView();
        },
        updateView () {
            document.getElementById('mapid').getAttributeNode('style').value = 'position: relative; height: '+(window.innerHeight-70)+'px;';
        }
    },
    data (){
        return{
            widthSceen: window.innerWidth,
            heigthScreen: window.innerHeight,
            map: null,
            titleLayer: null,
            dataFligth: '',
            markerInfo: {
                    'departure': '',
                    'arrival': '',
                    'aircraftCode': '',
                    'aircraftReg': '',
                    'airline': '',
                    'numFlight': ''
                },
            layer: ''
        }
    }
}
</script>
<style>
#mapid{
    width: 100%;
    height: 600px;
}
</style>