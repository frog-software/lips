<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { push } from "svelte-spa-router";
  import Modal from "./Modal.svelte";
  import { onMount } from "svelte";
  import { currentUserEmail, currentchannelid } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let showModal = false;
  let createdChannels = []; // 存储用户创建的频道列表
  let currentTab = 'joined'; // 控制显示'joined'或'created'列表

  async function checkchan() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("users_channels").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find joined channels");
    }
  }

  async function fetchCreatedChannels() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("channels").getFullList({
        filter: `useremail="${userEmail}"`,
      });
      createdChannels = response;
    } catch (error) {
      alert("Failed to fetch created channels");
    }
  }

  function toggleModal() {
    showModal = !showModal;
  }

  onMount(() => {
    checkchan();
    fetchCreatedChannels();
  });

  function jumpnew(id) {
    currentchannelid.set(id);
    push("/chantemplate");
  }

  function JumpNewPage(address) {
    push("/" + address);
  }
</script>

<div class="left-side">
  <button class="button" on:click={toggleModal}>查看频道</button>
  <button class="button" on:click={() => JumpNewPage("createChannel")}>创建频道</button>
  <button class="button" on:click={() => JumpNewPage("searchChannel")}>查找频道</button>
  <button class="button">频道管理</button>
</div>

<Modal isOpen={showModal} close={toggleModal}>
  <div class="tabs">
    <button class="tab-btn" class:selected={currentTab === 'joined'} on:click={() => currentTab = 'joined'}>已加入的频道</button>
    <button class="tab-btn" class:selected={currentTab === 'created'} on:click={() => currentTab = 'created'}>我创建的频道</button>
  </div>
  {#if currentTab === 'joined'}
  <div class="container">
    {#each records as record}
    <button class="button" on:click={() => jumpnew(record.id)}>#{record.channelname}</button>
    {/each}
  </div>
  {/if}
  {#if currentTab === 'created'}
  <div class="container">
    {#each createdChannels as channel}
    <button class="button" on:click={() => jumpnew(channel.id)}>#{channel.channelName}</button>
    {/each}
  </div>
  {/if}
</Modal>

<style>
  .tabs {
    display: flex;
    justify-content: center; /* 居中对齐以适应现代设计 */
    background-color: #333; /* 深色背景以强调选项卡 */
    padding: 1rem;
    gap: 1rem; /* 添加间隙确保视觉分隔 */
  }

  .tab-btn {
    background-color: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: #ccc; /* 淡色字体 */
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s; /* 平滑过渡效果 */
  }

  .tab-btn:hover, .tab-btn.selected {
    color: #fff; /* 高亮颜色 */
    background-color: #555; /* 按钮背景变化 */
    border-radius: 20px; /* 圆角效果 */
  }

  .container {
    background-color: #2c2c2c; /* 深色背景 */
    max-width: 100%; /* 充满可用宽度 */
    max-height: 200px; /* 固定高度 */
    overflow-y: auto; /* 启用滚动 */
    padding: 1rem; /* 更多内边距 */
    border-radius: 10px; /* 圆角效果 */
    margin-top: 1rem; /* 与选项卡分隔 */
  }

  .button {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    background-color: #555;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s; /* 平滑背景色过渡 */
  }

  .button:hover {
    background-color: #666; /* 悬停时颜色变化 */
  }

  .left-side {
    width: 250px; /* 固定左侧宽度 */
    height: 100vh;
    padding: 1rem;
  }

  /* 滚动条样式 */
  .container::-webkit-scrollbar {
    width: 6px;
  }

  .container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  .container::-webkit-scrollbar-track {
    background-color: #333;
  }
</style>

