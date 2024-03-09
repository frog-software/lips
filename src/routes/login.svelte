<script>
  import { onMount } from "svelte";
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let username = "";
  let password = "";

  async function handleLogin() {
    try {
      const userData = await pb
        .collection("users")
        .authWithPassword(username, password);
      if (userData) {
        currentUserEmail.set(username);
        const userEmail = $currentUserEmail;
        console.log("当前用户的电子邮件:", userEmail);
        push("/main");
      }
    } catch (error) {
      alert("用户名或密码错误");
    }
  }
  function handleRegister() {
    push("/register");
  }
  let currentpath = "";

  let previousBodyStyle = {};

  const unsubscribe = location.subscribe(($location) => {
    if (currentpath === "/login") {
      // Save current body style before navigating away
      previousBodyStyle = {
        backgroundImage: document.body.style.backgroundImage,
        backgroundSize: document.body.style.backgroundSize,
        backgroundPosition: document.body.style.backgroundPosition
      };
    }
    currentpath = $location;
  });
  onDestroy(unsubscribe);

  // 在组件挂载后修改全局样式
  onMount(() => {
    document.body.style.backgroundImage =
      "url('https://raw.githubusercontent.com/Range-bin/lips/6a1659c21d3e042507f619d6aa1b79083639de8b/loginpage.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  });

  onDestroy(() => {
    // Restore previous body style when leaving the page
    Object.keys(previousBodyStyle).forEach((key) => {
      document.body.style[key] = previousBodyStyle[key];
    });
  });
</script>

<main>
  {#if currentpath == "/login"}
    <div class="login-container">
      <h2>Login</h2>
      <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
          <input type="email" bind:value={username} placeholder="Email" />
        </div>
        <div class="form-group">
          <input type="password" bind:value={password} placeholder="Password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <p class="register-link">
        <!-- svelte-ignore a11y-invalid-attribute -->
        Don't have an account?
        <a href="#" on:click={handleRegister}>Register</a>
      </p>
    </div>
  {/if}
</main>

<style>
  /* 根据需求设置组件样式 */
  main {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: calc(100vw / 1.618 * 1.5); /* 改变宽度 */
    height: calc((100vw / 1.618) / 1.618 * 1.5); /* 改变高度 */
    max-width: 780px; /* 改变最大宽度 */
    max-height: 480px; /* 改变最大高度 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form {
    text-align: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  input[type="email"],
  input[type="password"],
  button {
    width: 150;
    max-width: calc(300% - 30px);
    box-sizing: border-box;
  }

  button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    margin-top: 10px;
  }
  .register-link {
    margin-top: 20px;
  }
</style>