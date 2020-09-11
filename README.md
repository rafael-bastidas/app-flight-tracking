Este es un proyecto desarrollado en JavaScript con el apoyo de BootstrapVue para estilizar 
la interfaz visual mediante su biblioteca CSS y lograr un caracter responsivo; adicionalmente
se utilizo Vue.js el cual es un framework progresivo para construir interfaces de usuario como
Single-Page Applications, por ultimo se implemento un servidor en NodeJs con el uso de Express 
para correr la aplicación.

Para consumir los datos de la API de aviation-edge.com y representarlos en una interfaz dinamica e intuitiva la aplicación contara con tres pestañas principales, y se hara uso de OpenStreetMap, herramienta en la que nos apoyaremos para renderizar mediante sus geodatos, mapas; estos datos seran manejados mediante la libreria leaflet.JS que cuenta con caracteristicas como simplicidad, rendimiento y la facilidad de uso, ademas de estar bien documentada.

Interfaces de Usuario:
 la primera pestaña sera encargada de representar graficamente los vuelos que se encuentren dentro marco visual del mapa mediante marcadores, para ello mediante un script se estara observando los desplazamientos del mapa, y con la coordenada de su centro visual y su radio respectivo se consultara la base de datos de aviation-edge para obtener el tracking-flight, una vez representados estos datos, el usuario podra seleccionarlos y obtener información del vuelo.

 En la segundo pestaña el usuario podra visualizar una tabla de informacion de los vuelos entrantes y salientes según algun aeropuerto seleccionado, tambien podra ver información de vuelos que cumplan dos criterios como lo son el aeropuerto de salida y el aeropuerto de llegada.

 la tercera pestaña mostrara una breve explicación del proyecto y las herramientas utilizadas para el desarrollo del mismo.