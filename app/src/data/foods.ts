import type { Food } from '@/types'

/**
 * 内置食物库。营养数据为每「单位份量」的碳水/蛋白质/脂肪（克）。
 * 家常食物数据参考《中国食物成分表》常见值；外食菜品为按常见分量估算值，仅作参考。
 */
export const FOODS: Food[] = [
  // ── 主食（熟重） ─────────────────────────────
  { id: 'rice', name: '米饭', category: '主食', unitDesc: '1碗(约150克)', perUnit: { carbs: 38.9, protein: 3.9, fat: 0.5 } },
  { id: 'rice-100', name: '米饭', category: '主食', unitDesc: '100克', perUnit: { carbs: 25.9, protein: 2.6, fat: 0.3 } },
  { id: 'noodle', name: '面条(煮)', category: '主食', unitDesc: '1碗(约200克)', perUnit: { carbs: 48.6, protein: 5.4, fat: 0.4 } },
  { id: 'mantou', name: '馒头', category: '主食', unitDesc: '1个(约100克)', perUnit: { carbs: 47, protein: 7, fat: 1.1 } },
  { id: 'wholewheat-bread', name: '全麦面包', category: '主食', unitDesc: '1片(约35克)', perUnit: { carbs: 14.4, protein: 3, fat: 1.2 } },
  { id: 'oats', name: '燕麦片(干)', category: '主食', unitDesc: '1份(40克)', perUnit: { carbs: 24, protein: 6, fat: 2.7 } },
  { id: 'sweet-potato', name: '蒸红薯', category: '主食', unitDesc: '1个(约200克)', perUnit: { carbs: 40, protein: 3.2, fat: 0.2 } },
  { id: 'corn', name: '甜玉米', category: '主食', unitDesc: '1根(约200克)', perUnit: { carbs: 38, protein: 6.6, fat: 2.4 } },
  { id: 'potato', name: '蒸土豆', category: '主食', unitDesc: '1个(约150克)', perUnit: { carbs: 25.5, protein: 3, fat: 0.15 } },
  { id: 'multigrain-rice', name: '杂粮饭', category: '主食', unitDesc: '1碗(约150克)', perUnit: { carbs: 34.5, protein: 4.2, fat: 0.8 } },
  { id: 'rice-noodle', name: '米粉(煮)', category: '主食', unitDesc: '1碗(约250克)', perUnit: { carbs: 60, protein: 5, fat: 0.8 } },

  // ── 蛋白质类 ─────────────────────────────
  { id: 'chicken-breast', name: '鸡胸肉(熟)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0, protein: 31, fat: 3.6 } },
  { id: 'egg', name: '鸡蛋', category: '蛋白质', unitDesc: '1个(约55克)', perUnit: { carbs: 0.4, protein: 6.6, fat: 5 } },
  { id: 'beef-lean', name: '瘦牛肉(熟)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0, protein: 26, fat: 8 } },
  { id: 'pork-tenderloin', name: '猪里脊(熟)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0, protein: 26, fat: 6 } },
  { id: 'salmon', name: '三文鱼(熟)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0, protein: 22, fat: 13 } },
  { id: 'shrimp', name: '虾(熟)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0.2, protein: 20, fat: 1 } },
  { id: 'tofu-firm', name: '北豆腐', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 2, protein: 9, fat: 5 } },
  { id: 'fish-white', name: '清蒸鱼(鲈鱼等)', category: '蛋白质', unitDesc: '100克', perUnit: { carbs: 0, protein: 18.6, fat: 3.4 } },
  { id: 'protein-powder', name: '乳清蛋白粉', category: '蛋白质', unitDesc: '1勺(30克)', perUnit: { carbs: 3, protein: 24, fat: 1.5 }, estimated: true },

  // ── 蔬果 ─────────────────────────────
  { id: 'banana', name: '香蕉', category: '蔬果', unitDesc: '1根(约120克)', perUnit: { carbs: 27, protein: 1.3, fat: 0.4 } },
  { id: 'apple', name: '苹果', category: '蔬果', unitDesc: '1个(约200克)', perUnit: { carbs: 27.6, protein: 0.6, fat: 0.4 } },
  { id: 'greens', name: '绿叶蔬菜(炒)', category: '蔬果', unitDesc: '1份(约200克)', perUnit: { carbs: 6, protein: 3, fat: 8 }, estimated: true },
  { id: 'broccoli', name: '西兰花(煮)', category: '蔬果', unitDesc: '100克', perUnit: { carbs: 3.4, protein: 2.8, fat: 0.4 } },

  // ── 脂肪坚果 ─────────────────────────────
  { id: 'avocado', name: '牛油果', category: '脂肪坚果', unitDesc: '半个(约70克)', perUnit: { carbs: 6, protein: 1.4, fat: 10.5 } },
  { id: 'nuts', name: '混合坚果', category: '脂肪坚果', unitDesc: '1小把(25克)', perUnit: { carbs: 5, protein: 3.8, fat: 12.5 } },
  { id: 'peanut-butter', name: '花生酱', category: '脂肪坚果', unitDesc: '1勺(15克)', perUnit: { carbs: 3, protein: 3.8, fat: 7.5 } },
  { id: 'olive-oil', name: '橄榄油', category: '脂肪坚果', unitDesc: '1勺(10克)', perUnit: { carbs: 0, protein: 0, fat: 10 } },

  // ── 饮品 ─────────────────────────────
  { id: 'milk', name: '全脂牛奶', category: '饮品', unitDesc: '1盒(250毫升)', perUnit: { carbs: 12, protein: 8, fat: 9.5 } },
  { id: 'yogurt', name: '无糖酸奶', category: '饮品', unitDesc: '1杯(200克)', perUnit: { carbs: 10, protein: 8, fat: 6 } },
  { id: 'latte', name: '拿铁(无糖)', category: '饮品', unitDesc: '1杯(大杯)', perUnit: { carbs: 16, protein: 10, fat: 9 }, estimated: true },

  // ── 外食菜品（按常见分量估算） ─────────────────────────────
  { id: 'kungpao', name: '宫保鸡丁', category: '外食菜品', unitDesc: '1份(约300克)', perUnit: { carbs: 18, protein: 25, fat: 22 }, estimated: true },
  { id: 'tomato-egg', name: '番茄炒蛋', category: '外食菜品', unitDesc: '1份(约250克)', perUnit: { carbs: 8, protein: 12, fat: 14 }, estimated: true },
  { id: 'braised-pork', name: '红烧肉', category: '外食菜品', unitDesc: '1份(约200克)', perUnit: { carbs: 6, protein: 18, fat: 35 }, estimated: true },
  { id: 'mapo-tofu', name: '麻婆豆腐', category: '外食菜品', unitDesc: '1份(约300克)', perUnit: { carbs: 8, protein: 12, fat: 15 }, estimated: true },
  { id: 'huangmenji', name: '黄焖鸡米饭', category: '外食菜品', unitDesc: '1份', perUnit: { carbs: 60, protein: 30, fat: 18 }, estimated: true },
  { id: 'beef-noodle', name: '牛肉面', category: '外食菜品', unitDesc: '1碗', perUnit: { carbs: 65, protein: 25, fat: 12 }, estimated: true },
  { id: 'chicken-rice', name: '鸡腿饭套餐', category: '外食菜品', unitDesc: '1份', perUnit: { carbs: 70, protein: 32, fat: 15 }, estimated: true },
  { id: 'salad-chicken', name: '鸡胸肉轻食沙拉', category: '外食菜品', unitDesc: '1份', perUnit: { carbs: 15, protein: 30, fat: 10 }, estimated: true },
  { id: 'burger', name: '牛肉汉堡', category: '外食菜品', unitDesc: '1个', perUnit: { carbs: 40, protein: 20, fat: 22 }, estimated: true },
  { id: 'pizza', name: '披萨', category: '外食菜品', unitDesc: '1角(约120克)', perUnit: { carbs: 30, protein: 12, fat: 10 }, estimated: true },
  { id: 'sushi', name: '寿司拼盘', category: '外食菜品', unitDesc: '6贯', perUnit: { carbs: 40, protein: 15, fat: 3 }, estimated: true },
  { id: 'dumpling', name: '猪肉白菜饺子', category: '外食菜品', unitDesc: '10个(约200克)', perUnit: { carbs: 44, protein: 14, fat: 16 }, estimated: true },
  { id: 'malatang', name: '麻辣烫(荤素搭配)', category: '外食菜品', unitDesc: '1份', perUnit: { carbs: 35, protein: 25, fat: 20 }, estimated: true },
]

export const FOOD_CATEGORIES = ['主食', '蛋白质', '蔬果', '脂肪坚果', '饮品', '外食菜品'] as const
