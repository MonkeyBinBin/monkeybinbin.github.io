<template>
  <footer class="footer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12 text-center">
          © 2025 MonkeyBinBin. <br class="d-block d-sm-none">Built with Nuxt 3.
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter'
}
</script>

<style lang="scss" scoped>
.footer {
  background: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  color: rgb(146, 146, 146);
  font-size: 14px;
}

.footer .row {
  height: 80px;
}
</style>
