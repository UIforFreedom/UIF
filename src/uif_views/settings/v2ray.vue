<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>程序设置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-tooltip :disabled="v2ray.save_config.is_disable_tips" placement="top">
              <div slot="content">自动更新</div>
              <el-form-item label="自动更新">
                <el-switch> </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>域名数据库设置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-tooltip :disabled="v2ray.save_config.is_disable_tips" placement="top">
              <div slot="content">自动更新</div>
              <el-form-item label="自动更新">
                <el-switch> </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      flush_frequen: "type_1",
    };
  },
  computed: {
    ...mapState(["v2ray"]),
  },
  created() {},
  methods: {},
};
</script>
