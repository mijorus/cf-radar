<script lang="ts">
    import { Li, List } from "flowbite-svelte";
    import DomainImage from "./DomainImage.svelte";
    import { createEventDispatcher } from "svelte";

    export let searchResults: SearchResult[] = [];

    const dispatch = createEventDispatcher();
</script>

<List tag="ul" list="none" class="shadow-2xl max-w-md divide-y divide-gray-200 dark:divide-gray-700 bg-white border overflow-hidden rounded-xl">
    {#each searchResults as searchRes}
        <Li class="p-3 sm:p-4 hover:bg-gray-100">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="cursor-pointer flex items-center space-x-4" on:click={() => dispatch('itemClicked', { searchRes })}>
                <div class="flex-shrink-0">
                    <DomainImage favicon={searchRes.favicon} />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">{searchRes.domain}</p>
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">{searchRes.categories.map((el) => el.name).join(", ")}</p>
                </div>
            </div>
        </Li>
    {/each}
</List>
