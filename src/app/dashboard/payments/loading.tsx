import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Search } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm" disabled>
              Reprocess payments
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by checkout session ID"
              className="pl-10"
              disabled
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5,6,7,8].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-6 bg-gray-200 rounded-full w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 rounded-full w-5"></div></TableCell>
                  <TableCell><div className="h-8 bg-gray-200 rounded w-8"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}
