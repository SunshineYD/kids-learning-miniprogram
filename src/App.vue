<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { useSettingsStore } from '@/store/settings'

onLaunch(() => {
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()
  
  userStore.init()
  settingsStore.init()
  
  if (userStore.isLoggedIn) {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
})
</script>

<style>
@import '@/styles/index.scss';
</style>
