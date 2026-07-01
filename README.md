# 朝夕食事 PWA

当前版本已经包含：首页、点单、采购、食谱、菜品管理、搜索、菜品选择/移除、生成采购清单、食材完成状态、按钮抖动、本地保存、离线缓存和 PWA 安装清单。

## 本地预览

不能直接双击 `index.html`，需要使用本地服务器：

```powershell
python -m http.server 4173
```

然后打开 `http://localhost:4173`。

## 发布与手机安装

将整个 `cook-pwa` 文件夹部署到支持 HTTPS 的静态托管服务。Android 使用 Chrome 的“安装应用”；iPhone 使用 Safari 的“分享 → 添加到主屏幕 → 作为网页 App 打开”。

## 当前数据范围

菜品、今日菜单和采购状态保存在当前设备的 `localStorage`，刷新页面不会丢失。两台手机实时共享数据需要接入 Supabase（或其他云数据库）后才会生效，不能只依靠 PWA 离线缓存。

建议云端数据表：`households`、`members`、`dishes`、`dish_ingredients`、`meal_plans`、`meal_plan_items`、`shopping_items`。只允许两个受邀账号访问同一个 `household_id`，并对所有表启用行级权限。

## 素材

首页当前使用 `assets/home2.png`，设置按钮位于点单页搜索框右侧。菜品管理支持新增和删除，新增菜品可填写食材及烹饪步骤。
