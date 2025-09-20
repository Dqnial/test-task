    <template>
        <div class="card bg-base-100 shadow p-4" style="height: 350px;">
            <canvas ref="canvas"></canvas>
        </div>
    </template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const props = defineProps({
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, default: () => ({}) },
});

const canvas = ref(null);
let chart = null;

onMounted(() => {
    if (!canvas.value) return;

    chart = new Chart(canvas.value.getContext('2d'), {
        type: 'line',
        data: props.chartData,
        options: {
            ...props.chartOptions,
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
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Дата',
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Сумма',
                    },
                },
            },
        },
    });
});

watch(
    () => props.chartData,
    (nv) => {
        if (!chart) return;
        chart.data = nv;
        chart.update();
    },
    { deep: true }
);

onBeforeUnmount(() => {
    if (chart) {
        chart.destroy();
        chart = null;
    }
});
</script>
