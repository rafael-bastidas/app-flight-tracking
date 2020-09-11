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
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
  
  <router-view></router-view>
  
</div>
</template>
<script>
import logo from './image/logo-png.png';
export default {
  data(){
    return {
      mainProps: { src:logo, blank: false, blankColor: '#777', width: 120, height: 40, class: 'm1 d-inline-block align-top' }
    }
  }
}
</script>