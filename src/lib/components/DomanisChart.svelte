<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import Chart from "$lib/components/Chart.svelte";
    import { getRandomId, loadData } from "$lib/utils";
    import { spline, type ChartOptions } from "billboard.js";
    import dayjs from "dayjs";
    import { Heading, Spinner } from "flowbite-svelte";
    import { createEventDispatcher, onMount } from "svelte";

    export let fromDate = dayjs().subtract(2, "month");
    export let toDate = dayjs().subtract(1, "day");
    export let chartId = "chart";
    export let activeRange: number[] | undefined = undefined;
    export let domainsFilter: string[] | undefined = undefined;

    let chartData: ChartOptions;
    let searchString = window.location.search;
    let chartObj;

    $: {
        if ($page.url.search !== searchString) searchString = $page.url.search;
    }

    $: triggerReload(fromDate, toDate, activeRange, domainsFilter, searchString);

    const dispatch = createEventDispatcher();

    async function loadChart() {
        if (!browser) {
            // Run only in the browser
            return;
        }
        
        chartData = undefined;

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

        const countryCode = $page.url.searchParams.get("country");

        let response: MonthlyDataResponse[][];
        if (countryCode) {
            //@ts-ignore
            response = await Promise.all(
                monthsToLoad.map((el) => {
                    return loadData("cf-localized/" + countryCode + "/" + el);
                })
            );
        } else {
            //@ts-ignore
            response = await Promise.all(monthsToLoad.map((el) => loadData("cf-monthly-data/" + el)));
        }

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

        let graphIsOverMax = false;

        response.forEach((month) => {
            month.forEach((day) => {
                const djsDate = dayjs(day.date, "YYYY-MM-DD");
                if (djsDate.isBefore(fromDate) || djsDate.isAfter(toDate)) {
                    return;
                }

                for (let dom in datasetsValues) {
                    const domResult = day.result.find((el) => el.domain === dom);
                    datasetsValues[dom].push(domResult ? domResult.rank : null);

                    graphIsOverMax = domResult ? false : true;
                }
            });
        });

        if (domainsFilter) {
            for (let domain in datasetsValues) {
                if (!domainsFilter.includes(domain)) {
                    delete datasetsValues[domain];
                }
            }
        } else if (activeRange) {
            for (let domain in datasetsValues) {
                if (datasetsValues[domain].at(-1) < activeRange[0] || datasetsValues[domain].at(-1) > activeRange[1]) {
                    delete datasetsValues[domain];
                }
            }
        }

        chartData = {
            bindto: "#" + chartId,
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
                    padding: { bottom: 5, top: 5 },
                    min: 1,
                    max: graphIsOverMax ? 101 : undefined,
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

    function onChartElementCreated(e: CustomEvent) {
        chartObj = e.detail.chartObj;
        dispatch("chartCreated", {
            chartObj,
            chartData,
        });
    }

    function triggerReload(r = "", e = "", l = "", o = "", a = "", d = "") {
        loadChart();
    }

    onMount(() => {
        loadChart();
    });
</script>

{#if chartData}
    <Chart {chartData} on:chartCreated={onChartElementCreated} />
{:else}
    <div class="h-96 flex flex-col items-center justify-center">
        <Spinner />
    </div>
{/if}
