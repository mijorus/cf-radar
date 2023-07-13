<script lang="ts">
    import ky from "ky";
    import "../app.postcss";
    import NavBar from "../NavBar.svelte";
    import { SERVER_URL } from "$lib/costants";
    import { writable, type Writable } from "svelte/store";
    import { onMount, setContext } from "svelte";
    import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from "flowbite-svelte";

    export let data;

    const domainsData: Writable<DomainDataReponse> = writable();
    setContext("domainsData", domainsData);

    $: if (data) domainsData.set(data.domainsData);
</script>

<NavBar />
<div class="container mx-auto py-10 px-2 min-h-screen">
    <slot />
</div>

<hr>
<Footer>
    <FooterCopyright />
    <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <FooterLink href="/">About</FooterLink>
        <FooterLink href="/">Privacy Policy</FooterLink>
        <!-- <FooterLink href="/">Licensing</FooterLink> -->
        <!-- <FooterLink href="/">Contact</FooterLink> -->
    </FooterLinkGroup>
</Footer>
