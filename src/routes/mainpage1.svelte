<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import { currentUserEmail, username } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let channels = []; // 存储频道数据
  let todos = []; // 存储待办事项数据

  // 假设有异步函数来获取当前用户的频道和待办事项
  async function fetchChannels() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("users_channels").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      channels = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  async function fetchTodos() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("todolist").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      todos = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  onMount(async () => {
    await fetchChannels();
    await fetchTodos();
  });

  function logout() {
    // 登出逻辑，这里简单地跳转到登录页面
    push("/login");
  }

  function navigateToChannelDetail(channelId) {
    push(`/channel-detail/${channelId}`);
  }

  function navigateToTodoDetail(todoId) {
    push(`/todo-detail/${todoId}`);
  }
</script>

<Navbar />

<div class="flex h-screen">
  <!-- 左侧用户信息 -->
  <div
    class="flex flex-col w-2/5 items-center space-y-10 py-10"
    style="padding-top: 90px;"
  >
    <img
      src="userPicture.jpeg"
      alt="User Profile"
      style="width: 300px; height: 300px; object-fit: cover;"
      class="rounded-full"
    />
    <p class="text-4xl text-black">{$username}</p>
    <button class="btn" on:click={logout}>登出</button>
  </div>

  <!-- 右侧内容区 -->
  <div class="w-3/5 p-4">
    <!-- 频道列表 -->
    <div class="channels h-3/5 overflow-y-auto p-2">
      <h2 class="text-2xl font-semibold mb-4 text-black">Channels</h2>
      <div class="grid grid-cols-2 gap-4">
        {#each channels as channel}
          <div
            class="channel-box"
            on:click={() => navigateToChannelDetail(channel.channelname)}
          >
            {channel.channelname}
          </div>
        {/each}
      </div>
    </div>

    <!-- 待办事项列表 -->
    <div class="todos h-2/5 overflow-y-auto p-2 mt-4">
      <h2 class="text-2xl font-semibold mb-4 text-black">Todos</h2>
      <div class="grid grid-cols-2 gap-4">
        {#each todos as todo}
          <div
            class="todo-box"
            on:click={() => navigateToTodoDetail(todo.tittle)}
          >
            {todo.tittle}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .channel-box {
    border: 1px solid #ccc;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;
    height: 100px; /* 或者根据内容调整 */
    color: black; /* 将文字颜色设置为黑色 */
  }

  .todo-box {
    border: 1px solid #ddd;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;
    height: 100px; /* 或者根据内容调整 */
    color: black; /* 将文字颜色设置为黑色 */
  }
</style>
