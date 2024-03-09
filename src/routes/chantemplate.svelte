<!-- 频道模板 可发送通知 显示频道已有的通知-->
<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentchannelid, currentnoticeid } from "../store.js";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  async function noticedisplay() {
    try {
      const channel = $currentchannelid;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `channelid="${channel}"`,
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  onMount(() => {
    noticedisplay();
  });

  function send() {
    push("/postnotice");
  }

  function check(id) {
    currentnoticeid.set(id);
    push("/checknotice");
  }
</script>

<button on:click={send}>发送通知</button>

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
</style>
