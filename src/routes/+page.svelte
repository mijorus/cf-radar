<script lang="ts">
    import Chart from "$lib/components/Chart.svelte";
    import { onMount, tick } from "svelte";
    import dayjs from "dayjs";
    import ky from "ky";
    import bb, { line, spline } from "billboard.js";
    import type { ChartOptions } from "billboard.js";
    import DomainsList from "$lib/components/DomainsList.svelte";
    import { SERVER_URL } from "$lib/costants";
    import "billboard.js/dist/billboard.css";

    let chartData: ChartOptions;
    let chartLoaded = false;

    async function loadChart(from: dayjs.Dayjs, to: dayjs.Dayjs = dayjs()) {
        if (from.isSame(to) || from.isAfter(to)) {
            throw new Error("Invalid date range: " + from.format("YYYY-MM") + " - " + to.format("YYYY-MM"));
        }

        const chartDatePreview = [to.format("YYYY-MM")];

        let i = 1;
        while (chartDatePreview[0] !== from.format("YYYY-MM")) {
            chartDatePreview.unshift(to.clone().subtract(i, "month").format("YYYY-MM"));
            i++;
        }

        let chartLabels: string[] = [];

        //@ts-ignore
        const response: MonthlyDataResponse[][] = await Promise.all(chartDatePreview.map((el) => ky.get(`${SERVER_URL}/cf-montly-data/${el}.json`).json()));

        let datasetsValues: { [key: string]: (string | number)[] } = {};

        response.forEach((month) => {
            month.forEach((day) => {
                const dayData = day.result.slice(0, 10);
                chartLabels.push(day.date);

                dayData.forEach((result) => {
                    if (datasetsValues[result.domain] === undefined) {
                        datasetsValues[result.domain] = [result.domain];
                    }

                    datasetsValues[result.domain].push(result.rank);
                });
            });
        });

        chartData = {
            bindto: '#chart',
            padding: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50,
            },
            point: {
                show: chartLabels.length < 64,
            },
            data: {
                x: "x",
                columns: [["x", ...chartLabels], ...Object.values(datasetsValues)],
                type: spline(), // for ESM specify as: line()
            },
            axis: {
                y: {
                    inverted: true,
                    min: 1,
                    padding: 10,
                },
                x: {
                    type: "timeseries",
                    tick: {
                        fit: true,
                        format: "%e %b %y",
                    },
                },
            },
        };
    }

    onMount(async () => {
        loadChart(dayjs().subtract(2, "months"));
    });
</script>

<h1 class="text-center font-bold text-7xl">Visualize data from CloudFlare Radar</h1>
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

<div class="mt-10" />

{#if chartData}
    <div class="m-10 p-30">
        <Chart {chartData} />
    </div>

    <div class="flex flex-row justify-center">
        <DomainsList data={chartData} />
    </div>
{/if}