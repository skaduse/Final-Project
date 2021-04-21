<template>
<div class="main">
  <h1>{{user.username}}</h1>
  <p>Followers: {{user.followers.length}}</p>
  <p>Following: {{user.following.length}}</p>
  <div class="menu">
    <h2><a @click="toggleUpload"><i class="fas fa-image"></i> Post</a></h2>
    <h2><a @click="logout">Logout <i class="fas fa-sign-out-alt"></i></a></h2>
    <PhotoUploader :show="show" @close="close" @uploadFinished="uploadFinished" />
  </div>
  <GlobalUploads :photos="photos" />
  <p v-if="error">{{error}}</p>
</div>
</template>

<script>
import axios from 'axios';
import PhotoUploader from '@/components/PhotoUploader.vue';
import GlobalUploads from '@/components/GlobalUploads.vue';
export default {
  name: 'MyPhotos',
  components: {
    PhotoUploader,
    GlobalUploads
  },
  data() {
    return {
      show: false,
      photos: [],
      error: '',
    }
  },
  created() {
    this.getPhotos();
  },
  computed: {
    user() {
      console.log(this.$root.$data.user.username);
      return this.$root.$data.user;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async getPhotos() {
      try {
        this.response = await axios.get("/api/photos");
        this.photos = this.response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    close() {
      this.show = false;
    },
    toggleUpload() {
      this.show = true;
    },
    async uploadFinished() {
      this.show = false;
      this.getPhotos();
    },
  }
}
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
}

.menu h2 {
  font-size: 14px;
}

.main {
  width: 80%;
  margin-left: 10%;
}
</style>
