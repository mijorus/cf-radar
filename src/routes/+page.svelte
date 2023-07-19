<script lang="ts">
    import Chart from "$lib/components/Chart.svelte";
    import { onMount, tick } from "svelte";
    import dayjs from "dayjs";
    import ky from "ky";
    import bb, { line, spline } from "billboard.js";
    import type { ChartOptions } from "billboard.js";
    import DomainsList from "$lib/components/DomainsList.svelte";
    import { SERVER_URL } from "$lib/costants";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import { loadData } from "$lib/utils";
    import { Heading, Label, Select } from "flowbite-svelte";
    import { browser } from "$app/environment";
    import type { Chart as ChartBl } from "billboard.js";
    import DomanisChart from "$lib/components/DomanisChart.svelte";

    let chartData: ChartOptions;

    let fromDate = dayjs().subtract(2, "month");
    let toDate = dayjs().subtract(1, "day");
    let chartObj: ChartBl;
    let mounted = false;

    const displayranges = [
        { name: "1st👑 - 10th", value: "1-10" },
        { name: "11th - 20th", value: "11-20" },
        { name: "21st - 45th", value: "21-50" },
        { name: "51st - 75th", value: "51-75" },
        { name: "76st - 100th", value: "76-100" },
    ];

    let displayRangeSelected = "1-10";
    let activeRange: number[] = [];

    $: onDisplayRangeChange(displayRangeSelected);

    function onDateChange(e: CustomEvent) {
        fromDate = dayjs(e.detail.fromDate, "YYYY-MM-DD");
        toDate = dayjs(e.detail.toDate, "YYYY-MM-DD");

        if (fromDate.isSame(toDate, "day")) {
            fromDate = fromDate.subtract(1, "day");
        }
    }

    function onDisplayRangeChange(newRange: string) {
        activeRange = displayRangeSelected.split("-").map((r) => parseInt(r));
    }

    function onDomainsListItemHover(e: CustomEvent) {
        if (chartObj && browser) {
            const ih = e.detail.domain;
            ih ? chartObj.focus(ih) : chartObj.focus();

            document.getElementById("chart").style.pointerEvents = ih ? "none" : "auto";
        }
    }

    function onChartElementCreated(e: CustomEvent) {
        chartObj = e.detail.chartObj;
        chartData = e.detail.chartData;
    }

    onMount(async () => {
        mounted = true;
    });
</script>

<div class="fadeIn">
    <Heading tag="h1" class="mb-4" customSize="text-center text-4xl font-extrabold  md:text-5xl lg:text-6xl">Visualize data from CloudFlare Radar</Heading>
    <!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

    <div class="mt-24" />

    {#if mounted}
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
            <!-- <Chart {chartData} on:chartCreated={onChartElementCreated} /> -->
            <DomanisChart {fromDate} {toDate} {activeRange} on:chartCreated={onChartElementCreated} />
        </div>

        <div class="mt-10 flex flex-col items-center gap-5">
            <div class="w-96 max-w-md">
                <Label>
                    Select a range to display
                    <Select class="mt-2" items={displayranges} bind:value={displayRangeSelected} />
                </Label>
            </div>
            {#if chartData}
                <DomainsList data={chartData} on:itemHovered={onDomainsListItemHover} />
                <Label color="gray" defaultClass="text-center">
                    Click on a list item to <b>set focus</b> <br>
                    Use the <b>search bar</b> to compare selective domains
                </Label>
            {/if}
        </div>
    {/if}
</div>
