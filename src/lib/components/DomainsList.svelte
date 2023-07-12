<script lang="ts">
    import { SERVER_URL } from "$lib/costants";
    import type { ChartOptions } from "billboard.js";
    import { List, Li } from "flowbite-svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    export let data: ChartOptions;
    let rows: (string & number)[] = [];
    let xRow: string[] = [];

    $: updateData(data);

    function updateData(data: ChartOptions) {
        console.log(data);
        rows = [...data.data?.columns];
        xRow = rows.splice(0, 1);

        rows = rows.sort((a, b) => a.at(-1) - b.at(-1));
    }

    const domainsData: Writable<DomainDataReponse> = getContext("domainsData");
    const threndDisplay = {
        up: "gg-arrow-up text-green-500",
        down: "gg-arrow-down text-red-500",
        stable: "gg-play-pause text-yellow-300",
    };

    function getRowTrend(row: (string & number)[]): { trend: "up" | "down" | "stable"; rank: string; delta: string } {
        if (row.length < xRow[0].length) {
            return { trend: "down", rank: "" };
        }

        if (row.at(-1) === row[1]) {
            return { rank: row.at(-1).toString(), trend: "stable", delta: "-" };
        }

        return {
            rank: row.at(-1).toString(),
            trend: row[1] > row.at(-1) ? "up" : "down",
            delta: (row[1] - row.at(-1)).toString().replace("-", ""),
        };
    }
</script>

<List tag="ul" list="none" class="border p-2 rounded-xl w-96 max-w-md divide-y divide-gray-200 dark:divide-gray-700">
    {#each rows as row}
        <Li class="py-2 sm:py-3">
            <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                    {#if $domainsData && $domainsData[row[0]].favicon}
                        <img
                            class="w-8 h-8 rounded-full"
                            src="{SERVER_URL}/data/favicons/{$domainsData[row[0]].favicon}"
                            alt="{row[0]} favicon logo"
                            on:error={(e) => {
                                e.target.src = "/img/ios-globe-4.svg";
                            }}
                        />
                    {:else}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img class="w-8 h-8 rounded-full" src="/img/ios-globe-4.svg" />
                    {/if}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        <span class="text-gray-400">#{getRowTrend(row).rank}</span>
                        {row[0]}
                    </p>
                    {#if $domainsData && $domainsData[row[0]].categories}
                        <p class="text-xs text-gray-500 truncate dark:text-gray-400">
                            {$domainsData[row[0]].categories.map((el) => el.name).join(", ")}
                        </p>
                    {/if}
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <span>{getRowTrend(row).delta}</span>
                    <div class="w-5 flex flex-row justify-center">
                        <i class={threndDisplay[getRowTrend(row).trend]} />
                    </div>
                </div>
            </div>
        </Li>
    {/each}
</List>
