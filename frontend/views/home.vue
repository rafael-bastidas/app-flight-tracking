<template>
    <div>
        <b-container fluid>        
            <b-row class="mt-2">
                <b-col md="4">
                    <!-- Inicio de modificacion -->
                    <div class="accordion" role="tablist">
                        <b-card no-body class="mb-1">
                        <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-1 variant="info">Información de Vuelo</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                            
                            <b-card>
                                <b-row class="mt-2 mb-2">
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
                                <b-card-text class="mb-1">Avion:</b-card-text>
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
                                <b-card-text class="mb-1">Aerolinea:</b-card-text>
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
                                <b-row align-h="center">
                                    <b-overlay
                                        :show="busy"
                                        rounded
                                        opacity="0.6"
                                        spinner-variant="primary"
                                        >
                                        <b-button v-if="visibleBtn" v-on:click="loadFollow" class="mt-4" type="button" variant="primary">Seguir Vuelo</b-button>
                                    </b-overlay>
                                </b-row>

                            </b-card>

                        </b-collapse>
                        </b-card>

                        <b-card no-body class="mb-1">
                        <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-2 variant="info">Información de Aeropuerto</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                            <b-card>
                                <b-row class="mt-2 mb-2">
                                    <b-col cols="12">
                                        <b-input-group size="sm" class="mb-2">
                                            <b-input-group-prepend is-text>
                                                <i class="fas fa-info"></i>
                                            </b-input-group-prepend>
                                            <b-form-input type="text" v-model="markerInfoAirport.nameAirport" placeholder="Aeropuerto" class="bg-light" readonly></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                </b-row>
                                <b-card-text class="mb-1">Ciudad / Pais:</b-card-text>
                                <b-row class="mb-2">
                                    <b-col cols="6">
                                        <b-input-group size="sm" class="mb-2">
                                            <b-input-group-prepend is-text>
                                                <i class="fas fa-info"></i>
                                            </b-input-group-prepend>
                                            <b-form-input type="text" v-model="markerInfoAirport.codeIataCity" placeholder="Codigo IATA" class="bg-light" readonly></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                    <b-col cols="6">
                                        <b-input-group size="sm" class="mb-2">
                                            <b-input-group-prepend is-text>
                                                <i class="fas fa-info"></i>
                                            </b-input-group-prepend>
                                            <b-form-input type="text" v-model="markerInfoAirport.nameCountry" placeholder="Pais" class="bg-light" readonly></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                </b-row>
                                <b-card-text class="mb-1">Codigos de Aeropuerto:</b-card-text>
                                <b-row>
                                    <b-col cols="6">
                                        <b-input-group size="sm" class="mb-2">
                                            <b-input-group-prepend is-text>
                                                <i class="fas fa-info"></i>
                                            </b-input-group-prepend>
                                            <b-form-input type="text" v-model="markerInfoAirport.codeIcaoAirport" placeholder="Codigo ICAO" class="bg-light" readonly></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                    <b-col cols="6">
                                        <b-input-group size="sm" class="mb-2">
                                            <b-input-group-prepend is-text>
                                                <i class="fas fa-info"></i>
                                            </b-input-group-prepend>
                                            <b-form-input type="text" v-model="markerInfoAirport.codeIataAirport" placeholder="Codigo IATA" class="bg-light" readonly></b-form-input>
                                        </b-input-group>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </b-collapse>
                        </b-card>

                        <b-card no-body class="mb-1">
                        <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-3 variant="info">Busquedas</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                            <b-container class="mt-4 mb-4">
                                <b-button-group class="d-flex">
                                <b-button v-on:click="loadFlightSearch()" :class="classA" class="w-50" squared>Por Vuelos</b-button>
                                <b-button v-on:click="loadAirportSearch()" :class="classB" class="w-50" squared>Por Aeropuertos</b-button>
                                </b-button-group>
                            </b-container>
                        </b-collapse>
                        </b-card>

                        <b-card no-body class="mb-1">
                        <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-4 variant="info">Nosotros</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                            <b-card-text class="text-center">
                                Este es un proyecto desarrollado en JavaScript con el apoyo de BootstrapVue para estilizar 
                                la interfaz visual mediante su biblioteca CSS y lograr un caracter responsivo; adicionalmente
                                se utilizo Vue.js el cual es un framework progresivo para construir interfaces de usuario como
                                Single-Page Applications, por ultimo se implemento un servidor en NodeJs con el uso de Express 
                                para correr la aplicación.
                            </b-card-text>
                            </b-card-body>
                        </b-collapse>
                        </b-card>
                    </div>
                    <!-- Fin de modificacion-->
                    <!-- Primera version.
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
                    <b-overlay
                        :show="busy"
                        rounded
                        opacity="0.6"
                        spinner-variant="primary"
                        >
                        <b-button v-if="visibleBtn" v-on:click="loadFollow" class="mt-4" type="button" variant="primary" block>Seguir Vuelo</b-button>
                    </b-overlay>
                    -->
                </b-col>
                <b-col md="8" align-self="stretch" id="divRowpanelContent">
                    <div style="position: relative;">
                        <!--<div id="containerMap" style="position: absolute; z-index: 1;">  
                            -->
                        <div id="mapid"></div>
                        <!--</div>-->
                        <div style="position: absolute; z-index: 2;">
                            <div v-if="switchForPanelContainer">
                                <div v-if="switchForA" id="divCompFli"
                                    :style="styleWidthPanelContent">
                                    <div class="d-flex flex-row-reverse">
                                        <b-button pill variant="outline-danger" v-on:click="switchForPanelContainer=false"><b>X</b></b-button>
                                    </div>
                                    <flightVue></flightVue>
                                </div>
                                <div v-else>
                                    <div class="d-flex flex-row-reverse">
                                        <b-button pill variant="outline-danger" v-on:click="switchForPanelContainer=false"><b>X</b></b-button>
                                    </div>
                                    <airportVue></airportVue>
                                </div>
                            </div> 
                        </div>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <div>
            <b-button v-b-modal.modal-1 hidden>Launch demo modal</b-button>

            <b-modal id="modal-1" title="Información" size="xl" hide-footer>
                <div>
                    <b-carousel
                    id="carousel-1"
                    v-model="slide"
                    :interval="7000"
                    controls
                    indicators
                    background="#ababab"
                    img-width="1024"
                    img-height="480"
                    style="text-shadow: 1px 1px 2px #333;"
                    @sliding-start="onSlideStart"
                    @sliding-end="onSlideEnd"
                    >
                    <!-- Text slides with image -->
                    <b-carousel-slide
                        caption="Tutorial FLIGHT-TRACKING"
                        :img-src="imagesCarrousel[0]"
                    ></b-carousel-slide>

                    <!-- Slides with custom text -->
                    <b-carousel-slide :img-src="imagesCarrousel[1]">
                        <h1>Ver información de vuelos</h1>
                    </b-carousel-slide>

                    <!-- Slides with image only -->
                    <b-carousel-slide :img-src="imagesCarrousel[2]">
                        <h1>Ver información de aeropuertos</h1>
                    </b-carousel-slide>

                    <!-- Slides with img slot -->
                    <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
                    <b-carousel-slide>
                        <template #img>
                        <img
                            class="d-block img-fluid w-100"
                            width="1024"
                            height="480"
                            :src="imagesCarrousel[3]"
                            alt="image slot"
                        >
                        </template>
                        <h1>Ver itinerarios de vuelos</h1>
                    </b-carousel-slide>

                    <!-- Slide with blank fluid image to maintain slide aspect ratio 
                    <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
                        a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.
                        </p>
                    </b-carousel-slide> -->
                    </b-carousel>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
import service from '../service/trankingService';
import iconoMarker from '../image/marker-png.png';
import iconoMarker0 from '../image/marker0-png.png';
import iconoMarker1 from '../image/marker1-png.png';
import iconoMarker2 from '../image/marker2-png.png';
import iconoMarker3 from '../image/marker3-png.png';
import imgCarousel1 from '../image/img_1.png';
import imgCarousel2 from '../image/img_2.png';
import imgCarousel3 from '../image/img_3.png';
import imgCarousel4 from '../image/img_4.png';
import airportVue from '../components/airport.vue'
import flightVue from '../components/flight.vue'

export default{
    created(){
        this.$root.bus.$on('noUser', this.listenBus)
    },
    mounted() {
        this.initMap();
        this.updateView();
        this.checkUser();
        this.initModal();
    },
    components: {
        airportVue, 
        flightVue
    },
    methods: {
        async loadFollow(){
            this.busy = true;
            if (this.markerInfo.departure !== '' && this.markerInfo.arrival !== '' && this.markerInfo.airline !== '' && this.markerInfo.numFlight !== '') {
                let dataUser = {email: this.$root.userCurrent.email, info: {departure: this.markerInfo.departure, arrival: this.markerInfo.arrival, airline: this.markerInfo.airline, flight: this.markerInfo.numFlight}};
                let trackAPI = new service();
                await trackAPI.postDataUser(dataUser);
                this.$root.userCurrent.info[this.$root.userCurrent.info.length] = dataUser.info;
                this.busy = false;
            } else {
                alert('No se dispone de la informacón suficiente para identificar el vuelo.');
                this.busy = false;
            }
        },
        listenBus(newValue){
            if (newValue === 0){
                this.visibleBtn = false;
            }
        },
        checkUser(){
            if (this.$root.userCurrent !== ''){
                this.visibleBtn = true;
            }
        },
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
                typeof ref.dataFligth[0] !== 'undefined' ? ref.loadAircraft() : console.log('No hay vuelos cerca');

                ref.dataAirport = await trackAPI.getAirport(ref.map.getCenter(), radio);
                typeof ref.dataAirport[0] !== 'undefined' && radio < 80 ? ref.loadAirport() : console.log('No hay aeropuertos cerca o el zoom esta muy alejado');

                //Ajuste del Size del map
                //document.getElementById('mapid').getAttributeNode('style').value = 'position: absolute; height: '+(window.innerHeight-70)+'px; z-index: 1;';
                ref.updateView();
            });
        },
        loadAirport(){
            //this.dataAirport.forEach(element => {
            //    let markerAirport = L.marker([element.latitudeAirport, element.longitudeAirport], {title: 'Aeropuerto'}).addTo(this.map);
            //    markerAirport.bindPopup(`<b>${element.nameAirport}</b><br>Ciudad: ${element.codeIataCity}<br>Pais: ${element.nameCountry}`);
            //});
            var ref = this;
            this.markerAirport === null ? '' : this.markerAirport.clearLayers();
            let markers = [];
            this.dataAirport.forEach(element => {
                let marker = L.marker([element.latitudeAirport, element.longitudeAirport], {title: 'Aeropuerto'});
                marker.bindPopup(`<b>${element.nameAirport}</b>`);
                marker.infoAirport = {
                    'nameAirport': element.nameAirport,
                    'codeIataCity': element.codeIataCity,
                    'nameCountry': element.nameCountry,
                    'codeIataAirport': element.codeIataAirport,
                    'codeIcaoAirport': element.codeIcaoAirport
                };
                marker.on('click', ref.onClickMarkerAirport);
                marker.on('popupclose', (e)=>{ref.markerInfoAirport = {
                    'nameAirport': '',
                    'codeIataCity': '',
                    'nameCountry': '',
                    'codeIataAirport': '',
                    'codeIcaoAirport': ''
                };});
                markers[markers.length] = marker;
            });
            this.markerAirport = L.layerGroup(markers).addTo(this.map);
        },
        loadAircraft(){
            var ref = this;
            let myIcon;
            let markers = [];
            this.markerAirplane === null ? '' : this.markerAirplane.clearLayers();
            this.dataFligth.forEach(element => {
                if (element.geography.direction >= 0 && element.geography.direction < 90) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker0, iconSize: [30, 30], iconAnchor: [15, 25] });
                } else if (element.geography.direction >= 90 && element.geography.direction < 180) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker1, iconSize: [30, 30], iconAnchor: [15, 25] });
                } else if (element.geography.direction >= 180 && element.geography.direction < 270) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker2, iconSize: [30, 30], iconAnchor: [15, 25] });
                } else if (element.geography.direction >= 270 && element.geography.direction < 360) {
                   myIcon = new L.Icon({ iconUrl: iconoMarker3, iconSize: [30, 30], iconAnchor: [15, 25] });
                } else {
                   myIcon = new L.Icon({ iconUrl: iconoMarker, iconSize: [30, 30], iconAnchor: [15, 25] });
                }

                let marker = L.marker([element.geography.latitude, element.geography.longitude], {icon: myIcon, title: 'Avion'});
                marker.bindPopup(`<h3>${element.aircraft.icaoCode}</h3>`);
                marker.info = {
                    'departure': element.departure.iataCode,
                    'arrival': element.arrival.iataCode,
                    'aircraftCode': element.aircraft.icaoCode,
                    'aircraftReg': element.aircraft.regNumber,
                    'airline': element.airline.icaoCode,
                    'numFlight': element.flight.number
                };
                marker.on('click', ref.onClickMarker);
                marker.on('popupclose', (e)=>{ref.markerInfo = {
                    'departure': '',
                    'arrival': '',
                    'aircraftCode': '',
                    'aircraftReg': '',
                    'airline': '',
                    'numFlight': ''
                };});
                markers[markers.length] = marker;
            });
            this.markerAirplane = L.layerGroup(markers).addTo(this.map);
        },
        onClickMarker(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();

            console.log(content);
            this.markerInfo = e.target.info;
            this.updateView();
        },
        onClickMarkerAirport(e){
            var popup = e.target.getPopup();
            var content = popup.getContent();

            console.log(content);
            this.markerInfoAirport = e.target.infoAirport;
        },
        updateView () {
            //width: 600px; height: 587px;
            //document.getElementById('containerMap').getAttributeNode('style').value = 'position: absolute; width: 600px; height: '+(window.innerHeight-70)+'px; z-index: 1;';
            document.getElementById('mapid').getAttributeNode('style').value = 'position: absolute; height: '+(window.innerHeight-70)+'px; z-index: 1;';
            this.styleWidthPanelContent = 'width: '+(document.getElementById('divRowpanelContent').clientWidth - 30)+'px'
        },
        loadFlightSearch(){
            this.switchForPanelContainer = true;
            this.switchForA = true;
            this.classA = 'text-primary';
            this.classB = '';
            console.log(document.getElementById('divRowpanelContent').clientWidth);
            //document.getElementById('divCompFli').getAttributeNode('style').value = 'width: '+(document.getElementById('divRowpanelContent').clientWidth-30);
        },
        loadAirportSearch(){
            this.switchForPanelContainer = true;
            this.switchForA = false,
            this.classA = '';
            this.classB = 'text-primary';
        },
        initModal(){
            this.$bvModal.show("modal-1");
            setTimeout(() => {
                document.getElementsByClassName("carousel-control-next-icon")[0].style.backgroundColor = "#212529";
                document.getElementsByClassName("carousel-control-prev-icon")[0].style.backgroundColor = "#212529";
            }, 2000);
        },
        onSlideStart(slide) {
            this.sliding = true;
        },
        onSlideEnd(slide) {
            this.sliding = false
        }
    },
    data (){
        return{
            imagesCarrousel: [imgCarousel1, imgCarousel2, imgCarousel3, imgCarousel4],
            slide: 0,
            sliding: null,
            styleWidthPanelContent: 'width: 0px',
            switchForPanelContainer: false,
            switchForA: true,
            classA: '',
            classB: '',
            widthSceen: window.innerWidth,
            heigthScreen: window.innerHeight,
            map: null,
            titleLayer: null,
            dataFligth: null,
            dataAirport: null,
            markerInfo: {
                'departure': '',
                'arrival': '',
                'aircraftCode': '',
                'aircraftReg': '',
                'airline': '',
                'numFlight': ''
            },
            markerInfoAirport: {
                'nameAirport': '',
                'codeIataCity': '',
                'nameCountry': '',
                'codeIataAirport': '',
                'codeIcaoAirport': ''
            },
            layer: '',
            visibleBtn: false,
            busy: false,
            markerAirport: null,
            markerAirplane: null
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