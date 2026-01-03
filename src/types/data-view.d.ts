declare module '@kjgl77/datav-vue3' {
    import { Plugin } from 'vue'

    const DataV: Plugin
    export default DataV

    export const BorderBox1: any
    export const BorderBox8: any
    export const BorderBox13: any
    export const Decoration1: any
    export const Decoration2: any
    export const Decoration3: any
    export const Decoration5: any
    export const Decoration8: any
    export const DigitalFlop: any
    export const WaterLevelPond: any
    export const PercentPond: any
    export const ActiveRingChart: any
    export const ScrollBoard: any
    export const FullScreenContainer: any
}

// 扩展Performance接口以支持Chrome的memory属性
interface Performance {
    memory?: {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
    }
}
