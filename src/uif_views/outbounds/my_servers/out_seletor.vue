<template>
  <el-cascader
    filterable
    @focus="UpdateOutOptions"
    :placeholder="placeholder"
    v-model="outbound.id"
    :options="UpdateOutOptions()"
  ></el-cascader>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "out_seletor",
  props: ["outbound", "isDetour", "placeholder"],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({}),
    CheckLoop(input) {
      // todo
    },
    UpdateOutOptions() {
      var res = [];
      if (!this.isDetour) {
        res.push({ label: "直连", value: "freedom" });
        res.push({ label: "屏蔽", value: "block" });
        res.push({ label: "代理", value: "proxy" });
      }
      var custom = {
        label: "自添加",
        value: "自添加",
        children: [],
      };
      var sub = {
        label: "订阅",
        value: "订阅",
        children: [],
      };
      res.push(custom);
      res.push(sub);

      for (var i in this.config.config.outbounds) {
        i = this.config.config.outbounds[i];
        if (!i["enabled"]) {
          continue;
        }
        if (!("id" in i)) {
          i["id"] = uuidv4();
        }
        custom["children"].push({ value: i["id"], label: i["tag"] });
      }

      for (var i in this.config.config.subscribe) {
        i = this.config.config.subscribe[i];
        if (!("id" in i)) {
          i["id"] = uuidv4();
        }
        var subOut = [];
        for (var j in i["outbounds"]) {
          j = i["outbounds"][j];
          if (!j["enabled"]) {
            continue;
          }
          if (!("id" in j)) {
            j["id"] = uuidv4();
          }
          subOut.push({ value: j["id"], label: j["tag"] });
        }
        sub["children"].push({
          value: i["id"],
          label: i["tag"],
          children: subOut,
        });
      }
      return res;
    },
  },
};
</script>

<style></style>
