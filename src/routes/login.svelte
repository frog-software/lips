<script>
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let usereamil = "";
  let password = "";

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

<div class="flex items-center h-screen">
  <div class='w-1/2 bg-base-300 p-10'>
    <h1 class='mb-5'>Login</h1>
    {#if currentpath == "/login"}
      <form on:submit|preventDefault={handleLogin}>
        <div class="flex flex-col space-y-4 items-center">
          <div>
            <input class="input input-bordered w-full max-w-xs" type="email" bind:value={usereamil} placeholder="Email" />
          </div>
          <div>
            <input class="input input-bordered w-full max-w-xs" type="password" bind:value={password} placeholder="Password" />
          </div>
          <div class='flex flex-row space-x-10' >
            <button class='btn btn-wide btn-primary'  type="submit">登录</button>
          </div>
        </div>
      </form>
      <div>New to lips?<a href='/#/register'>Create a account</a></div>
    {/if}
  </div>
</div>