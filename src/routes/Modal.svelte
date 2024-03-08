<!-- Modal.svelte -->
<script>
  export let isOpen = false; // 控制模态对话框是否显示的变量
  export let close; // 关闭模态对话框的函数
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={close}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={close}>×</button>
      <slot />
      <!-- 用于插入模态对话框的内容 -->
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
  }
</style>
