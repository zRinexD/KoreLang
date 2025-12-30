import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { ViewHeader } from './ViewHeader';

interface ViewLayoutProps {
    icon: LucideIcon;
    title?: string;
    subtitle?: string;
    titleContent?: ReactNode; // Custom content to replace title/subtitle (Dashboard-like)
    headerChildren?: ReactNode; // Extra widgets/buttons in header
    children: ReactNode; // Main content
    footer?: ReactNode; // Optional footer content
}

/**
 * Standard layout wrapper for all views
 * Provides consistent structure: ViewHeader + scrollable content
 * 
 * Usage:
 * <ViewLayout 
 *   icon={BookOpen} 
 *   title="View Name"
 *   subtitle="Description"
 *   headerChildren={<CustomWidget />}
 * >
 *   Your content here
 * </ViewLayout>
 */
export const ViewLayout: React.FC<ViewLayoutProps> = ({ 
    icon, 
    title, 
    subtitle, 
    titleContent,
    headerChildren,
    children,
    footer
}) => {
    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
            <ViewHeader 
                icon={icon} 
                title={title} 
                subtitle={subtitle}
                titleContent={titleContent}
            >
                {headerChildren}
            </ViewHeader>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
            
            {footer && (
                <div className="border-t px-6 py-3" style={{ borderColor: 'var(--border)' }}>
                    {footer}
                </div>
            )}
        </div>
    );
};
