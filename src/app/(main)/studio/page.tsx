"use client"

import React, { useState } from 'react'
import ProtectedRoute from '@/components/global/protected-route'
//import { useAuth } from '@/providers/auth-provider'


export default function StudioPage() {
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Studio</h1>
          </div>
        </div>
    </ProtectedRoute>
  )
}