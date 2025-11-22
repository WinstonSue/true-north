#!/bin/bash

# Life Toolkit Server - 远程镜像构建脚本
# 构建 linux/amd64 镜像并保存为 tar.gz 文件

set -e

# 配置
IMAGE_NAME="true-north-server"
PROD_IMAGE_TAG="remote"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOCAL_IMAGE_FILE="${IMAGE_NAME}_${PROD_IMAGE_TAG}_amd64_${TIMESTAMP}.tar.gz"

echo "🔨 Life Toolkit Server - 远程镜像构建脚本"
echo "============================================="
echo "镜像名称: ${IMAGE_NAME}:${PROD_IMAGE_TAG}"
echo "镜像架构: linux/amd64"
echo "输出文件: ${LOCAL_IMAGE_FILE}"
echo ""

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
    
    # 检查 Docker 和 buildx
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker 未运行，请启动 Docker"
        exit 1
    fi
    
    if ! docker buildx version > /dev/null 2>&1; then
        echo "❌ Docker buildx 不可用，请确保 Docker Desktop 已启用 buildx"
        echo "💡 解决方案："
        echo "   1. 更新 Docker Desktop 到最新版本"
        echo "   2. 在 Docker Desktop 设置中启用 'Use Docker Compose V2'"
        echo "   3. 重启 Docker Desktop"
        exit 1
    fi
    
    echo "✅ 前提条件检查通过"
}

# 构建和保存 AMD64 镜像
build_and_save_image() {
    echo "🔨 构建 linux/amd64 生产镜像..."
    echo "⚠️  注意：跨架构构建可能需要较长时间，请耐心等待..."
    
    # 使用 buildx 构建 AMD64 镜像
    if docker buildx build \
        --platform linux/amd64 \
        -t ${IMAGE_NAME}:${PROD_IMAGE_TAG} \
        --load \
        -f docker/config/Dockerfile .; then
        echo "✅ 镜像构建成功"
    else
        echo "❌ 镜像构建失败"
        exit 1
    fi
    
    # 验证镜像架构
    BUILT_ARCH=$(docker inspect "${IMAGE_NAME}:${PROD_IMAGE_TAG}" --format '{{.Architecture}}' 2>/dev/null || echo "unknown")
    echo "📋 构建镜像架构: $BUILT_ARCH"
    
    if [ "$BUILT_ARCH" = "amd64" ]; then
        echo "✅ 架构验证通过"
    else
        echo "⚠️  架构验证失败，期望: amd64，实际: $BUILT_ARCH"
    fi
    
    echo "📦 保存镜像为 tar 文件..."
    # 创建保存目录
    mkdir -p docker/dist
    
    # 保存为 tar 文件
    TEMP_TAR="docker/dist/${LOCAL_IMAGE_FILE%.gz}"
    echo "  保存到: $TEMP_TAR"
    
    if docker save -o "$TEMP_TAR" ${IMAGE_NAME}:${PROD_IMAGE_TAG}; then
        echo "✅ 镜像保存成功"
        ls -lh "$TEMP_TAR"
    else
        echo "❌ 镜像保存失败"
        exit 1
    fi
    
    # 压缩文件
    echo "🗜️  压缩镜像文件..."
    if gzip "$TEMP_TAR"; then
        echo "✅ 文件压缩完成: docker/dist/${LOCAL_IMAGE_FILE}"
        ls -lh "docker/dist/${LOCAL_IMAGE_FILE}"
    else
        echo "❌ 文件压缩失败"
        exit 1
    fi
    
    # 清理本地镜像
    echo "🧹 清理本地镜像..."
    docker rmi ${IMAGE_NAME}:${PROD_IMAGE_TAG} 2>/dev/null || true
}

# 显示构建结果
show_result() {
    echo ""
    echo "🎉 镜像构建完成！"
    echo "📦 输出文件: docker/dist/${LOCAL_IMAGE_FILE}"
    echo "📋 文件信息:"
    ls -lh "docker/dist/${LOCAL_IMAGE_FILE}"
    echo ""
    echo "📋 下一步："
    echo "  使用 ./publish-remote.sh 将镜像部署到远程服务器"
    echo "  或者手动上传: scp docker/dist/${LOCAL_IMAGE_FILE} user@server:/path/"
    echo ""
}

# 主函数
main() {
    echo "📋 构建步骤："
    echo "  1. 检查前提条件"
    echo "  2. 构建 linux/amd64 镜像"
    echo "  3. 保存并压缩镜像"
    echo "  4. 清理本地镜像"
    echo ""
    echo "⚠️  注意：此脚本将构建跨架构镜像，可能需要较长时间"
    echo ""
    
    read -p "🤔 确认开始构建？(y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "❌ 构建已取消"
        exit 0
    fi
    
    check_prerequisites
    build_and_save_image
    show_result
}

# 如果脚本被直接执行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 