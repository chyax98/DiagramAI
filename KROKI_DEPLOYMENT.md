# Kroki 部署指南

> DiagramAI 图表渲染服务完整部署方案

---

## 📋 概述

DiagramAI 使用 Kroki 作为图表渲染引擎。Kroki 支持 Mermaid、PlantUML、D2、Graphviz 等 23 种图表语言。

**部署架构:**

```
用户浏览器
    ↓ fetch(/api/kroki/...)
DiagramAI (Next.js)
    ↓ 代理请求
Kroki 服务 (Docker/公共服务)
    ↓
返回 SVG/PNG 图像
```

---

## 🎯 部署方案选择

### 方案对比

| 方案                    | 适用场景           | 优点                       | 缺点                             |
| ----------------------- | ------------------ | -------------------------- | -------------------------------- |
| **公共服务** (kroki.io) | 开发、测试、小流量 | 零维护、开箱即用           | 网络依赖、有限流、数据经过第三方 |
| **Docker 最小化**       | 生产环境、基础需求 | 轻量、快速部署、数据私有   | 支持图表类型有限                 |
| **Docker 完整版**       | 生产环境、全功能   | 支持所有图表类型、完整功能 | 资源占用较多 (~2GB 内存)         |

### 推荐方案

- **开发/测试**: 使用公共服务 (kroki.io)
- **生产环境 (个人/小团队)**: Docker 最小化部署
- **生产环境 (企业/高需求)**: Docker 完整部署

---

## 🚀 方案一: 使用公共服务 (默认)

### 配置方式

在 `.env.local` 中配置:

```bash
# 客户端通过 Next.js 代理访问
NEXT_PUBLIC_KROKI_URL=/api/kroki

# 服务端访问公共 Kroki 服务
KROKI_INTERNAL_URL=https://kroki.io
```

### 优点

- ✅ 无需部署,开箱即用
- ✅ 零维护成本
- ✅ 适合快速开始

### 缺点

- ❌ 依赖外部服务稳定性
- ❌ 有请求频率限制
- ❌ 数据经过第三方服务器
- ❌ 受网络环境影响

### 适用场景

- 本地开发调试
- 功能测试验证
- 小流量个人项目

---

## 🐳 方案二: Docker 最小化部署

### 1. 前置要求

- Docker 已安装
- 至少 512MB 可用内存
- 服务器可访问 Docker Hub

### 2. 安装 Docker (如未安装)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 重新登录使配置生效
```

### 3. 启动 Kroki 服务

```bash
docker run -d \
  --name kroki \
  --restart unless-stopped \
  -p 8000:8000 \
  yuzutech/kroki:latest
```

### 4. 验证服务

```bash
# 测试健康检查
curl http://localhost:8000/health
# 应返回: {"status":"pass"}

# 测试 Mermaid 渲染
curl -X POST http://localhost:8000/mermaid/svg \
  -H "Content-Type: text/plain" \
  -d "graph TD; A-->B" \
  > test.svg

# 查看生成的 SVG
cat test.svg
```

### 5. 配置 DiagramAI

在 `.env.local` 中配置:

```bash
# 客户端通过代理访问
NEXT_PUBLIC_KROKI_URL=/api/kroki

# 服务端直接访问本地 Kroki
KROKI_INTERNAL_URL=http://localhost:8000
```

### 6. 管理命令

```bash
# 查看日志
docker logs kroki

# 查看状态
docker ps | grep kroki

# 重启服务
docker restart kroki

# 停止服务
docker stop kroki

# 删除容器
docker rm kroki

# 更新镜像
docker pull yuzutech/kroki:latest
docker stop kroki
docker rm kroki
# 重新运行启动命令
```

### 支持的图表类型

最小化部署支持:

- ✅ Mermaid (14 种图表)
- ✅ PlantUML (基础功能,8 种图表)
- ✅ Graphviz (5 种图表)
- ✅ D2 (6 种图表)
- ✅ Nomnoml (3 种图表)
- ✅ DBML (4 种图表)
- ✅ Erd (1 种图表)
- ✅ Pikchr (2 种图表)
- ✅ SvgBob (1 种图表)
- ✅ UMLet (3 种图表)

---

## 🔧 方案三: Docker 完整部署 (推荐生产环境)

### 1. 创建 Docker Compose 配置

创建 `docker-compose-kroki.yml`:

```yaml
version: "3.8"

services:
  # Kroki 主服务
  kroki:
    image: yuzutech/kroki:latest
    container_name: kroki
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      # 配置子服务连接
      - KROKI_BLOCKDIAG_HOST=blockdiag
      - KROKI_MERMAID_HOST=mermaid
      - KROKI_BPMN_HOST=bpmn
      - KROKI_EXCALIDRAW_HOST=excalidraw
    depends_on:
      - blockdiag
      - mermaid
      - bpmn
      - excalidraw
    networks:
      - kroki-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # BlockDiag 子服务 (支持 BlockDiag, SeqDiag, ActDiag, NwDiag, PacketDiag, RackDiag)
  blockdiag:
    image: yuzutech/kroki-blockdiag:latest
    container_name: kroki-blockdiag
    restart: unless-stopped
    networks:
      - kroki-network

  # Mermaid 子服务 (增强版 Mermaid 支持)
  mermaid:
    image: yuzutech/kroki-mermaid:latest
    container_name: kroki-mermaid
    restart: unless-stopped
    networks:
      - kroki-network

  # BPMN 子服务 (业务流程图)
  bpmn:
    image: yuzutech/kroki-bpmn:latest
    container_name: kroki-bpmn
    restart: unless-stopped
    networks:
      - kroki-network

  # Excalidraw 子服务 (手绘风格图表)
  excalidraw:
    image: yuzutech/kroki-excalidraw:latest
    container_name: kroki-excalidraw
    restart: unless-stopped
    networks:
      - kroki-network

networks:
  kroki-network:
    driver: bridge
```

### 2. 启动服务

```bash
# 启动所有服务
docker-compose -f docker-compose-kroki.yml up -d

# 查看服务状态
docker-compose -f docker-compose-kroki.yml ps

# 查看日志
docker-compose -f docker-compose-kroki.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose-kroki.yml logs -f kroki
```

### 3. 验证服务

```bash
# 测试主服务
curl http://localhost:8000/health

# 测试 Mermaid (使用增强版)
curl -X POST http://localhost:8000/mermaid/svg \
  -H "Content-Type: text/plain" \
  -d "graph TD; A-->B"

# 测试 BPMN
curl -X POST http://localhost:8000/bpmn/svg \
  -H "Content-Type: text/plain" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_1">
    <startEvent id="StartEvent_1"/>
  </process>
</definitions>'

# 测试 BlockDiag
curl -X POST http://localhost:8000/blockdiag/svg \
  -H "Content-Type: text/plain" \
  -d 'blockdiag {
  A -> B -> C;
}'
```

### 4. 配置 DiagramAI

与最小化部署相同:

```bash
NEXT_PUBLIC_KROKI_URL=/api/kroki
KROKI_INTERNAL_URL=http://localhost:8000
```

### 5. 管理命令

```bash
# 重启所有服务
docker-compose -f docker-compose-kroki.yml restart

# 停止所有服务
docker-compose -f docker-compose-kroki.yml stop

# 删除所有服务
docker-compose -f docker-compose-kroki.yml down

# 更新镜像并重启
docker-compose -f docker-compose-kroki.yml pull
docker-compose -f docker-compose-kroki.yml up -d
```

### 支持的图表类型

完整部署支持所有 23 种语言:

#### 主流语言 (10 种)

- ✅ **Mermaid** (增强版,14 种图表)
- ✅ **PlantUML** (完整功能,8 种图表)
- ✅ **D2** (6 种图表)
- ✅ **Graphviz** (5 种图表)
- ✅ **WaveDrom** (3 种图表)
- ✅ **Nomnoml** (3 种图表)
- ✅ **Excalidraw** (3 种图表)
- ✅ **C4-PlantUML** (4 种图表)
- ✅ **Vega-Lite** (6 种图表)
- ✅ **DBML** (4 种图表)

#### 专业扩展 (13 种)

- ✅ **BPMN** (业务流程建模)
- ✅ **Ditaa** (ASCII 艺术转图形)
- ✅ **NwDiag** (网络拓扑图)
- ✅ **BlockDiag** (块状流程图)
- ✅ **ActDiag** (活动图/泳道图)
- ✅ **PacketDiag** (网络数据包图)
- ✅ **RackDiag** (机柜图)
- ✅ **SeqDiag** (时序图)
- ✅ **Structurizr** (C4 架构建模 DSL)
- ✅ **Erd** (简洁 ER 图)
- ✅ **Pikchr** (图表脚本语言)
- ✅ **SvgBob** (ASCII 转 SVG)
- ✅ **UMLet** (轻量级 UML)

---

## 🌐 远程服务器部署

### 场景: DiagramAI 和 Kroki 在不同服务器

如果 Kroki 部署在单独的服务器 (如 `kroki.example.com`):

#### 1. Kroki 服务器配置

```bash
# 启动 Kroki (暴露到外网)
docker run -d \
  --name kroki \
  --restart unless-stopped \
  -p 8000:8000 \
  yuzutech/kroki:latest
```

**配置防火墙:**

```bash
# 允许 DiagramAI 服务器访问
sudo ufw allow from <diagramai-server-ip> to any port 8000

# 或使用 Nginx 代理并启用 HTTPS
```

#### 2. DiagramAI 服务器配置

在 `.env.local` 中:

```bash
NEXT_PUBLIC_KROKI_URL=/api/kroki
KROKI_INTERNAL_URL=http://kroki.example.com:8000

# 或使用 HTTPS
KROKI_INTERNAL_URL=https://kroki.example.com
```

#### 3. Nginx 反向代理 (推荐)

在 Kroki 服务器上配置 Nginx:

```nginx
# /etc/nginx/sites-available/kroki
server {
    listen 80;
    server_name kroki.example.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 增大超时时间 (复杂图表可能需要更长时间)
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

启用 HTTPS:

```bash
sudo certbot --nginx -d kroki.example.com
```

---

## 🔍 故障排查

### 问题 1: Kroki 容器无法启动

**检查步骤:**

```bash
# 查看容器日志
docker logs kroki

# 检查端口占用
sudo lsof -i :8000

# 检查 Docker 资源
docker stats
```

**常见原因:**

- **端口 8000 已被占用** → 更换端口或停止占用进程
- **内存不足** → 增加服务器内存或减少其他服务
- **Docker 网络问题** → 重启 Docker 服务

**解决方案:**

```bash
# 使用不同端口
docker run -d --name kroki -p 8080:8000 yuzutech/kroki:latest

# 更新 .env.local
KROKI_INTERNAL_URL=http://localhost:8080
```

### 问题 2: DiagramAI 无法连接 Kroki

**检查步骤:**

```bash
# 1. 测试 Kroki 服务是否正常
curl http://localhost:8000/health

# 2. 检查 DiagramAI 配置
cat .env.local | grep KROKI

# 3. 查看 DiagramAI 日志
pm2 logs diagramai | grep -i kroki

# 4. 测试网络连通性
telnet localhost 8000
```

**常见原因:**

- **KROKI_INTERNAL_URL 配置错误**
- **防火墙阻止连接**
- **Kroki 服务未启动**

**解决方案:**

```bash
# 确保 Kroki 正在运行
docker ps | grep kroki

# 重启 DiagramAI
pm2 restart diagramai
```

### 问题 3: 图表渲染失败

**检查步骤:**

```bash
# 1. 直接测试 Kroki 渲染
curl -X POST http://localhost:8000/mermaid/svg \
  -H "Content-Type: text/plain" \
  -d "graph TD; A-->B"

# 2. 检查图表代码语法
# 确保代码符合对应图表语言规范

# 3. 查看 Kroki 日志
docker logs kroki --tail 100
```

**常见原因:**

- **图表语法错误** → 检查代码语法
- **不支持的图表类型** (最小化部署)
- **超时** (复杂图表需要更长时间)

**解决方案:**

```bash
# 增加超时时间
# 在 .env.local 中:
NEXT_PUBLIC_KROKI_TIMEOUT=10000  # 10 秒
```

### 问题 4: 性能问题

**优化建议:**

1. **启用缓存**: DiagramAI 已实现 1 小时缓存
2. **增加资源**: 为 Docker 容器分配更多内存
3. **负载均衡**: 部署多个 Kroki 实例

```bash
# 查看 Docker 资源使用
docker stats kroki

# 限制容器资源
docker update --memory 2g --cpus 2 kroki
```

---

## 📊 性能和资源

### 资源占用

| 部署方案   | 内存占用 | 磁盘占用 | CPU 使用 |
| ---------- | -------- | -------- | -------- |
| 最小化部署 | ~200MB   | ~400MB   | 低       |
| 完整部署   | ~2GB     | ~2GB     | 中等     |

### 性能指标

- **简单图表 (Mermaid 流程图)**: < 200ms
- **中等复杂图表 (PlantUML 时序图)**: 200-500ms
- **复杂图表 (大型架构图)**: 500ms - 2s

### 扩展性

**水平扩展 (多实例):**

```yaml
# docker-compose-kroki.yml
services:
  kroki:
    image: yuzutech/kroki:latest
    deploy:
      replicas: 3 # 运行 3 个实例
    ports:
      - "8000-8002:8000"
```

**负载均衡 (Nginx):**

```nginx
upstream kroki_backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}

server {
    location / {
        proxy_pass http://kroki_backend;
    }
}
```

---

## 🔐 安全建议

### 1. 网络隔离

- ✅ Kroki 仅暴露给 DiagramAI 服务器
- ✅ 使用 Docker 内部网络
- ✅ 配置防火墙规则

```bash
# 仅允许本地访问
-p 127.0.0.1:8000:8000

# 或仅允许特定 IP
sudo ufw allow from <diagramai-ip> to any port 8000
```

### 2. HTTPS 加密

如果跨服务器通信,使用 HTTPS:

```bash
# 配置 Nginx + Let's Encrypt
sudo certbot --nginx -d kroki.example.com
```

### 3. 资源限制

防止单个请求消耗过多资源:

```yaml
services:
  kroki:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2"
```

---

## 📈 监控和日志

### Docker 日志

```bash
# 查看实时日志
docker logs -f kroki

# 查看最近 100 行
docker logs --tail 100 kroki

# 带时间戳
docker logs -t kroki
```

### 健康检查

```bash
# 自动健康检查
curl http://localhost:8000/health

# 定期检查脚本
cat > check-kroki.sh << 'EOF'
#!/bin/bash
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "Kroki is down, restarting..."
    docker restart kroki
fi
EOF

chmod +x check-kroki.sh

# 添加到 crontab (每 5 分钟检查)
*/5 * * * * /path/to/check-kroki.sh
```

---

## 🔄 更新和维护

### 更新 Kroki

```bash
# 最小化部署
docker pull yuzutech/kroki:latest
docker stop kroki
docker rm kroki
docker run -d --name kroki --restart unless-stopped -p 8000:8000 yuzutech/kroki:latest

# 完整部署
docker-compose -f docker-compose-kroki.yml pull
docker-compose -f docker-compose-kroki.yml up -d
```

### 备份配置

```bash
# 备份 Docker Compose 配置
cp docker-compose-kroki.yml docker-compose-kroki.yml.backup

# 导出 Docker 镜像 (离线部署)
docker save yuzutech/kroki:latest | gzip > kroki-latest.tar.gz

# 恢复镜像
docker load < kroki-latest.tar.gz
```

---

## 📚 相关文档

- **[README.md](README.md)** - 项目快速开始
- **[CLAUDE.md](CLAUDE.md)** - 系统架构详解
- **[env.example](env.example)** - 环境变量配置
- [Kroki 官方文档](https://kroki.io/)
- [Docker 官方文档](https://docs.docker.com/)

---

## 🆘 获取帮助

如果遇到问题:

1. 查看本文档的故障排查部分
2. 查看 [Kroki 官方文档](https://kroki.io/)
3. 提交 [GitHub Issue](https://github.com/chyax98/DiagramAI/issues)
4. 加入 [GitHub Discussions](https://github.com/chyax98/DiagramAI/discussions)

---

**版本**: 1.0.0
**最后更新**: 2025-10-11
**支持的图表语言**: 23 种
