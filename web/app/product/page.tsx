'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain,
    Search,
    Lightbulb,
    Activity,
    Clock,
    ShieldAlert,
    Zap,
    History,
    FileText,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ProductPage() {
    const [view, setView] = useState<'intro' | 'scenarios'>('intro')

    return (
        <div className="h-screen bg-slate-950 text-white overflow-hidden flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        I2AI 会议智能体
                    </h1>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setView('intro')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'intro'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        功能介绍
                    </button>
                    <button
                        onClick={() => setView('scenarios')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'scenarios'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        火电厂场景实战
                    </button>
                </div>

                <div className="w-32 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        关于我们
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/product/hero_bg.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
                </div>

                <div className="relative z-10 h-full container mx-auto px-4 py-6">
                    <AnimatePresence mode="wait">
                        {view === 'intro' ? (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col gap-6"
                            >
                                {/* Core Values - Top Row */}
                                <div className="grid grid-cols-3 gap-4 h-1/3 min-h-[200px]">
                                    {[
                                        {
                                            icon: History,
                                            title: "全景时空记忆",
                                            desc: "打破单场会议孤岛，串联历史讨论，构建设备全生命周期与运营管理的“时空知识图谱”。",
                                            color: "text-blue-400",
                                            bg: "bg-blue-500/10",
                                            border: "border-blue-500/20"
                                        },
                                        {
                                            icon: Activity,
                                            title: "决策逻辑溯源",
                                            desc: "完整还原技术改造、检修方案等关键决策的演变路径，让每一次调度调整和设备改动都有据可查。",
                                            color: "text-purple-400",
                                            bg: "bg-purple-500/10",
                                            border: "border-purple-500/20"
                                        },
                                        {
                                            icon: ShieldAlert,
                                            title: "隐患主动预警",
                                            desc: "从海量日常对话中敏锐捕捉重复出现的设备异常描述和管理盲区，防患于未然。",
                                            color: "text-cyan-400",
                                            bg: "bg-cyan-500/10",
                                            border: "border-cyan-500/20"
                                        }
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-xl p-6 border ${item.border} ${item.bg} backdrop-blur-sm flex flex-col justify-center group hover:bg-opacity-20 transition-all`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <item.icon className={`w-8 h-8 ${item.color}`} />
                                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Feature Hierarchy - Bottom Row */}
                                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                                    {/* Meeting Analysis */}
                                    <div className="rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-blue-500/20">
                                                <Brain className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h3 className="text-xl font-bold">会议分析</h3>
                                        </div>
                                        <div className="relative flex-1 rounded-lg overflow-hidden mb-4 group">
                                            <Image
                                                src="/images/product/analysis.jpg"
                                                alt="Meeting Analysis"
                                                fill
                                                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-sm text-white font-medium">从单场会议走向跨会议模式识别</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-sm text-slate-400">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                总结讨论和关键决策
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                提取行动项目和截止日期
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                识别多个会议中的模式
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                跟踪主题如何随时间演变
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Information Retrieval */}
                                    <div className="rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-purple-500/20">
                                                <Search className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h3 className="text-xl font-bold">信息检索</h3>
                                        </div>
                                        <div className="relative flex-1 rounded-lg overflow-hidden mb-4 group">
                                            <Image
                                                src="/images/product/search.jpg"
                                                alt="Information Retrieval"
                                                fill
                                                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-sm text-white font-medium">基于时空语境的精准问答</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-sm text-slate-400">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                回答有关过去对话的具体问题
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                查找讨论某些主题的时间
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                查找参与者详细信息和联系信息
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                搜索所有会议记录
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Strategic Insights */}
                                    <div className="rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-cyan-500/20">
                                                <Lightbulb className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <h3 className="text-xl font-bold">战略洞察</h3>
                                        </div>
                                        <div className="relative flex-1 rounded-lg overflow-hidden mb-4 group">
                                            <Image
                                                src="/images/product/insight.jpg"
                                                alt="Strategic Insights"
                                                fill
                                                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-sm text-white font-medium">从被动查询走向主动建议</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-sm text-slate-400">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                连接不同会议之间的主题
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                强调反复出现的问题或疑虑
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                根据讨论提出后续行动建议
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                                提供有针对性的建议
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="scenarios"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full grid grid-cols-3 grid-rows-2 gap-4"
                            >
                                {/* Meeting Summary Example (New) */}
                                <div className="row-span-2 col-span-1 bg-slate-900/80 border border-blue-500/30 rounded-xl p-5 flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <FileText className="w-24 h-24 text-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-blue-600">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold">智能纪要生成</h3>
                                    </div>

                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                            <span className="text-xs text-slate-400 block mb-2">原始对话片段</span>
                                            <div className="space-y-2 text-xs text-slate-300">
                                                <p><span className="text-blue-400">王工:</span> #3给水泵的振动还是偏大，上次调了动平衡好像没彻底解决。</p>
                                                <p><span className="text-purple-400">李厂:</span> 是不是基础的问题？上次查过地脚螺栓吗？</p>
                                                <p><span className="text-blue-400">王工:</span> 查了，没松动。我怀疑是联轴器对中不好。</p>
                                                <p><span className="text-purple-400">李厂:</span> 那这周五停机窗口，安排人重新做个激光对中吧。</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <ChevronRight className="w-5 h-5 text-slate-500 rotate-90" />
                                        </div>

                                        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
                                            <span className="text-xs text-blue-400 font-bold block mb-2">AI 生成纪要</span>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-wider text-slate-500">问题识别</span>
                                                    <p className="text-xs text-white">#3给水泵振动持续偏大，动平衡调整未解决。</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-wider text-slate-500">关键决策</span>
                                                    <p className="text-xs text-white">排除了地脚螺栓松动原因，锁定为联轴器对中问题。</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-wider text-slate-500">行动项</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px]">高优</span>
                                                        <p className="text-xs text-white">周五停机窗口进行激光对中 (责任人: 王工)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Scenarios */}
                                {[
                                    {
                                        title: "设备可靠性提升",
                                        role: "设备部/运行部",
                                        problem: "#2机组轴承温度异常问题反复讨论但无实质性进展。",
                                        analysis: "最近4次会议均提及；每次决定'继续观察'；讨论分散在多部门会议。",
                                        suggestion: "召集跨部门专题会议；参考#1机组历史方案；设2周解决时限。",
                                        value: "避免重大设备故障，落实闭环管理责任。",
                                        icon: ShieldAlert,
                                        color: "text-red-400",
                                        bg: "bg-red-500/10"
                                    },
                                    {
                                        title: "安全管理效能提升",
                                        role: "安监部",
                                        problem: "安全制度执行效果不理想，违章屡禁不止。",
                                        analysis: "培训出席率与违章率负相关；同类违章在同班组复发；措施多落实少。",
                                        suggestion: "建立落实跟踪机制；开展高频违章专项培训；安全绩效挂钩决策。",
                                        value: "降低作业风险，提升全员安全意识。",
                                        icon: Activity,
                                        color: "text-orange-400",
                                        bg: "bg-orange-500/10"
                                    },
                                    {
                                        title: "会议模式识别",
                                        role: "运营管理部",
                                        problem: "月度运营会议经常超时，效率低下。",
                                        analysis: "系统识别'燃料成本分析'议题平均占用40%会议时间。",
                                        suggestion: "将该议题拆分为会前阅读材料，节省现场讨论时间。",
                                        value: "缩短会议时长，聚焦战略决策讨论。",
                                        icon: Clock,
                                        color: "text-blue-400",
                                        bg: "bg-blue-500/10"
                                    },
                                    {
                                        title: "参与者画像构建",
                                        role: "人力资源/技术部",
                                        problem: "寻找变压器维护专家解决疑难杂症。",
                                        analysis: "系统识别张工在5次相关会议中贡献了75%的技术方案。",
                                        suggestion: "建议在本次故障处理中邀请张工加入专家组。",
                                        value: "精准定位内部专家，提升问题解决效率。",
                                        icon: Zap,
                                        color: "text-purple-400",
                                        bg: "bg-purple-500/10"
                                    }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col hover:border-slate-500 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-1.5 rounded-lg ${item.bg}`}>
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white">{item.title}</h3>
                                                <span className="text-xs text-slate-400">{item.role}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="pl-2 border-l-2 border-slate-600">
                                                <span className="text-xs text-slate-500 block font-medium">问题</span>
                                                <p className="text-sm text-slate-300 leading-snug">{item.problem}</p>
                                            </div>
                                            <div className="pl-2 border-l-2 border-blue-600">
                                                <span className="text-xs text-blue-500 block font-medium">系统分析</span>
                                                <p className="text-sm text-slate-300 leading-snug">{item.analysis}</p>
                                            </div>
                                            <div className="pl-2 border-l-2 border-green-600">
                                                <span className="text-xs text-green-500 block font-medium">系统建议</span>
                                                <p className="text-sm text-slate-300 leading-snug">{item.suggestion}</p>
                                            </div>
                                            <div className="pl-2 border-l-2 border-purple-600">
                                                <span className="text-xs text-purple-500 block font-medium">客户价值</span>
                                                <p className="text-sm text-slate-300 leading-snug">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
