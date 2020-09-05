class ServiceTracking {

    constructor() {
      this.URI = 'https://app-amarista.herokuapp.com/api/mantenimientos';
    }
  
    async getSedes(){
        const response = await fetch(this.URI, {
          method: 'GET'
        });
        const data = await response.json();
        return data;
    }
  
    async getSedeById(sedeId){
      const response = await fetch(`${this.URI}/${sedeId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
      const data = await response.json();
      return data;
    }
  
    async postSede(sede){
      const response = await fetch(this.URI, {
        method: 'POST',
        body: sede
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async putSede(changeSede){
      const response = await fetch(this.URI, {
        method: 'PUT',
        body: changeSede
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async deleteSede(sedeId){
      const response = await fetch(`${this.URI}/${sedeId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async getVisit(sedeID){
      let stringURL;
      (typeof sedeID === 'undefined') ? (stringURL = `${this.URI}/visit`) : (stringURL = `${this.URI}/visit/${sedeID}`);
      const response = await fetch(stringURL, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async postVisit(dateVisit){
      const response = await fetch(`${this.URI}/visit`, {
        method: 'POST',
        body: dateVisit
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async deleteDate(visitID){
      const response = await fetch(`${this.URI}/visit/${visitID}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async getEquipos(visitID){
      let stringURL = `${this.URI}/visit/equipos/${visitID}`;
      const response = await fetch(stringURL, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async getEquip(equipID){
      let stringURL = `${this.URI}/visit/equip/${equipID}`;
      const response = await fetch(stringURL, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async postEquip(datoEquipo){
      const response = await fetch(`${this.URI}/visit/equip`, {
        method: 'POST',
        body: datoEquipo
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async putEquip(valoresEquip){
      const response = await fetch(`${this.URI}/visit/equip`, {
        method: 'PUT',
        body: valoresEquip
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async deleteEquip(equipID){
      const response = await fetch(`${this.URI}/visit/equip/${equipID}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  
    async getPDF(visiteID){
      const response = await fetch(`${this.URI}/pdf/${visiteID}`, {
        method: 'GET'
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
  }
  
  //tambien se puede exportar con module.exports = BookService;
  export default ServiceTracking;
  