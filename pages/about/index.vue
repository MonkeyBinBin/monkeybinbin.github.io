<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
    >
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div class="section-header">
            <h3 class="section-title">
              關於我
            </h3>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <p>來自台灣。屬猴,但不猴急。會寫一點點程式，喜歡研究前端技術。也喜歡塗鴨亂畫，畫一些可愛的漫畫風格。</p>
          <p>略懂C#、Xamarin、Cordova、HTML、CSS、Javascript、React、Vue、Angular、Webpack、Photoshop、Bootstrap...</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
export default {
  name: 'About',
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>
