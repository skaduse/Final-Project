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
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
    await this.getPhotos();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async getPhotos() {
      try {
        let response = await axios.get("/api/photos/all");
        console.log(this.$root.$data.user.following);
        for (let i = 0; i < response.data.length; ++i) {
          for (let j = 0; j < this.$root.$data.user.following.length; ++j) {
            if (this.$root.$data.user.following[j] == response.data[i].user.username) {
              this.photos.push(response.data[i]);
            }
          }
        }
      } catch (error) {
        this.error = error.response.data.message;
      }

    },
  }
}
</script>

<style>

.home {
  min-height: 780px;
}
.top-margin {
  width: 100%;
  height: 50px;
}

</style>
