<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="服务器地址">
          <el-input
            v-model="outbound_obj.address"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="服务器端口">
          <el-input v-model="outbound_obj.port" placeholder="必填"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="账号">
          <el-select v-model="outbound_obj.network">
            <el-option
              v-for="item in ['tcp', 'udp']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

export default {
  name: "dns",
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
