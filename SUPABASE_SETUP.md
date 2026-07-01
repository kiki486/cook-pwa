# Supabase 双人同步设置

项目地址和 Publishable key 已保存至 `supabase-config.js`。Publishable key 可以出现在网页源码中；不要把 Secret key、service_role 或数据库密码写入项目。

## 1. 建立数据表

1. 打开 Supabase 项目。
2. 进入 `SQL Editor`。
3. 新建查询，粘贴并运行 `supabase-setup.sql` 的全部内容。

## 2. 创建两名用户

1. 进入 `Authentication → Users`。
2. 手动新增两个使用者账号。
3. 进入 Authentication 设置并关闭公开注册，确保只有这两个账号可以登录。

数据库策略只授权 `authenticated` 用户，匿名访问已被撤销。

## 3. 下一步

完成以上两步后，再把登录和实时同步代码接入 PWA。无需提供两个账号的密码；密码只在两台手机上由使用者本人输入。
