> 写作规范。技术实现引用 [TechnicalWiki](../TechnicalWiki.md) 与 [TDD-guide](./TDD-guide.md)。

# True North 技术开发文档规范

## 📋 适用场景
当需要编写面向AI的技术开发文档时，遵循此规范确保文档结构化、可解析、可执行。开发文档专注于提供明确的技术实现指导、可执行的代码生成指令和标准化的开发流程。

## 🎯 开发文档核心职责
- **技术架构**: 系统设计、模块划分、技术选型
- **代码生成**: AI执行指令、代码模板、生成规范
- **开发流程**: 环境搭建、编码规范、部署流程

## 🤖 设计原则

### 核心原则
1. **结构化数据**: 使用标准化的技术规范格式
2. **可执行指令**: 提供AI可直接执行的开发任务
3. **代码模板**: 标准化的代码生成模板
4. **技术约束**: 明确的技术栈和架构约束
5. **自动化优先**: 支持自动化生成和验证

### 文档质量标准
- **准确性**: 文档必须反映代码/系统的实际状态
- **可解析性**: 使用机器可读的格式和标准
- **可执行性**: 提供可直接执行的指令和脚本
- **一致性**: 遵循统一的命名和格式规范

## 🏗️ 核心文档结构

### 一、文档元信息 (必填)
```yaml
# 使用YAML格式提供结构化元数据
document_meta:
  title: "技术开发文档"
  version: "v1.0.0"
  status: "draft|review|approved"
  created_date: "2024-01-01"
  last_updated: "2024-01-01"
  owner: "开发者"
  target_audience: ["backend_developer", "frontend_developer"]
  
# 技术栈信息
tech_stack:
  backend:
    framework: "Electron + TypeORM"
    language: "TypeScript"
    database: "SQLite"
    orm: "TypeORM"
    auth: "JWT + bcrypt"
  frontend:
    framework: "React 18"
    language: "TypeScript"
    build_tool: "Vite"
    ui_library: ["@sue/design-web-react"]
    state_management: "Redux + Nanostores"
  shared:
    package_manager: "pnpm"
    monorepo_tool: "Turbo"
    code_quality: ["ESLint", "Prettier"]
```

### 二、系统架构设计 (必填)
```typescript
// 使用TypeScript接口定义系统架构
interface SystemArchitecture {
  // 系统概览
  overview: {
    purpose: string;           // 系统目标
    scope: string[];          // 功能范围
    constraints: string[];    // 技术约束
    principles: string[];     // 设计原则
  };
  
  // 架构层次
  layers: {
    presentation: {           // 表现层
      components: string[];
      responsibilities: string[];
      technologies: string[];
    };
    business: {              // 业务层
      modules: string[];
      services: string[];
      patterns: string[];
    };
    data: {                  // 数据层
      entities: string[];
      repositories: string[];
      storage: string[];
    };
  };
  
  // 模块依赖关系
  dependencies: {
    [moduleName: string]: {
      depends_on: string[];
      used_by: string[];
      interfaces: string[];
    };
  };
}
```

**架构图规范**:
```mermaid
# 使用Mermaid格式定义架构图
graph TB
    subgraph "前端应用层"
        A[Web App - React]
        B[PC App - Electron]
    end
    
    subgraph "共享包层"
        C[VO包]
        D[API包]
        E[组件包]
        F[工具包]
    end
    
    subgraph "后端服务层"
        G[Desktop service layer]
        H[业务模块]
        I[认证模块]
        J[AI模块]
    end
    
    subgraph "数据存储层"
        K[SQLite]
    end
    
    A --> C
    A --> D
    B --> C
    B --> D
    G --> H
    G --> I
    G --> J
    H --> K
```

### 三、模块设计规范 (必填)
```typescript
// 标准业务模块结构定义
interface ModuleStructure {
  module_name: string;
  path: string;
  
  // 文件结构
  files: {
    entity: string;           // 实体文件路径
    dto: string[];           // DTO文件路径
    vo: string;              // VO文件路径
    controller: string;      // 控制器文件路径
    service: string;         // 服务文件路径
    mapper: string;          // 映射器文件路径
    module: string;          // 模块定义文件路径
  };
  
  // 接口定义
  interfaces: {
    crud_operations: CrudOperation[];
    custom_operations: CustomOperation[];
  };
  
  // 依赖关系
  dependencies: {
    internal: string[];      // 内部模块依赖
    external: string[];      // 外部包依赖
    database: string[];      // 数据库依赖
  };
}

// CRUD操作标准定义
interface CrudOperation {
  operation: "create" | "read" | "update" | "delete" | "list";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  request_dto?: string;
  response_vo: string;
  permissions: string[];
  validation_rules: ValidationRule[];
}
```

### 四、数据库设计 (必填)
```typescript
// 数据库设计规范
interface DatabaseDesign {
  // 实体定义
  entities: {
    [entityName: string]: {
      table_name: string;
      fields: FieldDefinition[];
      indexes: IndexDefinition[];
      relationships: RelationshipDefinition[];
    };
  };
}

// 字段定义标准
interface FieldDefinition {
  name: string;
  type: "varchar" | "int" | "bigint" | "decimal" | "datetime" | "boolean" | "text";
  length?: number;
  nullable: boolean;
  default?: any;
  comment: string;
  decorators: string[];        // TypeORM装饰器
}
```

### 五、API设计规范 (必填)
```typescript
// API设计标准
interface ApiDesign {
  // 基础信息
  base_info: {
    base_url: string;
    version: string;
    authentication: "JWT" | "Basic" | "OAuth2";
    content_type: "application/json";
  };
  
  // 端点定义
  endpoints: {
    [path: string]: {
      method: HttpMethod;
      summary: string;
      description: string;
      parameters: ParameterDefinition[];
      request_body?: RequestBodyDefinition;
      responses: ResponseDefinition[];
      security: SecurityRequirement[];
      tags: string[];
    };
  };
  
  // 数据模型
  schemas: {
    [schemaName: string]: {
      type: "object" | "array" | "string" | "number" | "boolean";
      properties?: { [key: string]: PropertyDefinition };
      required?: string[];
      example: any;
    };
  };
}

// HTTP方法枚举
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 响应定义
interface ResponseDefinition {
  status_code: number;
  description: string;
  schema: string;
  headers?: { [key: string]: string };
  example: any;
}
```

### 六、前端组件设计 (必填)
```typescript
// 前端组件设计规范
interface ComponentDesign {
  // 页面组件
  pages: {
    [pageName: string]: {
      path: string;
      component_name: string;
      props: PropDefinition[];
      state: StateDefinition[];
      hooks: HookDefinition[];
      child_components: string[];
      api_calls: string[];
    };
  };
  
  // 通用组件
  components: {
    [componentName: string]: {
      type: "functional" | "class";
      props: PropDefinition[];
      events: EventDefinition[];
      dependencies: string[];
    };
  };
  
  // 状态管理
  state_management: {
    stores: StoreDefinition[];
    actions: ActionDefinition[];
    selectors: SelectorDefinition[];
  };
}

// 组件属性定义
interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
  validation?: ValidationRule[];
}
```

### 七、AI执行指令 (必填 - 核心)
```yaml
# AI代码生成指令
ai_instructions:
  # 生成任务模板
  generation_tasks:
    backend:
      - task: "生成Entity实体类"
        template: "entity_template"
        output_path: "apps/desktop/src/service/growth/{module}/{module}.entity.ts"
        dependencies: ["TypeORM", "class-validator"]
        
      - task: "生成DTO传输对象"
        template: "dto_template"
        output_path: "apps/desktop/src/service/growth/{module}/dto/"
        dependencies: ["class-validator", "class-transformer"]
        
      - task: "生成Controller控制器"
        template: "controller_template"
        output_path: "apps/desktop/src/service/growth/{module}/{module}.route-controller.ts"
        dependencies: ["@nestjs/common", "swagger"]
        
      - task: "生成Service服务类"
        template: "service_template"
        output_path: "apps/desktop/src/service/growth/{module}/{module}.service.ts"
        dependencies: ["TypeORM", "Repository"]
        
    frontend:
      - task: "生成页面组件"
        template: "page_template"
        output_path: "apps/desktop/src/render/pages/growth/{module}/"
        dependencies: ["React", "@sue/design-web-react"]
        
      - task: "生成API接口"
        template: "api_template"
        output_path: "packages/api/src/controller/{module}/{entity}.api.ts"
        dependencies: ["axios"]
        
    shared:
      - task: "生成VO值对象"
        template: "vo_template"
        output_path: "packages/vo/src/{module}/{entity}.vo.ts"
        dependencies: []

  # 代码模板引用
  templates:
    entity_template: "code-specification/entity-specification"
    dto_template: "code-specification/dto-specification"
    controller_template: "code-specification/controller-specification"
    service_template: "code-specification/service-specification"
    vo_template: "code-specification/vo-specification"
    page_template: "code-specification/frontend-specification"
    api_template: "code-specification/api-specification"

  # 执行上下文
  execution_context:
    project_structure: "True North Monorepo"
    architecture_pattern: "分层架构 + 模块化"
    naming_convention: "camelCase + PascalCase"
    code_standards: ["ESLint", "Prettier", "TypeScript strict"]
    
  # 验证规则
  validation_rules:
    - "遵循Life Toolkit项目架构规范"
    - "使用统一的命名约定(camelCase + PascalCase)"
    - "实现完整的CRUD操作"
    - "添加基本的错误处理和参数验证"
    - "包含用户权限验证"
    - "使用TypeORM装饰器定义实体关系"
    - "前端使用 @sue/design-web-react 组件库"
    - "实现基本的响应式布局"
    
  # 文件路径约定
  file_paths:
    backend:
      entity: "apps/desktop/src/service/growth/{module}/{module}.entity.ts"
      dto: "apps/desktop/src/service/growth/{module}/dto/"
      controller: "apps/desktop/src/service/growth/{module}/{module}.route-controller.ts"
      service: "apps/desktop/src/service/growth/{module}/{module}.service.ts"
      mapper: "apps/desktop/src/service/growth/{module}/dto/"
      module: "apps/desktop/src/service/growth/{module}/index.ts"
    frontend:
      page: "apps/desktop/src/render/pages/growth/{module}/"
      component: "apps/desktop/src/render/pages/growth/components/"
    shared:
      vo: "packages/vo/src/{module}/{entity}.vo.ts"
      api: "packages/api/src/controller/{module}/{entity}.api.ts"
```

### 八、开发流程规范 (必填)
```yaml
# 开发流程定义
development_workflow:
  # 环境搭建
  environment_setup:
    prerequisites:
      - "Node.js >= 18.0.0"
      - "pnpm >= 8.0.0"
      - "SQLite（Desktop 本地库）"
      - "Git >= 2.30.0"
    
    setup_steps:
      - command: "git clone <repository_url>"
        description: "克隆项目仓库"
      - command: "pnpm install"
        description: "安装依赖包"
      - command: "cp .env.example .env"
        description: "配置环境变量"
      - command: "pnpm dev"
        description: "启动开发服务器"
    
    verification:
      - check: "http://localhost:3000 可访问"
        description: "前端服务正常启动"
      - check: "http://localhost:3001/api/health 返回200"
        description: "后端服务正常启动"

  # 代码规范
  coding_standards:
    naming_conventions:
      files: "kebab-case (user-profile.component.ts)"
      classes: "PascalCase (UserProfileComponent)"
      methods: "camelCase (getUserProfile)"
      constants: "UPPER_SNAKE_CASE (API_BASE_URL)"
      
    file_structure:
      backend: "apps/desktop/src/service/growth/{module}/"
      frontend: "apps/desktop/src/render/pages/growth/{module}/"
      shared: "packages/{package_name}/src/"
      
    import_order:
      - "Node.js内置模块"
      - "第三方库"
      - "项目内部模块"
      - "相对路径导入"

  # Git工作流
  git_workflow:
    branch_strategy: "Feature Branch + Main"
    branch_naming: "feature/{module}-{description}"
    commit_format: "Conventional Commits"
```

### 九、性能和质量要求
```yaml
# 性能要求
performance_requirements:
  backend:
    response_time: "< 2s (一般情况)"
    memory_usage: "< 1GB"
    
  frontend:
    page_load: "< 5s (首次)"
    interaction: "< 500ms"
    
  database:
    query_time: "< 1s (一般情况)"

# 质量要求
quality_requirements:
  linting_errors: "0"
  basic_functionality: "正常工作"
  
# 兼容性要求
compatibility_requirements:
  browsers:
    - "Chrome >= 90"
    - "Firefox >= 88"
    - "Safari >= 14"
  node_versions:
    - "Node.js >= 18.0.0"
    - "pnpm >= 8.0.0"
```

