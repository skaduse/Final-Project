<template>
  <div class="home">
    <div class='top-margin'></div>
    <image-gallery :photos="photos" />
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
import axios from 'axios';
import ImageGallery from '@/components/GlobalUploads.vue';
export default {
  name: 'Home',
  components: {
    ImageGallery,
  },
  data() {
    return {
      photos: [],
      error: '',
    }
  },
  async created() {
    await this.getPhotos();
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async getPhotos() {
      try {
        let response = await axios.get("/api/photos/all");
        this.photos = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style>

.home {
  min-height: 550px;
}
.top-margin {
  width: 100%;
  height: 50px;
}

</style>
