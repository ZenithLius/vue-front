// src/workers/chartData.worker.ts

// 定义数据接口
export interface ChartData {
    id: number
    title: string
    data: number[]
    labels: string[]
}

// 模拟生成单个图表数据
const generateChartData = (id: number): ChartData => {
    const points = 20
    const data: number[] = []
    const labels: string[] = []

    for (let i = 0; i < points; i++) {
        data.push(Math.floor(Math.random() * 100))
        labels.push(`${i}s`)
    }

    return {
        id,
        title: `CHART_NODE_${id.toString().padStart(5, '0')}`,
        data,
        labels
    }
}

// 监听主线程消息
self.onmessage = (e: MessageEvent) => {
    const { count, type } = e.data

    if (type === 'GENERATE') {
        const total = count || 10000
        const chunkSize = 500 // 分批发送，避免一次传输过大数据

        // 我们分批生成并发送数据，这样UI侧可以渐进式接收
        for (let i = 0; i < total; i += chunkSize) {
            const chunk: ChartData[] = []
            const limit = Math.min(i + chunkSize, total)

            for (let j = i; j < limit; j++) {
                chunk.push(generateChartData(j))
            }

            // 发送这一批数据
            self.postMessage({
                type: 'CHUNK',
                data: chunk,
                progress: limit / total
            })
        }

        // 发送完成信号
        self.postMessage({ type: 'COMPLETE' })
    }
}
