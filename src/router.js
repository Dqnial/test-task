import { createWebHashHistory, createRouter } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import IncomesPage from "./pages/IncomesPage.vue";
import OrdersPage from "./pages/OrdersPage.vue";
import SalesPage from "./pages/SalesPage.vue";
import StocksPage from "./pages/StocksPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/incomes", component: IncomesPage },
  { path: "/orders", component: OrdersPage },
  { path: "/sales", component: SalesPage },
  { path: "/stocks", component: StocksPage },
  { path: "/settings", component: SettingsPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
