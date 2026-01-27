<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="response.type">
          <el-select
            v-model="outbound_obj.response.type"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option key="none" label="none" value="none"> </el-option>
            <el-option key="http" label="http" value="http"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "vmess",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  mounted() {},
  computed: {},

  methods: {},
};
</script>
