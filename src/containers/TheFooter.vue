<template>
  <CFooter :fixed="false">
    <div>
      <a href="#" target="_blank">Ijazah-Client</a>
      <span> by KienzStudio.</span>
      <CLink class="ml-2" to="/theme/colors">Colors</CLink>
      <span> and</span>
      <CLink to="/theme/typography"> Typography</CLink>
    </div>
    <div class="ml-auto">
      <span class="mr-1">Powered by</span>
      <a href="https://coreui.io/vue" target="_blank">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
