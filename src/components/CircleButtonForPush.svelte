<script>
    import { push } from "svelte-spa-router";
    import DoorPage from "../routes/doorPage.svelte";
    export let address;
    export let src;
    export let info;
    function Click() {
        push(address);
    }
</script>

<button class="circle" on:click={Click} title={info}>
    <img {src} alt="1" class="button-img" />
</button>

<style>
    .circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        /* border: none;   去除边框*/
        padding: 0;
        display: flex; /*居中图像*/
        justify-content: center;
        align-items: center;
    }
    .button-img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 保持图像的纵横比 */
    }
</style>
