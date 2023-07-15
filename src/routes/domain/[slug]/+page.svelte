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
    import { Button, GradientButton, Heading } from "flowbite-svelte";
    import { onMount } from "svelte";

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

    function onDateApply(e: CustomEvent) {
        fromDate = dayjs(e.detail.fromDate, "YYYY-MM-DD");
        toDate = dayjs(e.detail.toDate, "YYYY-MM-DD");
    }

    function onDataChange(data) {
        rank = undefined;
        const r = data.currentMonthData.at(-1)?.result.find((el) => el.domain === data.domain);
        if (r) rank = r.rank;
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
        <Button outline color="red" pill>
            <span>+ Compare</span>
        </Button>
    </div>
</Heading>

<div class="mt-20">
    <div class="flex flex-row justify-center">
        <DateRangePicker fromInit={fromDate.format("YYYY-MM-DD")} on:apply={onDateApply} />
    </div>
    {#if mounted}
        <div>
            <DomanisChart {fromDate} {toDate} {domainsFilter} on:chartCreated={(e) => e.detail.chartObj.focus(data.domain)} />
        </div>
    {/if}
</div>
