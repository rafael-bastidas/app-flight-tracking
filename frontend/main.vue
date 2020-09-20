<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <div class="container">
      <b-navbar-brand href="/">
        <b-img v-bind="mainProps" rounded alt="Rounded image"></b-img>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{name: 'home'}">Inicio</b-nav-item>
          <b-nav-item :to="{name: 'find'}">Busqueda</b-nav-item>
          <b-nav-item :to="{name: 'about'}">Nosotros</b-nav-item>
          <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>{{user}}</em>
          </template>
          <b-dropdown-item v-if="showFolow" :to="{name: 'following'}">Seguimiento</b-dropdown-item>
          <b-dropdown-item v-on:click="disconectUser" :to="(estadoLogin === 'Conectarse') ? {name: 'login'} : ''">{{estadoLogin}}</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
  
  <router-view></router-view>
  
</div>
</template>
<script>
import logo from './image/logo-png.png';
import router from './routes/router';

export default {
  created(){
    this.$root.bus.$on('user', this.listenBus)
  },
  data(){
    return {
      mainProps: { src:logo, blank: false, blankColor: '#777', width: 120, height: 40, class: 'm1 d-inline-block align-top' },
      user: 'Usuario',
      estadoLogin: 'Conectarse',
      showFolow: false
    }
  },
  methods: {
    listenBus(newValue){
      this.user = newValue.name;
      this.estadoLogin = 'Desconectarse';
      this.showFolow = true;
    },
    disconectUser(){
      if(this.estadoLogin === 'Desconectarse'){
        this.estadoLogin = 'Conectarse';
        this.user = 'Usuario';
        this.$root.userCurrent = '';
        this.$root.bus.$emit('noUser', 0);
        this.showFolow = false;
        router.push('login');
      }
    }
  }
}
</script>