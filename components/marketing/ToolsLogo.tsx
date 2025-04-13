import React from 'react';
import { aiTools } from '@/data/ai-tools';
import { ToolCards } from './ToolCards';

/**
 * ToolsLogo Component
 * Displays a section showcasing tools and frameworks compatible with Provibe.
 */
export function ToolsLogo() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
        {/* Text Content Block 
        <div className="md:w-1/3">
          <h3 className="text-2xl font-bold mb-2">Works with your favorite tools</h3>
          <p className="text-muted-foreground">
            ProVibe integrates seamlessly with popular AI tools and frameworks to enhance your development workflow.
          </p>
        </div>
        */}
        {/* Visual Block - Featured Tools 
        <div className="md:w-2/3 grid grid-cols-4 gap-4">
          {aiTools.slice(0, 4).map((tool) => (
            <div key={tool.id} className="flex flex-col items-center">
              <img 
                loading="lazy" 
                width="50" 
                height="50" 
                className="aspect-square mb-2" 
                alt={`${tool.name} logo`} 
                src={tool.logo} 
              />
              <span className="text-xs font-medium text-center">{tool.name}</span>
            </div>
          ))}
          
        </div>
        */}
      </div>
      
      {/* All Tools Cards */}
      <ToolCards />
    </div>
  );
}
