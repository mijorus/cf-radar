<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import Chart from "$lib/components/Chart.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import DomainImage from "$lib/components/DomainImage.svelte";
    import DomanisChart from "$lib/components/DomanisChart.svelte";
    import { loadData } from "$lib/utils";
    import { spline } from "billboard.js";
    import dayjs from "dayjs";
    import { Button, GradientButton, Heading, Input } from "flowbite-svelte";
    import { onMount, tick } from "svelte";
    import type { Chart as BbChart } from "billboard.js";
    import { slide, fly } from "svelte/transition";

    interface DomainData {
        domainsData: DomainDataReponse;
        domain: string;
    }

    export let data: DomainData;
    $: domainsFilter = [data.domain];

    $: onDataChange(data);

    let fromDate = dayjs().subtract(2, "month");
    let toDate = dayjs().subtract(1, "day");
    let mounted = false;
    let rank: number | undefined;
    let compareMode = false;
    let chartObj: BbChart;
    let compareToValue: string = "";

    function onDateApply(e: CustomEvent) {
        fromDate = dayjs(e.detail.fromDate, "YYYY-MM-DD");
        toDate = dayjs(e.detail.toDate, "YYYY-MM-DD");
    }

    function onDataChange(data) {
        rank = undefined;
        const r = data.currentMonthData.at(-1)?.result.find((el) => el.domain === data.domain);
        if (r) rank = r.rank;
    }

    async function onCompareBtnClicked() {
        compareMode = !compareMode;

        await tick();
        if (chartObj) {
            chartObj.flush();
        }
    }

    function onChartCreated(e: CustomEvent) {
        chartObj = e.detail.chartObj;
        chartObj.focus(data.domain);
    }

    onMount(async () => {
        mounted = true;
    });
</script>

<Heading tag="h1" class="mb-4" customSize="flex flex-row items-end justify-between">
    <div class="flex flex-row items-end gap-3">
        <DomainImage favicon={data.domainsData[data.domain].favicon} imageClass="w-8 h-8 md:w-12 md:h-12 rounded-full" />
        <span class="text-4xl font-extrabold md:text-5xl lg:text-6xl">
            {data.domain}
        </span>
        {#if rank}
            <span class="opacity-50 text-2xl md:text-3xl"> #{rank} </span>
        {/if}
    </div>
    <div>
        <Button outline color="red" pill on:click={onCompareBtnClicked}>
            <span>{compareMode ? '-' : '+'} Compare</span>
        </Button>
    </div>
</Heading>

<div class="mt-20">
    {#if mounted}
        <div class="flex flex-row w-full">
            <div class="{compareMode ? 'w-full md:w-1/2' : 'w-full'}">
                <div class="flex flex-row justify-center">
                    <DateRangePicker fromInit={fromDate.format("YYYY-MM-DD")} on:apply={onDateApply} />
                </div>
                <div>
                    <DomanisChart {fromDate} {toDate} {domainsFilter} on:chartCreated={onChartCreated} />
                </div>
            </div>
            {#if compareMode}
                <div class="flex flex-col items-center w-full md:w-1/2" in:fly>
                    <div>
                        <Input id="search-navbar" type="search" class="pl-10 md:w-72" placeholder="Type a domain..." bind:value={compareToValue} />
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
