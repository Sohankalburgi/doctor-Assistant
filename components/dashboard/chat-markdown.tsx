"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function ChatMarkdown({ text }: { text: string }) {
    return (
        <div className="w-full bg-secondary/50 p-4 rounded-lg border border-border overflow-x-auto">
            <style>{`
                .prose table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                .prose table thead {
                    background-color: var(--color-bg-secondary);
                }
                .prose table th,
                .prose table td {
                    padding: 0.75rem;
                    text-align: left;
                    border: 1px solid var(--color-border);
                }
                .prose table th {
                    font-weight: 600;
                    background-color: var(--color-bg-accent, #f3f4f6);
                }
                .prose table tbody tr:nth-child(even) {
                    background-color: var(--color-bg-secondary, #f9fafb);
                }
                .prose table tbody tr:hover {
                    background-color: var(--color-bg-accent, #f3f4f6);
                }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    margin: 1rem 0 0.5rem 0;
                    font-weight: 600;
                }
                .prose p {
                    margin: 0.5rem 0;
                }
                .prose ul, .prose ol {
                    margin: 0.5rem 0 0.5rem 1.5rem;
                }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ children }) => (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-secondary border-b border-border">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-border">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-accent/20 transition-colors">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-2 text-left font-semibold text-foreground bg-secondary border border-border">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-2 text-foreground border border-border">
                            {children}
                        </td>
                    ),
                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold mt-2 mb-1">{children}</h3>,
                    p: ({ children }) => <p className="text-sm leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-sm space-y-1 my-2">{children}</ul>,
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    )
}
