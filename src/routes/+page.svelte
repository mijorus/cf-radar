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
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";

    let chartData: ChartOptions;

    let fromDate = dayjs().subtract(2, "month");
    let toDate = dayjs().subtract(1, "day");

    async function loadChart() {
        if (fromDate.isSame(toDate, "day") || fromDate.isAfter(toDate)) {
            throw new Error("Invalid date range: " + fromDate.format("YYYY-MM") + " - " + toDate.format("YYYY-MM"));
        }

        const monthsToLoad = [toDate.format("YYYY-MM")];

        let i = 1;
        while (monthsToLoad[0] !== fromDate.format("YYYY-MM")) {
            monthsToLoad.unshift(toDate.clone().subtract(i, "month").format("YYYY-MM"));
            i++;
        }

        let chartLabels: string[] = [];

        //@ts-ignore
        const response: MonthlyDataResponse[][] = await Promise.all(monthsToLoad.map((el) => ky.get(`${SERVER_URL}/cf-montly-data/${el}.json`).json()));

        let datasetsValues: { [key: string]: (string | number)[] } = {};

        response.forEach((month) => {
            month.forEach((day) => {
                const djsDate = dayjs(day.date, "YYYY-MM-DD");
                if (djsDate.isBefore(fromDate) || djsDate.isAfter(toDate)) {
                    return;
                }

                chartLabels.push(day.date);
                day.result.forEach((result) => {
                    datasetsValues[result.domain] = [result.domain];
                });
            });
        });

        response.forEach((month) => {
            month.forEach((day) => {
                const djsDate = dayjs(day.date, "YYYY-MM-DD");
                if (djsDate.isBefore(fromDate) || djsDate.isAfter(toDate)) {
                    return;
                }

                for (let dom in datasetsValues) {
                    const domResult = day.result.find((el) => el.domain === dom);
                    datasetsValues[dom].push(domResult ? domResult.rank : -1);
                }
            });
        });

        for (let domain in datasetsValues) {
            if (datasetsValues[domain].at(-1) < 0 || datasetsValues[domain].at(-1) > 10) {
                delete datasetsValues[domain];
            }
        }

        chartData = {
            bindto: "#chart",
            padding: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50,
            },
            point: {
                show: chartLabels.length < 45,
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

    function onDateChange(e: CustomEvent) {
        fromDate = dayjs(e.detail.fromDate, "YYYY-MM-DD");
        toDate = dayjs(e.detail.toDate, "YYYY-MM-DD");

        if (fromDate.isSame(toDate, "day")) {
            fromDate = fromDate.subtract(1, "day");
        }

        loadChart();
    }

    onMount(async () => {
        loadChart();
    });
</script>

<h1 class="text-center font-bold text-7xl">Visualize data from CloudFlare Radar</h1>
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

<div class="mt-24" />

{#if chartData}
    <div class="flex flex-row justify-center">
        <DateRangePicker min="2022-10-01" max={dayjs().subtract(1, "day").format("YYYY-MM-DD")} fromInit={fromDate.format("YYYY-MM-DD")} toInit={toDate.format("YYYY-MM-DD")} on:apply={onDateChange} />
    </div>
    <div>
        <Chart {chartData} />
    </div>

    <div class="mt-10 flex flex-row justify-center">
        <DomainsList data={chartData} />
    </div>
{/if}
