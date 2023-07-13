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
    import { loadData } from "$lib/utils";
    import { Label, Select } from "flowbite-svelte";
    import { browser } from "$app/environment";
    import type { Chart as ChartBl } from "billboard.js";

    let chartData: ChartOptions;

    let fromDate = dayjs().subtract(2, "month");
    let toDate = dayjs().subtract(1, "day");
    let chartObj: ChartBl;

    const displayranges = [
        { name: "1st👑 - 10th", value: "1-10" },
        { name: "11th - 20th", value: "11-20" },
        { name: "21st - 45th", value: "21-45" },
    ];

    let displayRangeSelected = "1-10";

    $: onDisplayRangeChange(displayRangeSelected);

    async function loadChart() {
        if (!browser) {
            // Run only in the browser
            return;
        }

        console.log("Reloading chart");
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
        const response: MonthlyDataResponse[][] = await Promise.all(monthsToLoad.map((el) => loadData(el)));

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

        const activeRange: number[] = displayRangeSelected.split("-").map((r) => parseInt(r));
        for (let domain in datasetsValues) {
            if (datasetsValues[domain].at(-1) < activeRange[0] || datasetsValues[domain].at(-1) > activeRange[1]) {
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
            size: { height: 600 },
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
                    // min: activeRange[0],
                    padding: 30,
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

    function onDisplayRangeChange(newRange: string) {
        loadChart();
    }

    function onDomainsListItemHover(e: CustomEvent) {

        if (chartObj && browser) {
            const ih = e.detail.domain;
            ih ? chartObj.focus(ih) : chartObj.focus();

            if (document.getElementById('chart')) {
                document.getElementById('chart').style.pointerEvents = ih ? 'none' : 'auto';
            }
        }
    }

    function onChartElementCreated(e: CustomEvent) {
        chartObj = e.detail.chartObj;
    }

    onMount(async () => {
        loadChart();
    });
</script>

<div class="fadeIn">
    <h1 class="text-center font-bold text-7xl">Visualize data from CloudFlare Radar</h1>
    <!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

    <div class="mt-24" />

    {#if chartData}
        <div class="flex flex-row justify-center">
            <DateRangePicker
                min="2022-10-01"
                max={dayjs().subtract(1, "day").format("YYYY-MM-DD")}
                fromInit={fromDate.format("YYYY-MM-DD")}
                toInit={toDate.format("YYYY-MM-DD")}
                on:apply={onDateChange}
            />
        </div>
        <div>
            <Chart {chartData} on:chartCreated={onChartElementCreated} />
        </div>

        <div class="mt-10 flex flex-col items-center gap-5">
            <div class="w-96 max-w-md">
                <Label>
                    Select a range to display
                    <Select class="mt-2" items={displayranges} bind:value={displayRangeSelected} />
                </Label>
            </div>
            <DomainsList data={chartData} on:itemHovered={onDomainsListItemHover} />
            <Label color='gray'>
                Click on a list item to set focus
             </Label>
        </div>
    {/if}
</div>

<style>
    .fadeIn {
        animation: fadeInBottom 1s ease;
        animation-fill-mode: forwards;

        opacity: 0%;
        transform: translateY(20px);
    }

    @keyframes fadeInBottom {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }

        100% {
            transform: translateY(0%);
            opacity: 1;
        }
    }
</style>
