<!-- 查看频道 -->
<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import Modal from "./Modal.svelte";
  import { onMount } from "svelte";
  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let showModal = false;
  async function checkchan() {
    try {
      const response = await pb.collection("channels").getFullList({
        sort: "-created",
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }
  function toggleModal() {
    showModal = !showModal;
  }
  onMount(() => {
    checkchan();
  });
</script>

<h1>check your channels</h1>

<button on:click={toggleModal}>查看频道</button>

<!-- <Modal show={showModal} close={() => showModal = false}>
    
</Modal> -->
<Modal isOpen={showModal} close={toggleModal}>
  <h2>频道</h2>
  <div class="container">
    {#each records as record}
      <button class="button">#{record.channelName}</button>
      <!-- <p>#{record.channelName}</p> -->
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
    background-color: #f8f9fa;
    border-radius: 4px;
  }
</style>
