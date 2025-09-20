<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Заказы</h1>

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
                        <th>Номер</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Скидка %</th>
                        <th>Склад</th>
                        <th>Артикул</th>
                        <th>Бренд</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in items" :key="row.odid || row.g_number">
                        <td>{{ row.g_number }}</td>
                        <td>{{ row.date }}</td>
                        <td>{{ row.total_price }}</td>
                        <td>{{ row.discount_percent || 0 }}</td>
                        <td>{{ row.warehouse_name }}</td>
                        <td>{{ row.supplier_article }}</td>
                        <td>{{ row.brand || '-' }}</td>
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

const items = ref([]);
const page = ref(1);
const limit = ref(50);

const filters = reactive({
    dateFrom: '2025-09-01',
    dateTo: new Date().toISOString().slice(0, 10),
});

async function loadData() {
    const url = `http://109.73.206.144:6969/api/orders?dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&page=${page.value}&limit=${limit.value}&key=E6kUTYrYwZq2tN4QEtyzsbEBk3ie`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        items.value = data.data || [];
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    }
}

onMounted(loadData);

function applyFilters() {
    page.value = 1;
    loadData();
}
function prevPage() {
    if (page.value > 1) page.value--;
    loadData();
}
function nextPage() {
    page.value++;
    loadData();
}

const chartData = computed(() => ({
    labels: items.value.map(i => i.date),
    datasets: [
        {
            label: 'Сумма заказов',
            data: items.value.map(i => Number(i.total_price)),
            borderColor: 'green',
            fill: false,
        },
    ],
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
            callbacks: {
                label: function (context) {
                    return `${context.dataset.label}: ${context.formattedValue}`;
                },
            },
        },
        legend: {
            display: true,
            position: 'top',
        },
    },
    interaction: {
        mode: 'nearest',
        intersect: false,
    },
    scales: {
        x: { display: true, title: { display: true, text: 'Дата' } },
        y: { display: true, title: { display: true, text: 'Сумма' } },
    },
};
</script>
