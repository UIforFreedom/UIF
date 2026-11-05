<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="domainStrategy">
          <el-select
            v-model="outbound_obj.domainStrategy"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['AsIs', 'UseIP', 'UseIPv4', 'UseIPv6']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="redirect">
          <el-input
            v-model="outbound_obj.redirect"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="userLevel">
          <el-input
            v-model="outbound_obj.userLevel"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "freedom",
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
