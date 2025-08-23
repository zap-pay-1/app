
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Plus, Search } from 'lucide-react'
import React from 'react'
export default function loading() {
  return (
   <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Payment links</h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Create payment link
          </Button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">All payment links</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">Deactivated</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>URL</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created on</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[100px]">More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-8 bg-gray-200 rounded w-8"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}
