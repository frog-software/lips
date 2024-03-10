<!-- 显示我创建的通知 发布通知 删改通知 查找标签 -->
<script>
  import { PocketBase_URL } from "../utils/api/index";
  import PocketBase from "pocketbase";
  import { currentUserEmail, currentnoticeid } from "../store.js";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  async function checkchan() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  onMount(() => {
    checkchan();
  });

  function check(id) {
    currentnoticeid.set(id);
    push("/checknotice");
  }

  function JumpNewPage(address) {
    push("/" + address);
  }
</script>

<div class="container">
  <div class="button-group">
    <button class="button" on:click={() => JumpNewPage("postnotice")}
      >发送通知</button
    >
    <button class="button" on:click={() => JumpNewPage("selectTags")}
      >标签查找</button
    >
    <button class="button">通知管理</button>
  </div>
  <div class="records-list">
    {#each records as record}
      <div
        class="record"
        role="button"
        tabindex="0"
        on:click={() => check(record.id)}
        on:keypress
      >
        <div class="title">{record.tittle}</div>
        <div class="content">#{record.tag}</div>
        <div class="author">from:{record.useremail}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .record {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #ffffff;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content {
    font-size: 16px;
  }

  .author {
    font-size: 14px;
    color: #666;
  }
  .button {
    width: 60%;
    margin-top: 10px;
    padding: 10px;
    background-color: black;
    border-radius: 4px;
  }
  .button:hover {
    color: #ffffff;
    opacity: 1;
    background-color: #6a6d6e;
  }
  .container {
    display: flex;
    justify-content: space-between; /* 两侧对齐 */
    align-items: flex-start; /* 顶部对齐 */
    padding: 10px;
  }
  .button-group {
    flex-basis: 40%; /* 或者固定宽度，取决于你的需求 */
  }

  .records-list {
    flex-grow: 1; /* 让记录列表占据剩余的空间 */
  }
</style>
