<script lang="ts">
    import { browser } from "$app/environment";
    import { SERVER_URL } from "$lib/costants";
    import { Navbar, Input, NavBrand, NavLi, NavUl, NavHamburger, Button, List, Li, Chevron, Dropdown, DropdownItem } from "flowbite-svelte";
    import { getContext, onMount } from "svelte";
    import { get, type Writable } from "svelte/store";
    import { navigating } from "$app/stores";
    import DomainImage from "$lib/components/DomainImage.svelte";
    import SearchDomains from "$lib/components/SearchDomains.svelte";
    import { goto } from "$app/navigation";
    import { loadData } from "$lib/utils";
    import { getCountryName } from "$lib/countryCodes";

    let searchBarMobileVisible = false;
    let searchValue = "";
    let searchResults: SearchResult[] = [];
    const domainsData: Writable<DomainDataReponse> = getContext("domainsData");
    let isMac = false;
    let countries: string[] = [];

    $: onLoadSearchResult(searchValue);

    navigating.subscribe((n) => {
        searchResults = [];
        searchValue = "";
    });

    function onLoadSearchResult(q: string) {
        searchResults = [];
        if (!browser || !get(domainsData) || q.length < 3) {
            return;
        }

        q = q.trim();

        for (let [key, value] of Object.entries(get(domainsData))) {
            let v: DomainData = value;

            if (key.split(".")[0].includes(q)) {
                searchResults = [...searchResults, { ...v, domain: key }];
            }
        }
    }

    function onWindowKeyDown(e: KeyboardEvent) {
        const modKeyPressed = isMac ? e.metaKey : e.ctrlKey;
        if (e.key === "k" && modKeyPressed && !["input", "textarea"].find((el) => el === document?.activeElement?.tagName)) {
            e.preventDefault();
            document.getElementById("search-navbar")?.focus();
        }
    }

    function onSearchDomainClicked(e: CustomEvent) {
        if (!browser) {
            return;
        }

        goto("/domain/" + e.detail.searchRes.domain);
    }

    onMount(async () => {
        isMac = navigator.userAgent.indexOf("Mac OS X") >= 0;

        countries = (await loadData("data/data")).country_codes;
        console.log(countries);
    });
</script>

<Navbar let:hidden let:toggle navClass="relative p-2 md:p-0 border-b" navDivClass="mx-auto flex flex-wrap justify-between items-center">
    <div class:hidden={searchBarMobileVisible}>
        <NavBrand href="/">
            <span class="self-center whitespace-nowrap text-xl text-primary-800 font-semibold dark:text-white"> Radar </span>
            <small class="opacity-75">&nbsp;(by mijorus)</small>
        </NavBrand>
    </div>
    <!-- <div class="w-0 md:block hidden" /> -->
    <div class="absolute left-1/2 tranform -translate-x-1/2 flex z-10">
        <div class="md:block relative" class:hidden={!searchBarMobileVisible}>
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 dark:text-white"
                    ><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg
                >
            </div>
            <Input id="search-navbar" type="search" class="pl-10 md:w-72" placeholder="Search ({isMac ? 'Cmd' : 'Ctrl'} + K)" bind:value={searchValue} />

            {#if searchResults.length}
                <div class="absolute top-12 md:left-1/2 w-72 md:w-96 md:transform md:-translate-x-1/2">
                    <SearchDomains {searchResults} on:itemClicked={onSearchDomainClicked} />
                </div>
            {/if}
        </div>
    </div>

    <div>
        <Button
            on:click={() => (searchBarMobileVisible = !searchBarMobileVisible)}
            color="none"
            data-collapse-toggle="mobile-menu-3"
            aria-controls="mobile-menu-3"
            aria-expanded="false"
            class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 
                dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 dark:text-white"
                ><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg
            >
        </Button>
        <NavHamburger on:click={toggle} />
    </div>

    <NavUl {hidden} ulClass="flex flex-col p-4 mt-4 md:flex-row md:items-center md:space-x-8 md:mt-0 md:text-sm md:font-medium">
        <div class="order-last md:order-first z-10">
            <Button color="light" outline>
                <Chevron>Worldwide</Chevron>
            </Button>
            <Dropdown id="country-selector">
                <div slot="header" class="px-4 py-2">
                    <span class="block text-sm text-gray-900 dark:text-white">Worldwide</span>
                </div>
                {#each countries.map((el) => getCountryName(el)).sort() as c}
                    <DropdownItem>{getCountryName(c)}</DropdownItem>
                {/each}
            </Dropdown>
        </div>
        <!-- <NavLi id="country-select" class="cursor-pointer">
        </NavLi> -->
        <!-- <NavLi href="/" active={true}>Home</NavLi> -->
        <NavLi href="/about">About</NavLi>
        <!-- <NavLi href="/services">Services</NavLi>
        <NavLi href="/pricing">Pricing</NavLi>
        <NavLi href="/contact">Contact</NavLi> -->
    </NavUl>
</Navbar>

<svelte:window on:resize={() => (searchBarMobileVisible = false)} on:keydown={onWindowKeyDown} />

<style>
    :global(#country-selector) {
        max-height: 50vh;
        overflow-y: scroll;
    }
</style>
