import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ViewHeaderProps {
    icon: LucideIcon;
    title?: string;
    subtitle?: string;
    children?: ReactNode; // Right-side widgets/buttons
    titleContent?: ReactNode; // Custom content to replace title/subtitle (for Dashboard)
}

/**
 * Standard header for all views
 * Can be used in two modes:
 * 
 * 1. Simple mode (default):
 *    <ViewHeader icon={Icon} title="Title" subtitle="Description" />
 * 
 * 2. Custom mode (for Dashboard):
 *    <ViewHeader icon={Icon} titleContent={<CustomDashboardHeader />} />
 * 
 * Right-side widgets via children:
 *    <ViewHeader icon={Icon} title="Title">
 *      <Widget1 />
 *      <Widget2 />
 *    </ViewHeader>
 */
export const ViewHeader: React.FC<ViewHeaderProps> = ({ icon: Icon, title, subtitle, titleContent, children }) => {
    return (
        <div
            className="p-4 border-b flex justify-between items-center gap-4 h-[72px]"
            style={{ backgroundColor: 'var(--elevated)', borderColor: 'var(--border)' }}
        >
            <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded shrink-0" style={{ backgroundColor: 'rgb(from var(--accent) r g b / 0.2)' }}>
                    <Icon style={{ color: 'var(--accent)' }} size={20} />
                </div>
                
                {titleContent ? (
                    // Custom content mode (for Dashboard)
                    <div className="flex-1 overflow-hidden">
                        {titleContent}
                    </div>
                ) : (
                    // Simple mode
                    <div className="overflow-hidden">
                        <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                        {subtitle && <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
                    </div>
                )}
            </div>

            {children && (
                <div className="flex items-center gap-4 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
};
