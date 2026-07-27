'use client';

import { Card, Row, Col, ArrowDownOutlined, ArrowUpOutlined } from '@sue/design-web-react';

import { useExpenses } from '../context';

export function TransactionStats() {
  const { stats } = useExpenses();

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} md={12} lg={6}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">总收入</span>
            <ArrowUpOutlined className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${stats.totalIncome.toFixed(2)}
          </div>
        </Card>
      </Col>

      <Col span={24} md={12} lg={6}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">总支出</span>
            <ArrowDownOutlined className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            ${stats.totalExpenses.toFixed(2)}
          </div>
        </Card>
      </Col>

      <Col span={24} md={12} lg={6}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">净额</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${stats.netAmount.toFixed(2)}
          </div>
        </Card>
      </Col>

      <Col span={24} md={12} lg={6}>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">环比变化</span>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {stats.periodComparison.change.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">相比上期</p>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
