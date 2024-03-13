<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";

  const dispatch = createEventDispatcher();
  const pb = new PocketBase(PocketBase_URL);

  // 假设这个是通过某种方式从上层组件或者页面加载逻辑获取的频道对象
  export let channel = { id: "", channelName: "", channelDescription: "" };
  let originalChannelName = channel.channelName;
  // 更新users_channels集合中所有记录的channelName字段
  async function updateUsersChannels(originalChannelName, updatedChannelName) {
    try {
      // 查询所有与该原始频道名称相关的users_channels记录
      const response = await pb.collection("users_channels").getFullList({
        filter: `channelname='${originalChannelName}'`,
      });

      // 遍历这些记录并逐一更新它们
      for (const userChannel of response) {
        await pb.collection("users_channels").update(userChannel.id, {
          channelname: updatedChannelName, // 更新为新的频道名称
        });
      }
    } catch (error) {
      console.error("Failed to update users_channels records:", error);
    }
  }

  // 保存频道更改
  async function saveChanges() {
    try {
      await pb.collection("channels").update(channel.id, {
        channelName: channel.channelName,
        channelDescription: channel.channelDescription,
      });

      // 如果频道名称有变更，调用更新users_channels集合的函数
      if (originalChannelName !== channel.channelName) {
        await updateUsersChannels(originalChannelName, channel.channelName);
      }

      dispatch("update");
      alert("Channel updated successfully");
    } catch (error) {
      console.error("Failed to update channel", error);
      alert("Failed to update channel");
    }
  }
</script>

<Modal isOpen={true} close={() => dispatch("close")}>
  <form on:submit|preventDefault={saveChanges}>
    <input bind:value={channel.channelName} placeholder="Channel Name" />
    <textarea
      bind:value={channel.channelDescription}
      placeholder="Channel Description"
    ></textarea>
    <button type="submit">Save Changes</button>
  </form>
</Modal>
