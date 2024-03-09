<script>
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let usereamil = "";
  let password = "";
  let username = "";

  async function handleLogin() {
    try {
      const userData = await pb
        .collection("users")
        .authWithPassword(usereamil, password);
      if (userData) {
        currentUserEmail.set(usereamil);
        const userEmail = $currentUserEmail;
        console.log("当前用户的电子邮件:", userEmail);
        push("/main");
      }
    } catch (error) {
      alert("用戶名或密碼錯誤");
    }
  }
  function handleRegister() {
    push("/register");
  }
  let currentpath = "";

  const unsubscribe = location.subscribe(($location) => {
    currentpath = $location;
  });
  onDestroy(unsubscribe);
</script>

<h1>Login</h1>

{#if currentpath == "/login"}
  <form on:submit|preventDefault={handleLogin}>
    <div class="content-box">
      <div class="item-box">
        <input type="email" bind:value={usereamil} placeholder="Email" />
      </div>
      <div class="item-box">
        <input type="password" bind:value={password} placeholder="Password" />
      </div>
    </div>
    <button type="submit">登录</button>
  </form>
  <button on:click={handleRegister}> 注册 </button>
{/if}
