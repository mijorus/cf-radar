<script lang="ts">
    import type { ChartOptions } from "billboard.js";
    import { List, Li } from "flowbite-svelte";
    export let data: ChartOptions;

    const rows = [...data.data?.columns];
    rows.splice(0, 1);
</script>

<List tag="ul" list="none" class="w-96 max-w-md divide-y divide-gray-200 dark:divide-gray-700">
    {#each rows as row}
        <Li class="pb-3 sm:pb-4">
            <div class="flex items-center space-x-4">
                <!-- <div class="flex-shrink-0">
                    <img class="w-8 h-8 rounded-full" src="/images/profile-picture-1.webp" alt="Neil profile" />
                </div> -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">{row[0]}</p>
                    <!-- <p class="text-sm text-gray-500 truncate dark:text-gray-400">1 </p> -->
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">3 ⬆️</div>
            </div>
        </Li>
    {/each}
</List>
