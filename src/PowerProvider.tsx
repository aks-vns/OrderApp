import { initialize } from "@pa-client/power-code-sdk/lib/Lifecycle";
import { useEffect, type ReactNode } from "react";

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    useEffect(() => {
        const initApp = async () => {
            try {
                await initialize();
                console.log('Power Platform SDK initialized successfully');
                
                // Apply responsive grid layout for both environments
                const styleTag = document.createElement('style');
                styleTag.innerHTML = `
                    /* Global fixes for all environments */
                    .gridContainer {
                        display: grid !important;
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
                        gap: 1rem !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    @media (min-width: 576px) {
                        .gridContainer {
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
                        }
                    }
                    
                    @media (min-width: 768px) {
                        .gridContainer {
                            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
                        }
                    }
                    
                    @media (min-width: 992px) {
                        .gridContainer {
                            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
                        }
                    }
                    
                    @media (min-width: 1200px) {
                        .gridContainer {
                            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
                        }
                    }
                    
                    @media (min-width: 1600px) {
                        .gridContainer {
                            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
                        }
                    }
                    
                    html, body {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow-x: hidden !important;
                        max-width: 100vw !important;
                    }
                    
                    #root {
                        width: 100vw !important;
                        max-width: 100vw !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow-x: hidden !important;
                    }
                    
                    .App {
                        width: 100% !important;
                        max-width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        padding: 0 1rem !important;
                        box-sizing: border-box !important;
                    }
                    
                    /* Power Platform specific fixes */
                    .powerapps-container {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow-x: hidden !important;
                    }
                    
                    [data-powerappsid] {
                        max-width: 100% !important;
                    }
                    
                    /* Ensure that the image quality remains the same in all themes */
                    img {
                        filter: none !important;
                    }
                `;
                document.head.appendChild(styleTag);
                
                // Add a mutation observer to enforce the grid layout
                // This ensures our styles are applied even if the DOM changes
                const observer = new MutationObserver(() => {
                    const gridContainers = document.querySelectorAll('.gridContainer');
                    
                    gridContainers.forEach(container => {
                        // Apply inline styles as a failsafe
                        (container as HTMLElement).style.display = 'grid';
                        (container as HTMLElement).style.width = '100%';
                        
                        // Apply responsive grid based on current window width
                        if (window.innerWidth >= 1600) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
                        } else if (window.innerWidth >= 1200) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
                        } else if (window.innerWidth >= 992) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
                        } else if (window.innerWidth >= 768) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                        } else {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
                        }
                    });
                });
                
                // Start observing the document for changes
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // Also apply on window resize
                window.addEventListener('resize', () => {
                    const gridContainers = document.querySelectorAll('.gridContainer');
                    
                    gridContainers.forEach(container => {
                        if (window.innerWidth >= 1600) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
                        } else if (window.innerWidth >= 1200) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
                        } else if (window.innerWidth >= 992) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
                        } else if (window.innerWidth >= 768) {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                        } else {
                            (container as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
                        }
                    });
                });
                
            } catch (error) {
                console.error('Failed to initialize Power Platform SDK:', error);
            }
        };
        
        initApp();
    }, []);

    return <>{children}</>;
}