<!-- CombinedUsersList.svelte -->
<script>
  import { onMount } from "svelte";

  let channels = []; // 存储已加入的频道列表
  let channelMembers = []; // 存储当前频道的成员列表
  let isAdmin = true; // 判断当前用户是否为频道管理员，这里假设为true，您可以根据实际情况进行修改

  onMount(async () => {
    try {
      // 发起请求，获取频道列表和当前频道的成员列表
      const response = await fetch("http://your-api/combined-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 可以添加认证头部
        },
      });

      if (response.ok) {
        const data = await response.json();
        channels = data.channels;
        channelMembers = data.channelMembers;
      } else {
        console.error("Failed to fetch combined data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching combined data:", error);
    }
  });
</script>

<main>
  <!-- 显示已加入的频道列表，如果用户是频道管理员 -->
  {#if isAdmin}
    <section>
      <h2>My Channels</h2>
      <ul>
        {#each channels as channel}
          <li>{channel.name}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- 显示当前频道的成员列表 -->
  <section>
    <h2>Channel Members</h2>
    <ul>
      {#each channelMembers as member}
        <li>{member.name} - {member.email}</li>
        <!-- 根据实际数据结构调整 -->
      {/each}
    </ul>
  </section>
</main>
