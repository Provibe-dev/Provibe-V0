import React from 'react';
import { aiTools } from '@/data/ai-tools';
import { Card } from '@/components/ui/card';

export function ToolCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {aiTools.map((tool) => (
        <Card key={tool.id} className="flex flex-col items-center p-4 hover:shadow-md transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center mb-3">
            <img 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <h3 className="text-sm font-medium text-center">{tool.name}</h3>
          <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
            {tool.description}
          </p>
        </Card>
      ))}
    </div>
  );
}