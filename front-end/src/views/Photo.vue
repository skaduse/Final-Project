<template>
  <div class='single-image'>
    <div class='header'>PhotoLink</div>
    <div class='top-margin'></div>
    <form>
      <input type="button" value="Head Back" onClick="javascript: history.go(-1)">
    </form><br>
    <div class="bigShot">
    <P class="photoTitle">{{photo[0].title}}</p>
    </div>
    <img :src="photo[0].path" />
    <div class="photoInfo">
      <p class="photoDescription">{{photo[0].description}}</p><br>
      <p class="photoName">{{photo[0].user.firstName}} {{photo[0].user.lastName}}</p>
    </div>
    <p class="photoDate">{{formatDate(photo[0].created)}}</p><br>
    <div v-if="showFollowButton">
      <form>
        <input type="button" value="Follow User" @click="followUser()">
      </form>
    </div>

    <div>
      <form v-if="showUnfollowButton">
        <input type="button" value="Unfollow User" @click="unfollow()">
      </form>
    </div>

    <div v-if="showDeleteButton">
      <form>
        <input type="button" value="Remove Post" @click="removePost()">
      </form><br>
    </div>

    <div v-if="user">
      <h3>Add a Comment</h3>
      <form>
        <textarea v-model="comment"></textarea>
      </form>
      <button @click="postComment()">Submit</button>
    </div>

      <h3>Comments</h3>
      <div class="comments" v-for="comment in comments" v-bind:key="comment._id">
        <p class="userComment">{{comment.comment}}<p>
        <p>- {{comment.user.username}}</p>
        <p>{{formatDate(comment.created)}}</p>
        <hr>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'SingleImage',
  data() {
    return {
      photo: [],
      error: '',
      comment: '',
      comments: [],
    }
  },
  async created() {
    await this.getPhoto();
    await this.getComments();
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
    showFollowButton() {
      if (this.$root.$data.user) {
        if (this.$root.$data.user.username == this.photo[0].user.username) {
          console.log(this.$root.$data.user.following.length);
          return false;
        }
        for (let i = 0; i < this.$root.$data.user.following.length; ++i) {
          if (this.$root.$data.user.following[i] == this.photo[0].user.username) {
            return false;
          }
        }
        return true;
      }
      else if (this.$root.$data.user) {
        for (let i = 0; i < this.$root.$data.user.following.length; ++i) {
          if (this.$root.$data.user.following[i] == this.photo[0].user.username) {
            return false;
          }
        }
        return true;
      }
      else {
        return true;
      }
    },
    showUnfollowButton() {
      if (this.$root.$data.user) {
        if (this.$root.$data.user.username == this.photo[0].user.username) {
          console.log(this.$root.$data.user.following.length);
          return false;
        }
        for (let i = 0; i < this.$root.$data.user.following.length; ++i) {
          if (this.$root.$data.user.following[i] == this.photo[0].user.username) {
            return true;
          }
        }
        return false;
      }
      else if (this.$root.$data.user) {
        for (let i = 0; i < this.$root.$data.user.following.length; ++i) {
          if (this.$root.$data.user.following[i] == this.photo[0].user.username) {
            return true;
          }
        }
        return false;
      }
      else {
        return false;
      }
    },
    showDeleteButton() {
      if (this.$root.$data.user) {
        if (this.$root.$data.user.username == this.photo[0].user.username) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    async getPhoto() {
      try {
        let response = await axios.get("/api/photos/single/" + this.$route.params.id);
        this.photo = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
      async postComment() {
        try {
        let upload = await axios.post("/api/comments/" + this.$route.params.id, {
          username: this.$root.$data.user.username,
          password: this.$root.$data.user.password,
          comment: this.comment,
        });
        this.addItem = upload.data;
        this.getComments();
      } catch(error) {
        console.log(error);
      }
    },
    async getComments() {
      try {
        let allComments = await axios.get("/api/comments/" + this.$route.params.id);
        this.comments = allComments.data;
      } catch(error) {
        console.log(error);
      }
      },
      async followUser() {
        try {
          let toFollow = await axios.get("/api/users/" + this.photo[0].user._id);

          toFollow.data.followers.push(this.$root.$data.user.username);
          this.$root.$data.user.following.push(toFollow.data.username);

          await axios.put("/api/users/" + this.$root.$data.user._id, {
            followers: this.$root.$data.user.followers,
            following: this.$root.$data.user.following
          });

          await axios.put("/api/users/" + toFollow.data._id, {
            followers: toFollow.data.followers,
            following: toFollow.data.following
          });
          return true;
        } catch (error) {
          console.log(error);
          console.log("Dumbass");
        }
      },
      async unfollow() {
        try {
          let removeFollow = await axios.get("/api/users/" + this.photo[0].user._id);

          let index = removeFollow.data.followers.indexOf(this.$root.$data.user.username);
          if (index > -1) {
            removeFollow.data.followers.splice(index, 1);
          }

          index = this.$root.$data.user.following.indexOf(removeFollow.data.username);
          if (index > -1) {
            this.$root.$data.user.following.splice(index, 1);
          }

          await axios.put("/api/users/" + this.$root.$data.user._id, {
            followers: this.$root.$data.user.followers,
            following: this.$root.$data.user.following
          });

          await axios.put("/api/users/" + removeFollow.data._id, {
            followers: removeFollow.data.followers,
            following: removeFollow.data.following
          });
          return true;
        } catch(error) {
          console.log(error);
        }
      },
      async removePost() {
        try {
          await axios.delete("/api/photos/" + this.photo[0]._id);
          history.go(-1);
          return true;
        } catch (error) {
          console.log(error);
        }
      }
  }
}
</script>

<style>
<style scoped>
.photoInfo {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.bigShot .photoTitle {
  font-size: 20px;
  margin-bottom: 5px;
}

.photoInfo p {
  margin: 0px;
}

.photoDate {
  font-size: 0.7em;
  font-weight: normal;
}

p {
  margin: 0px;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
  max-width: 500px;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
.top-margin {
  width: 100%;
  height: 50px;
}
img {
  max-width: 500px;
}
body {
  padding-bottom: 20px;
}
.userComment {
  font-size: 20px;
}
hr {
  width: 80%;
}
.header {
  height: 60px;
  padding-top: 20px;
  width: 100%;
  background-color: #0078e7;
  vertical-align: middle;
  color: white;
  font-size: 30px;

}
</style>
