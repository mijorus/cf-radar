<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import Chart from "$lib/components/Chart.svelte";
    import DomainImage from "$lib/components/DomainImage.svelte";
    import DomanisChart from "$lib/components/DomanisChart.svelte";
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

    let fromDate = dayjs().subtract(2, "month");
    let toDate = dayjs().subtract(1, "day");
    let mounted = false;

    onMount(() => {
        // loadChart();
        mounted = true;
    });
</script>

<Heading tag="h1" class="mb-4" customSize="flex flex-row items-end justify-between">
    <div class="flex flex-row items-center gap-3">
        <DomainImage favicon={data.domainsData[data.domain].favicon} imageClass="w-8 h-8 md:w-12 md:h-12 rounded-full" />
        <span class="text-4xl font-extrabold md:text-5xl lg:text-6xl">
            {data.domain}
        </span>
    </div>
    <div>
        <GradientButton color="green" pill shadow>
            <div class="flex flex-row items-center gap-2">
                <i class="gg-math-plus"></i> 
                <span>Compare</span>
            </div>
        </GradientButton>
    </div>
</Heading>

{#if mounted}
    <div>
        <DomanisChart {fromDate} {toDate} {domainsFilter} />
    </div>
{/if}
