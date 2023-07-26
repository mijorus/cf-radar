<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import Chart from "$lib/components/Chart.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import DomainImage from "$lib/components/DomainImage.svelte";
    import DomanisChart from "$lib/components/DomanisChart.svelte";
    import { addQueryParam, clone, getRandomId, loadData } from "$lib/utils";
    import { spline } from "billboard.js";
    import dayjs from "dayjs";
    import { Button, GradientButton, Heading, Input } from "flowbite-svelte";
    import { getContext, onMount, tick } from "svelte";
    import type { Chart as BbChart } from "billboard.js";
    import { slide, fly } from "svelte/transition";
    import { get, type Writable } from "svelte/store";
    import SearchDomains from "$lib/components/SearchDomains.svelte";
    import { goto } from "$app/navigation";

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
    let notFoundError = false;
    const domainsData: Writable<DomainDataReponse> = getContext("domainsData");
    let searchResults: SearchResult[] = [];

    $: onLoadSearchCompareResult(compareToValue);

    function onDateApply(e: CustomEvent) {
        fromDate = dayjs(e.detail.fromDate, "YYYY-MM-DD");
        toDate = dayjs(e.detail.toDate, "YYYY-MM-DD");
    }

    function onDataChange(data) {
        rank = undefined;
        notFoundError = false;
        searchResults = [];

        const r = data.currentMonthData.at(-1)?.result.find((el) => el.domain === data.domain);
        r ? (rank = r.rank) : (notFoundError = true);
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

        if (domainsFilter.length === 1) {
            chartObj.focus(data.domain);
        }
    }

    function onLoadSearchCompareResult(q: string) {
        searchResults = [];
        if (!browser || !get(domainsData) || q.length < 3) {
            return;
        }

        q = q.trim();

        for (let [key, value] of Object.entries(get(domainsData))) {
            if (key.split(".")[0].includes(q) && !domainsFilter.includes(key)) {
                searchResults = [...searchResults, { ...value, domain: key }];
            }
        }
    }

    function onCompareItemClicked(e: CustomEvent) {
        domainsFilter = [...domainsFilter, e.detail.searchRes.domain];
        searchResults = [];
        compareToValue = "";

        let compClone: string[] = clone(domainsFilter);
        goto(addQueryParam("compareTo", compClone.slice(1)));
    }

    function onCompareResetBtnClicked() {
        domainsFilter = [data.domain];
        window.history.replaceState({}, "", window.location.pathname);
    }

    function onRemoveCompareDomainClicked(domain: string) {
        domainsFilter.splice(domainsFilter.indexOf(domain), 1);
        domainsFilter = [...domainsFilter];
    }

    onMount(async () => {
        mounted = true;

        let compareToQs = $page.url.searchParams.get("compareTo");

        if (compareToQs) {
            domainsFilter = [...domainsFilter, ...compareToQs.split(",").filter((el) => Object.keys(get(domainsData)).includes(el))];
        }
    });
</script>

<Heading tag="h1" class="mb-4" customSize="flex flex-row items-end justify-between">
    {#if notFoundError}
        <div>
            <div class="mb-6 text-red-500 text-4xl font-extrabold md:text-5xl lg:text-6xl">404: Not found</div>
            <a href="/" class="text-xl underline">{"<"} Homepage</a>
        </div>
    {:else}
        <div class="flex flex-row items-end gap-3">
            <DomainImage favicon={data.domainsData[data.domain].favicon} imageClass="w-8 h-8 md:w-12 md:h-12 rounded-full" domain={data.domain} />
            <span class="text-4xl font-extrabold md:text-5xl lg:text-6xl">
                {data.domain}
            </span>
            {#if rank}
                <span class="opacity-50 text-2xl md:text-3xl"> #{rank} </span>
            {/if}
        </div>
        <div>
            <Button outline={compareMode} pill on:click={onCompareBtnClicked}>
                <span>{compareMode ? "< Close" : "+ Compare"}</span>
            </Button>
        </div>
    {/if}
</Heading>

<div class="mt-20">
    {#if mounted}
        {#if !notFoundError}
            <div class="mb-10 flex flex-row justify-center">
                <DateRangePicker fromInit={fromDate.format("YYYY-MM-DD")} on:apply={onDateApply} />
            </div>
            <div class="flex flex-row w-full">
                <div class={compareMode ? "w-full md:w-2/3" : "w-full"}>
                    <div>
                        <DomanisChart chartId={"chart-" + getRandomId()} {fromDate} {toDate} {domainsFilter} on:chartCreated={onChartCreated} />
                    </div>
                </div>
                {#if compareMode}
                    <div class="flex flex-col items-center w-full md:w-1/3" in:fly>
                        <div>
                            <Input id="search-navbar" type="search" class="mb-2 pl-10 md:w-72" placeholder="Add a domain..." bind:value={compareToValue} />
                            <div class:hidden={searchResults.length} class="flex flex-col items-center">
                                <Button size="xs" color="light" outline on:click={onCompareResetBtnClicked}><i class="gg-undo mr-2" />Reset</Button>
                                <div class="mt-10" />
                                <ul class="w-full">
                                    {#each domainsFilter.slice(1) as dom}
                                        <li class="flex flex-row justify-between items-center mt-3 p-3 border border-gray-400 rounded-xl w-full">
                                            <span>{dom}</span>
                                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <button on:click={() => onRemoveCompareDomainClicked(dom)}>
                                                <i class="gg-close text-red-600 cursor-pointer" />
                                            </button>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                            <div class="w-full" class:hidden={!searchResults.length}>
                                <SearchDomains {searchResults} on:itemClicked={onCompareItemClicked} />
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    {/if}
</div>
