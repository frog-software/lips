<!-- 查看当前用户创建的todolist 点击查看对应通知-->
<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { push } from "svelte-spa-router";
  import Modal from "./Modal.svelte";
  import { onMount } from "svelte";
  import { currentUserEmail, currentnoticeid } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let showModal = false;
  async function checkchan() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("todolist").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }
  function jumpnew(id) {
    currentnoticeid.set(id);
    push("/checknotice");
  }
  function toggleModal() {
    showModal = !showModal;
  }
  onMount(() => {
    checkchan();
  });
</script>

<button on:click={toggleModal}>查看todolist</button>

<Modal isOpen={showModal} close={toggleModal}>
  <h2 style="color: black;">todolist</h2>
  <div class="container">
    {#each records as record}
      <button class="button" on:click={() => jumpnew(record.noticeid)}
        >#{record.tittle}</button
      >
    {/each}
  </div>
</Modal>

<style>
  .container {
    max-width: 300px;
    max-height: 200px; /* 设置列表的最大高度 */
    overflow-y: auto; /* 超出部分显示滚动条 */
    background: #f9f9f9; /* 背景色，可根据需要调整 */
    border-radius: 5px; /* 边框圆角 */
    padding: 10px; /* 内边距 */
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
</style>
