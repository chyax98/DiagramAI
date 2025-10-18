# PM2 部署指南

> DiagramAI 使用 PM2 进行生产环境部署和进程管理

---

## 📦 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 验证安装
pm2 --version
```

---

## 🔧 配置文件

项目已包含 `ecosystem.config.cjs` (使用 `.cjs` 扩展名因为项目是 ES Module 模式):

```javascript
module.exports = {
  apps: [
    {
      name: "diagramai",
      script: "npm",
      args: "start",
      cwd: "/root/Diagram/DiagramAI",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",

      // 环境变量
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // 日志配置
      error_file: "/root/Diagram/DiagramAI/logs/pm2-error.log",
      out_file: "/root/Diagram/DiagramAI/logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // 进程管理优化
      min_uptime: "10s", // 最小运行时间，避免频繁重启
      max_restarts: 10, // 最大重启次数
      restart_delay: 4000, // 重启延迟 (毫秒)

      // 崩溃后自动重启
      exp_backoff_restart_delay: 100, // 指数退避重启延迟

      // 优雅关闭
      kill_timeout: 5000, // 强制关闭前等待时间
      wait_ready: true, // 等待应用 ready 信号
      listen_timeout: 10000, // 等待端口监听超时

      // 时间相关
      cron_restart: "0 4 * * *", // 每天凌晨 4 点自动重启 (可选)
    },
  ],
};
```

**配置说明**:

- `name`: PM2 进程名称
- `script`: 使用 `npm` 启动 (更稳定)
- `args`: 启动参数 (`start` = 生产模式)
- `cwd`: 项目根目录路径
- `instances`: 实例数量 (1 = 单实例, 'max' = CPU 核心数)
- `max_memory_restart`: 内存限制 (超过后自动重启)
- `PORT`: 应用端口 (默认 3000)
- `cron_restart`: 定时重启 (凌晨 4 点,可根据需要调整)

---

## 🚀 部署流程

### 1. 构建项目

```bash
cd /root/Diagram/DiagramAI

# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 2. 创建日志目录

```bash
mkdir -p logs
```

### 3. 启动应用

```bash
# 使用配置文件启动
pm2 start ecosystem.config.cjs

# 或直接启动 (不推荐)
pm2 start npm --name "diagramai" -- start
```

### 4. 验证运行状态

```bash
# 查看进程列表
pm2 list

# 查看详细信息
pm2 show diagramai

# 实时日志
pm2 logs diagramai
```

---

## 📋 常用命令

```bash
# 进程管理
pm2 start ecosystem.config.cjs    # 启动应用
pm2 stop diagramai                 # 停止应用
pm2 restart diagramai              # 重启应用
pm2 reload diagramai               # 0 秒停机重载 (cluster 模式)
pm2 delete diagramai               # 删除进程

# 监控
pm2 list                           # 进程列表
pm2 monit                          # 实时监控面板
pm2 logs diagramai                 # 查看日志
pm2 logs diagramai --lines 100     # 查看最近 100 行
pm2 flush                          # 清空日志

# 保存与恢复
pm2 save                           # 保存当前进程列表
pm2 resurrect                      # 恢复已保存的进程
pm2 startup                        # 生成开机自启动脚本
```

---

## 🔄 更新部署流程

```bash
# 1. 停止应用
pm2 stop diagramai

# 2. 拉取最新代码
git pull

# 3. 安装依赖
npm install

# 4. 重新构建
npm run build

# 5. 启动应用
pm2 restart diagramai

# 6. 查看日志确认
pm2 logs diagramai --lines 50
```

**零停机更新** (cluster 模式):

```bash
# 直接 reload (无需手动 stop)
git pull && npm install && npm run build && pm2 reload diagramai
```

---

## 🌐 Nginx 反向代理配置

在宝塔面板添加站点后,修改 Nginx 配置:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**验证流程**:

1. 本地端口测试: `curl http://localhost:3000`
2. DNS 验证: `nslookup your-domain.com`
3. HTTPS 访问: `https://your-domain.com`

---

## 🔧 环境变量配置

确保 `.env.local` 文件存在且包含必要配置:

```bash
# JWT 密钥 (必需, 64+ 字符)
JWT_SECRET=your-secure-jwt-secret-key-min-64-chars

# Kroki 配置
NEXT_PUBLIC_KROKI_URL=/api/kroki
KROKI_INTERNAL_URL=https://kroki.chyax.site

# 其他可选配置
BCRYPT_SALT_ROUNDS=12
AI_TEMPERATURE=0.7
ENABLE_FAILURE_LOGGING=true
```

**安全提示**:

- 生产环境 `JWT_SECRET` 必须使用强密钥
- 不要将 `.env.local` 提交到 Git
- `BCRYPT_SALT_ROUNDS` 建议设为 12

---

## 📊 性能优化建议

### 1. 多实例部署 (4 核 CPU)

```javascript
// ecosystem.config.cjs
{
  instances: 2,  // 使用 2 个实例 (不超过 CPU 核心数)
  exec_mode: 'cluster',
}
```

### 2. 内存限制

```javascript
{
  max_memory_restart: '1G',  // 8GB 内存服务器建议 1-2G
}
```

### 3. 日志轮转

```bash
# 安装 pm2-logrotate
pm2 install pm2-logrotate

# 配置日志大小限制 (10MB)
pm2 set pm2-logrotate:max_size 10M

# 保留最近 7 个日志文件
pm2 set pm2-logrotate:retain 7
```

---

## 🚨 故障排查

### 应用无法启动

```bash
# 1. 查看错误日志
pm2 logs diagramai --err --lines 50

# 2. 检查构建是否成功
ls -lh .next/

# 3. 验证依赖安装
npm list next react react-dom

# 4. 检查端口占用
lsof -i :3000
```

### 内存泄漏

```bash
# 监控内存使用
pm2 monit

# 自动重启策略已配置
max_memory_restart: '1G'
```

### 日志文件过大

```bash
# 清空日志
pm2 flush

# 安装日志轮转 (见上文)
pm2 install pm2-logrotate
```

---

## 🔐 开机自启动

```bash
# 1. 生成启动脚本 (根据系统自动选择 systemd/upstart/launchd)
pm2 startup

# 2. 执行输出的命令 (示例)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# 3. 保存当前进程列表
pm2 save

# 4. 测试重启
sudo reboot

# 5. 重启后验证
pm2 list
```

---

## ✅ 部署检查清单

- [ ] PM2 已全局安装
- [ ] 项目已构建 (`npm run build`)
- [ ] `.env.local` 配置完整
- [ ] `logs/` 目录已创建
- [ ] `ecosystem.config.cjs` 已配置
- [ ] PM2 进程已启动 (`pm2 list`)
- [ ] 本地端口可访问 (`curl localhost:3000`)
- [ ] Nginx 反向代理已配置
- [ ] DNS 解析已生效
- [ ] HTTPS 证书已申请
- [ ] 开机自启动已配置 (`pm2 startup`)
- [ ] 日志轮转已配置 (`pm2-logrotate`)

---

## 📚 参考资源

- PM2 官方文档: https://pm2.keymetrics.io/docs/usage/quick-start/
- Next.js 部署文档: https://nextjs.org/docs/deployment
- 宝塔面板: https://www.bt.cn/

---

**DiagramAI - AI 驱动的专业图表生成工具**
