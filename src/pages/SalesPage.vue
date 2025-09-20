<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Продажи</h1>

        <!-- Фильтры -->
        <div class="flex flex-wrap gap-4 mb-6 items-end">
            <div class="form-control">
                <label class="label">
                    <span class="label-text">От</span>
                </label>
                <input type="date" v-model="filters.dateFrom" class="input input-bordered" />
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">До</span>
                </label>
                <input type="date" v-model="filters.dateTo" class="input input-bordered" />
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Лимит</span>
                </label>
                <select v-model.number="limit" class="select select-bordered">
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                    <option :value="200">200</option>
                    <option :value="500">500</option>
                </select>
            </div>

            <button @click="applyFilters" class="btn btn-primary mt-6">
                Применить
            </button>
        </div>

        <!-- График -->
        <div class="mb-6">
            <LineChart :chart-data="chartData" :chart-options="chartOptions" />
        </div>

        <!-- Таблица -->
        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID продажи</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Кол-во</th>
                        <th>Артикул</th>
                        <th>Склад</th>
                        <th>NM ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in items" :key="row.sale_id">
                        <td>{{ row.sale_id }}</td>
                        <td>{{ row.date }}</td>
                        <td>{{ row.total_price }}</td>
                        <td>{{ row.for_pay }}</td>
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
import { fetchSales } from '@/services/api.js';
import LineChart from '@/components/LineChart.vue';

const items = ref([]);
const page = ref(1);
const limit = ref(50);
const today = new Date();
const filters = reactive({
    dateFrom: new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10),
    dateTo: new Date().toISOString().slice(0, 10),
});

// Загрузка данных с API
async function loadData() {
    const data = await fetchSales({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        page: page.value,
        limit: limit.value,
    });
    items.value = data.data || [];
}

onMounted(loadData);

function applyFilters() {
    page.value = 1;
    loadData();
}

function prevPage() {
    if (page.value > 1) page.value -= 1;
    loadData();
}

function nextPage() {
    page.value += 1;
    loadData();
}

const chartData = computed(() => {
    const map = {};
    items.value.forEach(row => {
        const d = row.date;
        map[d] = (map[d] || 0) + Number(row.total_price || 0);
    });
    const labels = Object.keys(map).sort();
    const dataset = labels.map(l => map[l]);
    return {
        labels,
        datasets: [
            {
                label: 'Сумма продаж',
                data: dataset,
                borderColor: 'blue',
                fill: false
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>
