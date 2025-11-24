'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-border border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Inner pulsing circle */}
                <motion.div
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        </div>
    )
}

export function LoadingDots() {
    return (
        <div className="flex items-center justify-center gap-2 p-8">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary"
                    animate={{
                        y: [0, -12, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

export function LoadingPulse() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-12">
            {/* Pulsing circle */}
            <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 1, 0.6]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <motion.div
                    className="w-12 h-12 rounded-full bg-primary"
                    animate={{
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Loading text */}
            <motion.p
                className="text-sm text-muted font-500"
                animate={{
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                Loading data...
            </motion.p>
        </div>
    )
}

export function LoadingTable() {
    return (
        <table className="w-full">
            <tbody>
                {/* Animated skeleton rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.tr
                        key={i}
                        className="border-b border-border hover:bg-surface/50 transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            delay: i * 0.1,
                            duration: 0.3
                        }}
                    >
                        {/* Multiple columns with animated skeletons */}
                        {[1, 2, 3, 4].map((col) => (
                            <td key={col} className="px-3 md:px-4 py-4">
                                <motion.div
                                    className="h-4 bg-gradient-to-r from-border via-surface to-border rounded"
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    style={{
                                        backgroundSize: '200% 100%',
                                        width: col === 4 ? '60%' : '100%'
                                    }}
                                />
                            </td>
                        ))}
                    </motion.tr>
                ))}
            </tbody>
        </table>
    )
}
