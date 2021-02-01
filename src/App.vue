<template>
  <div class="dist">
    <div>
      <amplify-authenticator>
        <amplify-sign-out></amplify-sign-out>
      </amplify-authenticator>

      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="#">vue amplify</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <!-- <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input> -->
              <b-button class="btn btn-light btn-sm" type="submit"
                >Refresh</b-button
              >

              <div v-if="authState === 'signedin' && user">
                <div>Hello, {{ user.username }}</div>
              </div>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <!--     <amplify-chatbot
      bot-name="yourBotName"
      bot-title="My ChatBot"
      welcome-message="Hello, how can I help you?"
    /> -->

    <div style="margin: 0px 10px 10px 10px">
      <b-input-group prepend="Heading" class="mt-3">
        <b-form-input v-model="iHeading"></b-form-input>
      </b-input-group>
    </div>
    <div style="margin: 0px 10px 10px 10px">
      <b-input-group prepend="Detail" class="mt-3">
        <b-form-input v-model="iDetail"></b-form-input>
      </b-input-group>
    </div>
    <div style="margin: 0px 10px 10px 10px">
      <b-input-group prepend="identifier nr" class="mt-3">
        <b-form-input v-model="iIdent"></b-form-input>
      </b-input-group>
    </div>

    <div style="margin: 0px 10px 10px 10px">
      <b-button block variant="primary" @click="createTopic"
        >Create Topic</b-button
      >

      <b-button block variant="outline-primary" @click="queryTopics"
        >QueryTopic</b-button
      >

      <div class="dist"></div>

      <b-button block variant="danger" @click="deleteAll">Delete all </b-button>
    </div>

    <div style="margin: 0px 10px 0px 10px" v-if="topicCounter">
      <b-alert show variant="dark" v-html="topicCounter"></b-alert>
    </div>

    <div style="margin: 0px 10px 0px 10px">
      <b-card no-body class="mb-2" v-for="item in topics" v-bind:key="item.id">
        <!-- getstates -->

        <div class="remove">
          <button class="button" @click="deleteTopic(item)">Delete</button>
        </div>

        <div style="margin: 0px 10px 10px 10px">
          <h6>{{ item.heading }}</h6>

          <small>{{ item.detail }} - </small>
          <small>{{ item.identifier }} </small>
          <div class="dist"></div>

          <b-card-text class="small text-muted">{{ item.id }}</b-card-text>
        </div>
      </b-card>

      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ topics }}</pre>
      </b-card>
    </div>

    <b-modal ref="my-modal" hide-footer title="Info">
      <div class="d-block text-center">
        <h3>item deleted !</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Topics } from "./models";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

export default {
  name: "App",
  data: () => ({
    topics: [],
    newTopic: [],
    user: {},
    topicCounter: 0,

    authState: undefined,

    iHeading: null,
    iDetail: null,
    iIdent: null,
  }),

  components: {},

  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });

    //Subscribe to changes
    this.subscription = DataStore.observe(Topics).subscribe((msg) => {
      console.log("Model: ", msg.model, msg.opType, msg.element);
    });
  },

  methods: {
    async createTopic() {
      if (!this.iHeading || !this.iDetail) return;

      this.newTopic = new Topics({
        heading: this.iHeading,
        detail: this.iDetail,
        identifier: parseInt(this.iIdent),
      });

      await DataStore.save(
        // new Topics(this.newTopic)

        this.newTopic

        /*         new Topics({
          heading: this.iHeading,
          detail: this.iDetail,
          identifier: parseInt(this.iIdent),
        }) */
      );

      this.topics.push({
        heading: this.iHeading,
        detail: this.iDetail,
        identifier: parseInt(this.iIdent),
      });

      this.iHeading = "";
      this.iDetail = "";
      this.iIdent = 0;
    },

    async queryTopics() {
      const models = await DataStore.query(Topics);

      this.topics = models;

      console.log("Query models: ", models);

      this.topicCounter = Object.keys(this.topics).length;
    },

    async deleteAll() {
      await DataStore.delete(Topics, Predicates.ALL);
    },

    async deleteTopic(item) {
      const { id } = item;

      await DataStore.delete(Topics, (topic) => topic.id("eq", id));
      console.log("Item deleted! ");
      this.topics = this.topics.filter((r) => r.id != item.id);
      this.showModal();
    },

    showModal() {
      this.$refs["my-modal"].show();
    },
  },

  mounted: function () {

   this.queryTopics(); 


    /*    this.newTopic = {
           heading: window.prompt("heading"),
           detail: window.prompt("detail"),
           identifier: 1020

         } */
  },
};
</script>

<style lang="scss">
.myapp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.remove {
  top: 20px;
  right: 20px;
  position: relative;
  align-self: flex-end;
}
.remove button {
  background-color: #dd3f5b;
  color: white;
  border-radius: 25px;
  border: 0px;
}

.dist {
  margin-bottom: 10px;
}
</style>
