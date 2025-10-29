import express from 'express'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { checkControllerStatus, checkPendingSyncFiles, getPendingSyncFiles } from '../watch-controllers/checker'

const app = express()
const port = 3002

app.use(express.json())
app.use(express.static(path.join(process.cwd(), 'dist')))

// 存储运行中的监听任务
const runningTasks = new Map<string, ChildProcess>()

// 执行同步命令
app.post('/api/execute', async (req, res) => {
  const { command, type } = req.body
  
  try {
    if (type === 'sync') {
      // 同步操作：执行一次性命令
      const child = spawn('pnpm', [command], {
        cwd: process.cwd(),
        stdio: 'pipe'
      })
      
      let output = ''
      let error = ''
      
      child.stdout?.on('data', (data) => {
        output += data.toString()
      })
      
      child.stderr?.on('data', (data) => {
        error += data.toString()
      })
      
      child.on('close', (code) => {
        if (code === 0) {
          res.json({ success: true, output })
        } else {
          res.json({ success: false, error: error || '命令执行失败' })
        }
      })
      
    } else if (type === 'watch') {
      // 监听操作：启动长期运行的进程
      const taskId = req.body.taskId || `watch-${Date.now()}`
      
      // 如果任务已经在运行，先停止它
      if (runningTasks.has(taskId)) {
        runningTasks.get(taskId)?.kill()
        runningTasks.delete(taskId)
      }
      
      const child = spawn('pnpm', [command], {
        cwd: process.cwd(),
        stdio: 'pipe'
      })
      
      runningTasks.set(taskId, child)
      
      child.on('close', (code) => {
        runningTasks.delete(taskId)
        console.log(`监听任务 ${taskId} 已结束，退出码: ${code}`)
      })
      
      child.on('error', (error) => {
        runningTasks.delete(taskId)
        console.error(`监听任务 ${taskId} 出错:`, error)
      })
      
      res.json({ success: true, taskId })
    }
    
  } catch (error) {
    res.json({ success: false, error: error instanceof Error ? error.message : String(error) })
  }
})

// 停止监听任务
app.post('/api/stop', (req, res) => {
  const { taskId } = req.body
  
  if (runningTasks.has(taskId)) {
    const child = runningTasks.get(taskId)
    child?.kill()
    runningTasks.delete(taskId)
    res.json({ success: true })
  } else {
    res.json({ success: false, error: '任务未找到或已停止' })
  }
})

// 获取运行中的任务列表
app.get('/api/tasks', (req, res) => {
  const tasks = Array.from(runningTasks.keys())
  res.json({ tasks })
})

// 检查 Controllers 同步状态
app.get('/api/check/controllers', (req, res) => {
  try {
    const status = checkPendingSyncFiles()
    res.json({ success: true, data: status })
  } catch (error) {
    res.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    })
  }
})

// 检查单个 Controller 状态
app.get('/api/check/controller', (req, res) => {
  const { path: controllerPath } = req.query
  
  if (!controllerPath || typeof controllerPath !== 'string') {
    res.json({ success: false, error: '缺少 path 参数' })
    return
  }
  
  try {
    const status = checkControllerStatus(controllerPath)
    if (status) {
      res.json({ success: true, data: status })
    } else {
      res.json({ success: false, error: '无效的控制器文件' })
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    })
  }
})

// 获取待同步文件列表
app.get('/api/check/pending-files', (req, res) => {
  try {
    const files = getPendingSyncFiles()
    res.json({ success: true, data: files })
  } catch (error) {
    res.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    })
  }
})

// 处理 SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Dev Tools 服务器运行在 http://localhost:${port}`)
})
