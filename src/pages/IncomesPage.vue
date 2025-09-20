<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Поступления</h1>

        <!-- Фильтры -->
        <div class="flex flex-wrap gap-4 mb-6 items-end">
            <div class="form-control">
                <label class="label"><span class="label-text">От</span></label>
                <input type="date" v-model="filters.dateFrom" class="input input-bordered" />
            </div>

            <div class="form-control">
                <label class="label"><span class="label-text">До</span></label>
                <input type="date" v-model="filters.dateTo" class="input input-bordered" />
            </div>

            <div class="form-control">
                <label class="label"><span class="label-text">Лимит</span></label>
                <select v-model.number="limit" class="select select-bordered">
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                    <option :value="200">200</option>
                    <option :value="500">500</option>
                </select>
            </div>

            <button @click="applyFilters" class="btn btn-primary mt-6">Применить</button>
        </div>

        <!-- График -->
        <div class="card bg-base-100 shadow p-4 mb-6" style="height: 300px;">
            <LineChart :chart-data="chartData" :chart-options="chartOptions" />
        </div>

        <!-- Таблица -->
        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID дохода</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Кол-во</th>
                        <th>Артикул</th>
                        <th>Склад</th>
                        <th>NM ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in items" :key="row.income_id">
                        <td>{{ row.income_id }}</td>
                        <td>{{ row.date }}</td>
                        <td>{{ row.total_price }}</td>
                        <td>{{ row.quantity }}</td>
                        <td>{{ row.supplier_article }}</td>
                        <td>{{ row.warehouse_name }}</td>
                        <td>{{ row.nm_id }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

        <!-- Пагинация -->
        <div class="flex gap-2 mt-6 justify-center">
            <button @click="prevPage" :disabled="page <= 1" class="btn btn-outline">Prev</button>
            <span class="btn btn-ghost">Стр. {{ page }}</span>
            <button @click="nextPage" class="btn btn-outline">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import LineChart from '@/components/LineChart.vue';
import axios from 'axios';

const items = ref([]);
const page = ref(1);
const limit = ref(50);

const today = new Date();
const filters = reactive({
    dateFrom: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10),
    dateTo: today.toISOString().slice(0, 10),
});

const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
const BASE_URL = 'http://109.73.206.144:6969/api/incomes';

// Загрузка данных с API
async function loadData() {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                page: page.value,
                limit: limit.value,
                key: API_KEY,
            },
        });
        items.value = response.data.data || [];
    } catch (error) {
        console.error('Ошибка загрузки доходов:', error);
        items.value = [];
    }
}

onMounted(loadData);

function applyFilters() {
    page.value = 1;
    loadData();
}
function prevPage() { if (page.value > 1) { page.value--; loadData(); } }
function nextPage() { page.value++; loadData(); }

const chartData = computed(() => {
    // группируем количество по дате
    const map = {};
    items.value.forEach(row => {
        const d = row.date;
        map[d] = (map[d] || 0) + Number(row.quantity || 0);
    });

    // сортируем даты
    const labels = Object.keys(map).sort();
    const data = labels.map(date => map[date]);

    return {
        labels,
        datasets: [
            {
                label: 'Кол-во поступлений',
                data,
                borderColor: 'yellow',
                fill: false,
                tension: 0.3,
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: { mode: 'nearest', intersect: false },
        legend: { display: true, position: 'top' }
    },
    interaction: { mode: 'nearest', intersect: false },
    scales: {
        x: { title: { display: true, text: 'Дата' } },
        y: { title: { display: true, text: 'Количество' } }
    }
};

</script>
