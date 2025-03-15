"use client"

import React from 'react'
import ProtectedRoute from '@/components/protected-route'

export default function Page() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Hello, World!</h1>
            </div>
        </ProtectedRoute>
    )
}