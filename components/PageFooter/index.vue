<template>
  <footer id="footer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12 text-center">
          © 2018 MonkeyBinBin. <br class="d-block d-sm-none" />Built with Nuxt.js and Bootstrap 4.
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
#footer {
  background: #fff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
  color: rgb(146, 146, 146);
  font-size: 14px;
}

#footer .row {
  height: 80px;
}
</style>
