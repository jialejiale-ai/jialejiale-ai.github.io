export type MealType = '早餐' | '午餐' | '晚餐' | '加餐'

export interface MacroSet {
  carbs: number // 克
  protein: number // 克
  fat: number // 克
}

export interface Targets extends MacroSet {}

/** 内置食物库条目 */
export interface Food {
  id: string
  name: string
  category: '主食' | '蛋白质' | '蔬果' | '脂肪坚果' | '饮品' | '外食菜品'
  /** 份量单位描述，如 '100克'、'1碗(约200克)'、'1个(约55克)' */
  unitDesc: string
  /** 每单位含有的宏量营养素（克） */
  perUnit: MacroSet
  /** 是否为估算值（外食菜品等） */
  estimated?: boolean
}

/** 一条饮食记录 */
export interface Entry {
  id: string
  date: string // YYYY-MM-DD
  meal: MealType
  name: string
  carbs: number
  protein: number
  fat: number
  /** 可选：缩略图 dataURL */
  photo?: string
  createdAt: number
}

export const MEALS: MealType[] = ['早餐', '午餐', '晚餐', '加餐']

export function kcal(m: MacroSet): number {
  return Math.round(m.carbs * 4 + m.protein * 4 + m.fat * 9)
}
