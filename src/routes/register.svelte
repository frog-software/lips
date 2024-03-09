<!-- <script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  let username = "";
  let password = "";
  let passwordconfirm = "";
  const pb = new PocketBase(PocketBase_URL);

  async function creatCount() {
    const data = {
      emailVisibility: true,
      passwordConfirm: password,
      name: "test",
      email: username,
      password: password,
    };
    try {
      await pb.collection("users").create(data);
      push("/login");
    } catch (error) {
      alert("fail to register");
    }
  }
</script>

<h1>register</h1>
<form on:submit|preventDefault={creatCount}>
  <input type="email" bind:value={username} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <input
    type="password"
    bind:value={passwordconfirm}
    placeholder="Password confirm"
  />
  <button type="submit">注册</button>
</form> -->
<script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  let email = ""; // 之前的username现在改为email
  let username = ""; // 新添加，用于存储用户的用户名
  let password = "";
  let passwordconfirm = "";
  const pb = new PocketBase(PocketBase_URL);

  async function creatCount() {
    // 确保data对象包含所有需要的字段
    const data = {
      email: email,
      username: username, // 添加用户名字段
      password: password,
      passwordConfirm: passwordconfirm, // 确认密码
      emailVisibility: true,
      name: "test",
    };
    try {
      await pb.collection("users").create(data);
      push("/login");
    } catch (error) {
      console.error("Failed to register:", error);
      alert("fail to register");
    }
  }
</script>

<h1>Register</h1>
<form on:submit|preventDefault={creatCount}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="text" bind:value={username} placeholder="Username" />
  <!-- 新添加的用户名输入 -->
  <input type="password" bind:value={password} placeholder="Password" />
  <input
    type="password"
    bind:value={passwordconfirm}
    placeholder="Password Confirm"
  />
  <button type="submit">注册</button>
</form>
