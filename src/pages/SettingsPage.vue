<template>
    <div class="p-8 bg-base-200 min-h-screen">
        <h1 class="text-4xl font-bold mb-8 text-center">Настройки темы</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="theme in themes" :key="theme"
                class="card border border-base-300 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                @click="setTheme(theme)" :data-theme="theme">
                <div class="grid grid-cols-5 grid-rows-3">
                    <div class="bg-[color:var(--b1)] col-start-1 row-span-2 row-start-1"></div>
                    <div class="bg-[color:var(--b2)] col-start-1 row-start-3"></div>
                    <div
                        class="bg-[color:var(--b3)] col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div class="font-bold">{{ theme }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const themes = ref([
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween',
    'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
    'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn',
    'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
    'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
])

onMounted(() => {
    const savedTheme = localStorage.getItem('daisy-theme')
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme)
})

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('daisy-theme', theme)
}
</script>

<style scoped>
[data-theme="light"] {
    --b1: base-200;
    --b2: base-300;
    --b3: base-100;
    --p: primary;
    --pc: primary-content;
    --s: secondary;
    --sc: secondary-content;
    --a: accent;
    --ac: accent-content;
    --n: neutral;
    --nc: neutral-content;
}

[data-theme="dark"] {
    --b1: base-200;
    --b2: base-300;
    --b3: base-100;
    --p: primary;
    --pc: primary-content;
    --s: secondary;
    --sc: secondary-content;
    --a: accent;
    --ac: accent-content;
    --n: neutral;
    --nc: neutral-content;
}
</style>
