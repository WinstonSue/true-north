#!/bin/bash

# Life Toolkit Server - 开发环境 Docker 脚本
# 使用 .env.development.local 环境变量构建镜像并在本地运行

set -e

echo "🚀 Life Toolkit Server - 开发环境 Docker"
echo "======================================="

# 检查前提条件
check_prerequisites() {
    echo "🔍 检查前提条件..."
    
    # 检查是否在正确的目录
    if [ ! -f "package.json" ] || [ ! -f "docker/config/Dockerfile" ]; then
        echo "❌ 请在 apps/server 目录下运行此脚本"
        echo "💡 当前目录: $(pwd)"
        echo "💡 正确路径: /path/to/life-toolkit/apps/server"
        exit 1
    fi
    
    # 检查 dist 目录
    if [ ! -d "dist" ]; then
        echo "❌ dist 目录不存在，请先构建应用："
        echo "   cd ../../ && pnpm build:server"
        exit 1
    fi
    
    # 检查环境变量文件
    if [ ! -f ".env.development.local" ]; then
        echo "❌ .env.development.local 文件不存在"
        echo "请创建此文件并配置以下变量:"
        echo "  NODE_ENV=development"
        echo "  PORT=3000"
        echo "  DB_HOST=host.docker.internal"
        echo "  DB_PORT=3306"
        echo "  DB_USERNAME=root"
        echo "  DB_PASSWORD=your_password"
        echo "  DB_DATABASE=life_toolkit"
        echo "  JWT_SECRET=your-jwt-secret"
        exit 1
    fi
    
    # 检查 Docker
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker 未运行，请启动 Docker"
        exit 1
    fi
    
    echo "✅ 前提条件检查通过"
}

# 构建开发镜像
build_image() {
    echo "🔨 构建开发环境镜像..."
    docker build -t true-north-server:dev -f docker/config/Dockerfile .
    echo "✅ 开发镜像构建完成"
}

# 运行开发容器
run_container() {
    echo "🧹 清理旧容器..."
    docker stop true-north-server-dev 2>/dev/null || true
    docker rm true-north-server-dev 2>/dev/null || true

    echo "🚀 启动开发环境容器..."
    
    # 获取宿主机 IP 地址（macOS 和 Linux 兼容）
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        HOST_IP="host.docker.internal"
    else
        # Linux
        HOST_IP=$(ip route show default | awk '/default/ {print $3}' | head -1)
        if [ -z "$HOST_IP" ]; then
            HOST_IP="172.17.0.1"  # Docker 默认网关
        fi
    fi
    
    echo "📡 使用数据库主机: $HOST_IP"
    
    docker run -d \
        --name true-north-server-dev \
        -p 3000:3000 \
        --add-host host.docker.internal:host-gateway \
        -e DB_HOST=$HOST_IP \
        --env-file .env.development.local \
        --restart unless-stopped \
        true-north-server:dev

    # 等待容器启动
    echo "⏳ 等待容器启动..."
    sleep 3

    # 检查容器状态
    if docker ps | grep -q "true-north-server-dev"; then
        echo "✅ 开发环境应用已启动！"
        echo "🌐 访问地址: http://localhost:3000"
        echo "💡 使用 .env.development.local 中的配置"
        echo ""
        echo "📊 容器状态:"
        docker ps --filter "name=true-north-server-dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "📋 有用的命令："
        echo "  查看日志: docker logs -f true-north-server-dev"
        echo "  停止应用: docker stop true-north-server-dev"
        echo "  删除容器: docker rm true-north-server-dev"
        echo "  进入容器: docker exec -it true-north-server-dev sh"
        echo ""
        echo "🔍 查看实时日志？(y/N): "
        read -r show_logs
        if [[ $show_logs =~ ^[Yy]$ ]]; then
            echo "📋 实时日志 (Ctrl+C 退出):"
            docker logs -f true-north-server-dev
        fi
    else
        echo "❌ 容器启动失败！"
        echo "📋 错误日志:"
        docker logs true-north-server-dev
        exit 1
    fi
}

# 主函数
main() {
    echo "📋 开发环境 Docker 部署步骤："
    echo "  1. 检查前提条件"
    echo "  2. 构建开发镜像"
    echo "  3. 运行开发容器"
    echo ""
    
    read -p "🤔 确认开始开发环境部署？(y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 0
    fi
    
    check_prerequisites
    build_image
    run_container
}

# 如果脚本被直接执行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 