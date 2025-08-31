import React from 'react'

export default function loading() {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
        <div className="max-w-4xl w-full mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Form skeleton */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Right side - Order summary skeleton */}
            <div className="bg-white rounded-lg border p-6 h-fit">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  )
}
