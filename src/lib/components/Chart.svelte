<script lang="ts">
    import bb, { line } from "billboard.js";
    import type { Chart, ChartOptions } from "billboard.js";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    export let chartData: ChartOptions;
    let chartObj: Chart;

    const dispatch = createEventDispatcher();

    $: onDataChange(chartData);

    function onDataChange(newChartData: ChartOptions) {
        if (newChartData.data) {
            const { columns } = newChartData.data;

            if (chartObj) {
                chartObj.destroy();
                chartObj = bb.generate(chartData);
                dispatch("chartCreated", { chartObj });
            }
        }
    }

    onMount(() => {
        if (chartData) {
            chartObj = bb.generate(chartData);
            dispatch("chartCreated", { chartObj });
        }
    });

    onDestroy(() => {
        if (chartObj) {
            chartObj.destroy();
        }
    });
</script>

<div id={chartData.bindto.replace("#", "")} />
