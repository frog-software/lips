<!-- 显示通知具体内容 -->
<script>
  import { currentnoticeid } from "../store.js";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { onMount } from "svelte";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  async function noticedisplay() {
    try {
      const createid = $currentnoticeid;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `id="${createid}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  onMount(() => {
    noticedisplay();
  });
</script>

{#each records as record}
  <div class="record">
    <div class="tittle">{record.tittle}</div>
    <div class="meta">/#{record.tag}/from:{record.useremail}</div>
    <div>{record.body}</div>
  </div>
{/each}

<style>
  .record {
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px 0;
    background-color: #f9f9f9;
  }

  .tittle {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
  }

  .meta {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
  }
</style>
