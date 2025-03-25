<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="6" :offset="8">
        <el-input placeholder="身份码" tabindex="2" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="8" :offset="8">
        <el-button type="primary" style="width: 100%; margin-bottom: 30px"
          >验证</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getToken } from "@/utils/auth.js";

export default {
  name: "Login",
  computed: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("不能少于 6 位数字"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() {
    this.loginForm.password = getToken();
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    FUck() {
      console.log("1");
    },
    DoLogin() {
      this.$router.push({ path: this.redirect || "/" });
      return;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then((data) => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((data) => {
              console.log(data);
              var error_msg = "出现未知错误！登陆失败";
              if ("error_msg" in data) {
                error_msg = data["error_msg"];
              }
              this.$message({ message: error_msg, type: "error" });
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #2d3a4b;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  padding-top: 20%;
}
</style>

<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background: #2d3a4b;
}
</style>
