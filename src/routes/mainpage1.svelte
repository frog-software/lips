<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import {
    currentUserEmail,
    currentnoticeid,
    isJoinedTodo,
    username,
    originChannelID,
  } from "../store.js";

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

  function jumpnew(origin) {
    originChannelID.set(origin);
    push("/chantemplate");
  }
  async function jumptodo(title) {
    const response_ = await pb.collection("notices").getFullList({
      sort: "-created",
      filter: `tittle="${title}"`,
    });

    currentnoticeid.set(response_[0].id);
    const uEmail = $currentUserEmail;
    const response = await pb.collection("todolist").getFullList({
      sort: "-created",
      filter: `useremail="${uEmail}"`,
    });

    for (const item of response) {
      if (item.tittle == title) {
        isJoinedTodo.set("find");
        break;
      } else {
        isJoinedTodo.set("noFind");
      }
    }
    push("/checknotice");
  }
  let src = "userPicture.jpeg";
</script>

<Navbar />

<div class="flex h-screen">
  <!-- 左侧用户信息 -->
  <div class="flex flex-col w-2/5 items-center h-dvh space-y-10 py-10">
    <img {src} alt="user" class="button-img" />
    <p class="text-7xl text-black">{$username}</p>
  </div>

  <!-- 右侧内容区 -->
  <div class="content-area w-3/5 p-4">
    <!-- 频道列表 -->
    <div class="channels h-3/5 overflow-y-auto p-2">
      <h2 class="text-2xl font-semibold mb-4 text-black">Channels</h2>
      <div class="grid grid-cols-2 gap-4">
        {#each channels.slice(0, 6) as channel}
          <!-- 限制显示到最多6个频道 -->
          <button
            class="channel-box"
            on:click={() => jumpnew(channel.originid)}
          >
            {channel.channelname}
          </button>
        {/each}
      </div>
    </div>
    <!-- 待办事项列表，显示最多2个 -->
    <!-- 待办事项列表，显示最多2个 -->
    <div class="todos h-2/5 p-2 mt-4">
      <h2 class="text-2xl font-semibold mb-4 text-black">Todos</h2>
      <div class="todo-list">
        {#each todos.slice(0, 2) as todo}
          <!-- 限制显示到最多2个待办事项 -->
          <button class="todo-item" on:click={() => jumptodo(todo.tittle)}>
            <div class="todo-title">{todo.tittle}</div>
            <div class="todo-content">{todo.body}</div>
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .channels {
    height: 55%;
    overflow: hidden;
  }

  .todos {
    height: 45%;
    overflow: hidden;
    padding-top: 0;
  }

  /* 其余样式保持不变 */
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

  .todos {
    overflow: hidden; /* 禁止滚动 */
  }

  .todo-list {
    display: flex;
    flex-direction: column;
  }

  .todo-item {
    padding: 16px;
    border-bottom: 1px solid #ccc; /* Add a bottom border for each todo */
    margin-bottom: -1px; /* Overlap borders */
  }

  .todo-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px; /* Add some space between the title and content */
  }

  .todo-content {
    font-size: 16px;
    color: #333; /* Slightly lighter text for content */
  }
  /* 基础样式保持不变 */

  /* 响应式设计的改进 */
  @media (max-width: 1024px) {
    .user-info {
      flex-direction: column;
      width: 100%;
      align-items: center;
      padding-top: 5vh;
    }

    .user-picture {
      width: 50vw;
      height: 50vw; /* 保持图片的纵横比 */
    }

    .username {
      font-size: 5vw;
    }

    .content-area {
      width: 100%;
      padding: 2vw;
    }

    .channel-box,
    .todo-item {
      font-size: 4vw;
      padding: 2vw;
    }

    .todo-title,
    .todo-content {
      font-size: 3vw;
    }

    .channels,
    .todos {
      height: auto; /* 允许内容定义高度 */
    }
  }

  @media (max-width: 768px) {
    .username {
      font-size: 6vw;
    }

    .channel-box,
    .todo-item {
      font-size: 5vw;
    }

    .todo-title,
    .todo-content {
      font-size: 4vw;
    }
  }

  .button-img {
    width: 360px; /* 设置图像的宽度 */
    height: 360px; /* 设置图像的高度为与宽度相同的值，以确保图像是正方形的 */
    border-radius: 50%; /* 这将使图像的边角变圆，形成圆形 */
    object-fit: cover; /* 确保图像在调整大小时保持其宽高比 */
  }
  /* 根据需要继续添加更多的媒体查询规则 */

  /* 可能需要调整这些值来更好地匹配上传的图片 */
</style>
