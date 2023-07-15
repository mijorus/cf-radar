<script lang="ts">
    import { browser } from "$app/environment";
    import Chart from "$lib/components/Chart.svelte";
    import DomainImage from "$lib/components/DomainImage.svelte";
    import { loadData } from "$lib/utils";
    import { spline, type ChartOptions } from "billboard.js";
    import dayjs from "dayjs";
    import { Heading } from "flowbite-svelte";
    import { createEventDispatcher, onMount } from "svelte";

    export let fromDate = dayjs().subtract(2, "month");
    export let toDate = dayjs().subtract(1, "day");
    export let activeRange: number[] | undefined = undefined;
    export let domainsFilter: string[] | undefined = undefined;

    let chartData: ChartOptions;
    let chartObj;

    $: triggerReload(fromDate, toDate, activeRange, domainsFilter);

    const dispatch = createEventDispatcher();

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
        const response: MonthlyDataResponse[][] = await Promise.all(monthsToLoad.map((el) => loadData("cf-monthly-data/" + el)));

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
                    padding: { bottom: 5 },
                    min: 1,
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

    function triggerReload(r, e, l, o) {
        loadChart();
    }

    onMount(() => {
        loadChart();
    });
</script>

{#if chartData}
    <Chart {chartData} on:chartCreated={onChartElementCreated} />
{/if}
