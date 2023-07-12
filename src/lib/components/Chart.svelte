<script lang="ts">
    import bb, { line } from "billboard.js";
    import type { Chart, ChartOptions } from "billboard.js";
    import { onDestroy, onMount } from "svelte";

    export let chartData: ChartOptions & { bindto: string };
    let chartObj: Chart;

    $: onDataChange(chartData);

    function onDataChange(newChartData: ChartOptions) {
        if (newChartData.data) {
            const { columns } = newChartData.data;

            if (chartObj) {
                chartObj.destroy();
                chartObj = bb.generate(chartData);
            }
        }
    }

    onMount(() => {
        if (chartData) {
            chartObj = bb.generate(chartData);
        }
    });

    onDestroy(() => {
        if (chartObj) {
            chartObj.destroy();
        }
    });
</script>

<div id={chartData.bindto.replace("#", "")} />
