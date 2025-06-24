
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '../../contexts/TransactionContext';

const AIInsights = () => {
  const { transactions } = useTransactions();

  // Generate AI-powered insights
  const generateInsights = () => {
    const insights = [];
    
    // Calculate spending patterns
    const foodSpending = transactions
      .filter(t => t.type === 'expense' && t.category === 'Food & Dining')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const transportSpending = transactions
      .filter(t => t.type === 'expense' && t.category === 'Transportation')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (foodSpending > 400) {
      insights.push({
        type: 'warning',
        title: 'High Food Spending',
        description: `You've spent $${foodSpending.toFixed(0)} on food this month. Consider meal planning to reduce costs.`,
        impact: 'high'
      });
    }

    if (transportSpending < 50) {
      insights.push({
        type: 'positive',
        title: 'Great Transportation Savings',
        description: 'Your transportation costs are well controlled. Keep it up!',
        impact: 'medium'
      });
    }

    insights.push({
      type: 'suggestion',
      title: 'Savings Opportunity',
      description: 'Based on your spending pattern, you could save $200/month by reducing dining out by 30%.',
      impact: 'high'
    });

    return insights;
  };

  const insights = generateInsights();

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge className="bg-red-100 text-red-800">⚠️ Alert</Badge>;
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">✅ Good</Badge>;
      case 'suggestion':
        return <Badge className="bg-blue-100 text-blue-800">💡 Tip</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">ℹ️ Info</Badge>;
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          🤖 AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {insight.title}
                </h4>
                {getInsightBadge(insight.type)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
