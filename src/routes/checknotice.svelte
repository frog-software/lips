<!-- 显示通知具体内容 -->
<script>
  import { currentUserEmail,currentnoticeid } from "../store.js";
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
  async function copy(check) {
    try {
      const userEmail = $currentUserEmail;
      const newRecord = {
        tittle: check.tittle,
        body: check.body,
        tag: check.tag,
        year: check.year,
        month: check.month,
        day: check.day,
        useremail: userEmail,
        noticeid: check.id,
        username: check.username,
      };
      await pb.collection("todolist").create(newRecord);
      alert("添加成功！");
    } catch (error) {
      alert("添加失败。");
    }
  }
  onMount(() => {
    noticedisplay();
  });
</script>



{#each records as record}
  <div class="record">
    <div class="tittle">{record.tittle}</div>
    <div class="meta">
      {record.year}.{record.month}.{record.day}/#{record.tag}/from:{record.username}
    </div>
    <div>{record.body}</div>
    <button class="but" on:click={() => copy(record)}>+ todolist</button>
  </div>
{/each}

<style>
  .record {
    width: auto; 
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

  .but {
    color: black; /* 设置字体颜色为黑色 */
  }
</style>
