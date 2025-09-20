import axios from "axios";

const API_HOST = "http://109.73.206.144:6969";
const API_KEY = "E6kUTYrYwZq2tN4QEtyzsbEBk3ie";

const api = axios.create({
  baseURL: `${API_HOST}/api`,
  timeout: 20000,
});

function buildParams(params = {}) {
  return { ...params, key: API_KEY };
}

export async function fetchSales({ dateFrom, dateTo, page = 1, limit = 100 }) {
  const res = await api.get("/sales", {
    params: buildParams({ dateFrom, dateTo, page, limit }),
  });
  return res.data;
}

export async function fetchOrders({ dateFrom, dateTo, page = 1, limit = 100 }) {
  const res = await api.get("/orders", {
    params: buildParams({ dateFrom, dateTo, page, limit }),
  });
  return res.data;
}

export async function fetchIncomes({
  dateFrom,
  dateTo,
  page = 1,
  limit = 100,
}) {
  const res = await api.get("/incomes", {
    params: buildParams({ dateFrom, dateTo, page, limit }),
  });
  return res.data;
}

export async function fetchStocks({ dateFrom, page = 1, limit = 500 }) {
  const res = await api.get("/stocks", {
    params: buildParams({ dateFrom, page, limit }),
  });
  return res.data;
}
