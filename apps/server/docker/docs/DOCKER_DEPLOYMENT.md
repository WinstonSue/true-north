# Life Toolkit Server - Docker 部署指南

## 🚀 概述

本指南介绍如何使用 Life Toolkit Server 的 Docker 部署功能，包括本地构建、镜像保存和服务端部署。

## 📋 功能特性

- 🔨 本地构建生产镜像
- 💾 保存镜像为文件 (支持压缩)
- 🚀 本地运行容器
- 📦 容器状态保存
- 🌐 服务端镜像加载和部署
- 🛠️ 灵活的配置选项

## 📜 脚本功能总览

| 脚本名称                 | 主要功能                     | 使用场景         |
| ------------------------ | ---------------------------- | ---------------- |
| `run-docker-prod.sh`     | 构建镜像、保存镜像、运行容器 | 本地开发和构建   |
| `load-and-run-docker.sh` | 保存运行中的容器为镜像文件   | 保存容器当前状态 |
| `load-image-and-run.sh`  | 加载镜像文件并运行容器       | 服务端部署       |

## 🛠️ 使用方法

### 1. 本地构建和运行 (`run-docker-prod.sh`)

#### 基本使用

```bash
# 进入服务端目录
cd apps/server

# 运行脚本
./run-docker-prod.sh
```

#### 操作模式

脚本提供三种操作模式：

1. **运行容器 (默认)** - 构建镜像并运行容器
2. **仅构建并保存镜像** - 构建镜像并保存为文件
3. **构建、保存镜像并运行容器** - 完整流程

#### 输出文件

保存的镜像文件位于 `docker-images/` 目录：

```
docker-images/
└── true-north-server_production_YYYYMMDD_HHMMSS.tar.gz
```

### 2. 容器保存 (`load-and-run-docker.sh`)

#### 基本使用

```bash
# 保存运行中的容器为镜像文件
./load-and-run-docker.sh container_id_or_name

# 保存指定容器
./load-and-run-docker.sh true-north-server-prod
```

#### 高级选项

```bash
# 自定义镜像标签和输出文件
./load-and-run-docker.sh container_id -t my-app:v1.0 -o /path/to/save.tar

# 指定目标架构 (默认: linux/amd64)
./load-and-run-docker.sh container_id -a linux/amd64

# 构建 ARM64 架构镜像
./load-and-run-docker.sh container_id -a linux/arm64

# 跳过架构检查和转换
./load-and-run-docker.sh container_id --no-arch-check

# 不压缩保存
./load-and-run-docker.sh container_id --no-compress

# 查看帮助
./load-and-run-docker.sh -h
```

### 3. 镜像加载和运行 (`load-image-and-run.sh`)

#### 基本使用

```bash
# 上传镜像文件到服务端
scp docker-images/true-north-server_production_*.tar.gz user@server:/path/to/server/

# 在服务端运行部署脚本
./load-image-and-run.sh true-north-server_production_*.tar.gz
```

#### 高级选项

```bash
# 自定义端口和容器名称
./load-image-and-run.sh image.tar.gz -p 8080 -n my-server

# 使用自定义环境文件
./load-image-and-run.sh image.tar.gz -e .env.custom

# 指定镜像标签
./load-image-and-run.sh image.tar.gz -t true-north-server:v1.0

# 查看帮助
./load-image-and-run.sh -h
```

## 🏗️ 跨平台架构支持

### 架构转换功能

脚本支持自动检测和转换容器架构，确保生成的镜像可以在目标平台上运行：

- **默认架构**: `linux/amd64` (适用于大多数 Linux 服务器)
- **支持架构**: `linux/amd64`, `linux/arm64`, `linux/arm/v7` 等
- **自动转换**: 检测当前架构，自动转换为目标架构
- **跨平台部署**: 从 macOS (ARM64) 部署到 Linux (AMD64) 服务器

### 使用场景

1. **macOS → Linux 服务器**:

   ```bash
   # 在 macOS 上保存容器为 linux/amd64 镜像
   ./load-and-run-docker.sh container_id -a linux/amd64
   ```

2. **开发环境 → 生产环境**:

   ```bash
   # 确保生产环境兼容性
   ./load-and-run-docker.sh container_id -a linux/amd64
   ```

3. **ARM 服务器部署**:
   ```bash
   # 为 ARM 服务器构建镜像
   ./load-and-run-docker.sh container_id -a linux/arm64
   ```

### 技术实现

- **Docker Buildx**: 优先使用 buildx 进行多架构构建
- **传统构建**: 当 buildx 不可用时，使用传统 docker build
- **架构检测**: 自动检测当前镜像架构
- **智能转换**: 仅在架构不匹配时进行转换

## 🔧 环境配置

### 环境变量文件

创建 `.env.production.local` 文件：

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-production-username
DB_PASSWORD=your-production-password
DB_DATABASE=life_toolkit
JWT_SECRET=your-production-jwt-secret
```

### 数据库配置

确保数据库服务器已启动并可访问：

- MySQL/MariaDB (推荐生产环境)
- SQLite (开发环境)

## 📝 完整部署流程

### 步骤 1: 本地构建和保存

```bash
cd apps/server

# 确保应用已构建
pnpm build

# 运行构建脚本，选择模式 2 (仅构建并保存镜像)
./run-docker-prod.sh
# 选择: 2) 仅构建并保存镜像
```

### 步骤 2: 保存运行中的容器 (可选)

如果您想保存当前运行中的容器状态：

```bash
# 保存运行中的容器
./load-and-run-docker.sh true-north-server-prod

# 或者保存为特定标签
./load-and-run-docker.sh true-north-server-prod -t my-app:latest
```

### 步骤 3: 上传到服务端

```bash
# 上传镜像文件
scp docker-images/true-north-server_production_*.tar.gz user@server:/opt/life-toolkit/

# 上传环境配置文件
scp .env.production.local user@server:/opt/life-toolkit/

# 上传部署脚本
scp load-image-and-run.sh user@server:/opt/life-toolkit/
```

### 步骤 4: 服务端部署

```bash
# SSH 登录服务端
ssh user@server

# 进入部署目录
cd /opt/life-toolkit

# 运行部署脚本
./load-image-and-run.sh true-north-server_production_*.tar.gz
```

## 🐳 Docker Compose 部署 (推荐)

### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  true-north-server:
    image: true-north-server:production
    container_name: true-north-server-prod
    ports:
      - '3000:3000'
    env_file:
      - .env.production.local
    restart: unless-stopped
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    container_name: life-toolkit-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

### 使用 Docker Compose

```bash
# 加载镜像
docker load -i true-north-server_production_*.tar.gz

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 🔍 故障排除

### 常见问题

1. **镜像构建失败**

   ```bash
   # 检查 dist 目录是否存在
   ls -la dist/

   # 重新构建应用
   pnpm build
   ```

2. **容器启动失败**

   ```bash
   # 查看容器日志
   docker logs true-north-server-prod

   # 检查环境变量
   docker exec true-north-server-prod env
   ```

3. **数据库连接失败**

   ```bash
   # 检查数据库服务状态
   docker ps | grep mysql

   # 测试数据库连接
   mysql -h DB_HOST -u DB_USERNAME -p
   ```

### 日志查看

```bash
# 实时查看日志
docker logs -f true-north-server-prod

# 查看最近的日志
docker logs --tail 100 true-north-server-prod

# 查看特定时间的日志
docker logs --since "2024-01-01T00:00:00" true-north-server-prod
```

## 📊 监控和维护

### 容器管理

```bash
# 查看容器状态
docker ps | grep life-toolkit

# 重启容器
docker restart true-north-server-prod

# 更新容器
docker stop true-north-server-prod
docker rm true-north-server-prod
# 重新运行 load-and-run-docker.sh
```

### 资源监控

```bash
# 查看容器资源使用
docker stats true-north-server-prod

# 查看镜像大小
docker images | grep true-north-server
```

## 🔐 安全建议

1. **环境变量安全**
   - 使用强密码
   - 定期更换 JWT 密钥
   - 不要在代码中硬编码敏感信息

2. **网络安全**
   - 使用防火墙限制端口访问
   - 考虑使用 HTTPS
   - 定期更新 Docker 镜像

3. **数据备份**
   - 定期备份数据库
   - 备份环境配置文件
   - 保存镜像文件的多个版本

## 📚 参考资料

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [NestJS 部署指南](https://docs.nestjs.com/techniques/deployment)
- [Life Toolkit 项目文档](../../README.md)
