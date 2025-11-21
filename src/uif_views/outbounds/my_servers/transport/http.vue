<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="伪装路径">
          <el-input
            v-model="transport.httpSettings.path"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="方法">
          <el-input
            v-model="transport.httpSettings.method"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="自定义头">
            <b-ace-editor
              v-model="request_header"
              lang="json"
              width="100%"
              height="300"
            ></b-ace-editor>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "http",
  props: ["transport"],
  components: {},
  data() {
    return { request_header: "", host_str: "" };
  },
  beforeDestroy() {
    this.transport.httpSettings.headers = JSON.parse(this.request_header);
  },
  mounted() {
    this.request_header = JSON.stringify(
      this.transport.httpSettings.headers,
      null,
      2,
    );
  },
  computed: {},
  methods: {},
};
</script>
