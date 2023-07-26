<script lang="ts">
    import "../app.postcss";
    import NavBar from "../NavBar.svelte";
    import { writable, type Writable } from "svelte/store";
    import { onMount, setContext } from "svelte";
    import "billboard.js/dist/billboard.css";
    import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from "flowbite-svelte";

    export let data;

    const domainsData: Writable<DomainDataReponse> = writable();
    setContext("domainsData", domainsData);

    $: if (data) domainsData.set(data.domainsData);
</script>

<NavBar />
<div class="fadeIn container mx-auto py-10 px-2 min-h-screen">
    <slot />
</div>

<hr>
<Footer>
    <FooterCopyright />
    <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <!-- <FooterLink href="/">About</FooterLink> -->
        <!-- <FooterLink href="/">Privacy Policy</FooterLink> -->
    </FooterLinkGroup>
</Footer>

<style>
    .fadeIn {
        animation: fadeInBottom 1s ease;
        animation-fill-mode: forwards;

        opacity: 0%;
        transform: translateY(20px);
    }

    @keyframes fadeInBottom {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }

        100% {
            transform: translateY(0%);
            opacity: 1;
        }
    }
</style>