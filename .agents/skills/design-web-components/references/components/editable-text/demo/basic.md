# Basic

## Description (en-US)

Display the document sample.

## Source

```vue
<script setup lang="ts">
const blockContent = `AntV 是蚂蚁集团全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、不限可能的数据可视化最佳实践。得益于丰富的业务场景和用户需求挑战，AntV 经历多年积累与不断打磨，已支撑整个阿里集团内外 20000+ 业务系统，通过了日均千万级 UV 产品的严苛考验。
我们正在基础图表，图分析，图编辑，地理空间可视化，智能可视化等各个可视化的领域耕耘，欢迎同路人一起前行。`
</script>

<template>
  <div>
    <sue-editable-text>Introduction</sue-editable-text>

    <sue-editable-paragraph>
      In the process of internal desktop applications development, many different design specs and
      implementations would be involved, which might cause designers and developers difficulties and
      duplication and reduce the efficiency of development.
    </sue-editable-paragraph>

    <sue-editable-paragraph>
      After massive project practice and summaries, Antdv Next, a design language for background
      applications, is refined by Ant UED Team, which aims to
      <sue-editable-text strong>
        uniform the user interface specs for internal background projects, lower the unnecessary
        cost of design differences and implementation and liberate the resources of design and
        front-end development
      </sue-editable-text>
      .
    </sue-editable-paragraph>

    <sue-editable-text :level="2">
      Guidelines and Resources
    </sue-editable-text>

    <sue-editable-paragraph>
      We supply a series of design principles, practical patterns and high quality design resources
      (<sue-editable-text code>
        Sketch
      </sue-editable-text> and <sue-editable-text code>
        Axure
      </sue-editable-text>), to help people create their product
      prototypes beautifully and efficiently.
    </sue-editable-paragraph>

    <sue-editable-paragraph>
      Press <sue-editable-text keyboard>
        Esc
      </sue-editable-text> to exit...
    </sue-editable-paragraph>

    <sue-divider />

    <sue-editable-text>介绍</sue-editable-text>

    <sue-editable-paragraph>
      蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂,而且变动和并发频繁,常常需要设计与开发能够快速的做出响应。同时这类产品中有存在很多类似的页面以及组件,可以通过抽象得到一些稳定且高复用性的内容。
    </sue-editable-paragraph>

    <sue-editable-paragraph>
      随着商业化的趋势,越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标,我们(蚂蚁集团体验技术部)经过大量的项目实践和总结,逐步打磨出一个服务于企业级产品的设计体系
      Antdv Next。基于<sue-editable-text mark>
        『确定』和『自然』
      </sue-editable-text>
      的设计价值观,通过模块化的解决方案,降低冗余的生产成本,让设计者专注于
      <sue-editable-text strong>
        更好的用户体验
      </sue-editable-text>。
    </sue-editable-paragraph>

    <sue-editable-text :level="2">
      设计资源
    </sue-editable-text>

    <sue-editable-paragraph>
      我们提供完善的设计原则、最佳实践和设计资源文件(<sue-editable-text code>
        Sketch
      </sue-editable-text> 和
      <sue-editable-text code>
        Axure
      </sue-editable-text>),来帮助业务快速设计出高质量的产品原型。
    </sue-editable-paragraph>

    <sue-editable-paragraph>
      <blockquote>{{ blockContent }}</blockquote>
      <pre>{{ blockContent }}</pre>
    </sue-editable-paragraph>

    <sue-editable-paragraph>
      按<sue-editable-text keyboard>
        Esc
      </sue-editable-text>键退出阅读……
    </sue-editable-paragraph>
  </div>
</template>
```
