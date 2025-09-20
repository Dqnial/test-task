<template>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Склады</h1>

        <div class="flex flex-wrap gap-4 mb-6 items-end">
            <div class="form-control">
                <label class="label"><span class="label-text">Дата</span></label>
                <input type="date" v-model="filters.dateFrom" class="input input-bordered" />
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

        <div class="card bg-base-100 shadow p-4 mb-6" style="height: 300px;">
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
                    <tr v-for="row in items" :key="row.sale_id || row.sc_code">
                        <td>{{ row.sale_id || row.sc_code }}</td>
                        <td>{{ row.date }}</td>
                        <td>{{ row.total_price || row.price }}</td>
                        <td>{{ row.quantity_full || row.quantity }}</td>
                        <td>{{ row.supplier_article }}</td>
                        <td>{{ row.warehouse_name }}</td>
                        <td>{{ row.nm_id }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

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
import { fetchStocks } from '@/services/api.js';

const items = ref([]);
const page = ref(1);
const limit = ref(50);
const filters = reactive({
    dateFrom: new Date().toISOString().slice(0, 10),
});

async function loadData() {
    try {
        const data = await fetchStocks({
            dateFrom: filters.dateFrom,
            page: page.value,
            limit: limit.value,
        });
        items.value = data.data || [];
    } catch (err) {
        console.error(err);
        items.value = [];
    }
}

onMounted(loadData);

function applyFilters() { page.value = 1; loadData(); }
function prevPage() { if (page.value > 1) page.value--; loadData(); }
function nextPage() { page.value++; loadData(); }

const chartData = computed(() => ({
    labels: items.value.map(i => i.warehouse_name),
    datasets: [
        {
            label: 'Количество',
            data: items.value.map(i => i.quantity),
            borderColor: 'orange',
            fill: false,
        }
    ]
}));

const chartOptions = { responsive: true, maintainAspectRatio: false };
</script>
