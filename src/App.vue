<template>
  <div id="app">
    <nav class="py-4 bg-base-300 flex flex-row gap-4 justify-center uppercase max-lg:flex-col max-lg:items-center">
      <router-link to="/">
        <button className="btn btn-primary">
          <House />Главная
        </button>
      </router-link>
      <router-link to="/incomes">
        <button className="btn btn-primary">
          <BanknoteArrowUp />Поступления
        </button></router-link>
      <router-link to="/orders">
        <button className="btn btn-primary">
          <CircleStar />Заказы
        </button></router-link>
      <router-link to="/sales">
        <button className="btn btn-primary">
          <BadgeDollarSign />Продажи

        </button>
      </router-link>
      <router-link to="/stocks"> <button className="btn btn-primary">
          <Warehouse />Склады
        </button></router-link>
      <router-link to="/settings">
        <button className="btn btn-primary">
          <Settings />Настройки
        </button>
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { BadgeDollarSign, BanknoteArrowUp, CircleStar, House, Settings, Warehouse } from 'lucide-vue-next';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

body {
  font-family: "Montserrat", sans-serif;
}
</style>
