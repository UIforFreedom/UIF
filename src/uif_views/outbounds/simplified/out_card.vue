<template>
  <div
    class="nodeItem"
    @click="ChangeProxy"
    :style="{
      background: isSelecting ? '#304156' : '',
    }"
  >
    <div
      class="card content"
      :style="{
        background: isSelecting ? '#ECF0F3' : '',
        borderColor: isSelecting ? '#304156' : '',
        borderWidth: isSelecting ? '2px' : '1px',
      }"
    >
      <div style="display: flex; justify-content: space-between">
        <span>{{ node["name"] }}</span>
        <span style="color: gray">{{ parseTag() }}</span>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-tag
            size="mini"
            class="tag"
            :type="node['type'] == 'URLTest' ? 'success' : ''"
          >
            {{ node["type"] }}
          </el-tag>

          <el-tag size="mini" class="tag" v-if="node['type'] != 'URLTest'">
            {{ node["udp"] ? "UDP" : "None" }}
          </el-tag>

          <el-tag
            size="mini"
            class="tag"
            v-if="node['type'] == 'URLTest'"
            type="success"
          >
            {{ $translator({ cn: "自动优选", en: "Auto" }) }}
          </el-tag>
        </div>

        <div
          :style="{ color: $delayColor(parseDelay()) }"
          @click="UpdateDelay($event)"
        >
          <i class="el-icon-loading" v-if="isTestingDelay"></i>
          <div v-else>
            {{ parseDelay() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tag {
  margin-right: 4px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
}

.card {
  /* background-color: #ffffff; */
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333333;
  transition: transform 0.2s ease-in-out;
}

.nodeItem {
  /* background-color: red; */
  display: flex;
  min-width: 114px;
  height: 90px;
  border-radius: 10px;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import uif_store from "@/store/uif/uif";

export default {
  name: "simple_out_card",
  props: ["node"],
  computed: {
    ...mapState(["uif"]),
    isTestingDelay() {
      return this.node.isTestingDelay;
    },
    isSelecting() {
      return this.node["name"] == this.uif.clashProxies.selecting;
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
      ClashChangeProxy: "uif/ClashChangeProxy",
    }),
    parseDelay() {
      if ("delay" in this.node) {
        return this.node["delay"];
      }
      return "-1";
    },
    parseTag() {
      var now = this.node["now"];
      if (now != undefined && now != null) {
        return now;
      }
      return "";
    },
    ChangeProxy() {
      this.uif.clashProxies.selecting = this.node["name"];
      this.ClashChangeProxy();
    },
    UpdateDelay(event) {
      event.stopPropagation(); // 阻止事件冒泡

      uif_store.actions.UpdateClashDelay(
        this.node,
        this.uif.config.urlTest.testURL,
      );
    },
  },
};
</script>
