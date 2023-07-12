<script>
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
</script>

<Navbar let:hidden let:toggle navClass='p-2 md:p-0 border-b'>
    <NavBrand href="/">
        <span class="self-center whitespace-nowrap text-xl text-primary-800 font-semibold dark:text-white"> 
            Radar
        </span>
        <small class="opacity-75 ">&nbsp;(by mijorus)</small>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <!-- <NavLi href="/" active={true}>Home</NavLi> -->
        <NavLi href="/about">About</NavLi>
        <!-- <NavLi href="/services">Services</NavLi>
        <NavLi href="/pricing">Pricing</NavLi>
        <NavLi href="/contact">Contact</NavLi> -->
    </NavUl>
</Navbar>