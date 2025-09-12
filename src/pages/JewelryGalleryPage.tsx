import { useEffect, useState, useRef } from 'react';
import { 
  makeStyles, 
  shorthands, 
  Card, 
  CardHeader, 
  CardPreview,
  Text,
  Body1,
  Caption1,
  Button,
  Input,
  Label,
  tokens,
  Subtitle2,
  Divider,
  Checkbox,
  Tooltip,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  DrawerBody,
  DrawerHeader,
  Drawer,
  DrawerFooter
} from '@fluentui/react-components';
import { FilterRegular, ArrowUpRegular, DismissRegular, CheckmarkCircleFilled } from '@fluentui/react-icons';
import type { aks_designmasters } from '../generated/models/aks_designmastersModel';
import { aks_designmastersService } from '../generated/services/aks_designmastersService';
import jsPDF from 'jspdf';
import './JewelryGalleryStyles.css';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    ...shorthands.padding('0.5rem', '0', '1rem', '0'),
    ...shorthands.margin('0'),
    boxSizing: 'border-box',
    flexGrow: 1,
  },
  scrollableContent: {
    flex: '1 1 auto',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    paddingBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  filterContainer: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'block',
      width: '280px',
      flex: '0 0 280px',
      position: 'sticky',
      top: '1rem',
      alignSelf: 'flex-start',
    }
  },
  layoutWrapper: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  sidebar: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'block',
      width: '280px',
      flex: '0 0 280px',
    }
  },
  mainContent: {
    flex: '1 1 auto',
  },
  modernFilterButton: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    borderRadius: '24px',
    border: 'none',
    padding: '10px 18px',
    boxShadow: tokens.shadow4,
    marginBottom: '1rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'background 0.2s',
    ':hover': {
      background: tokens.colorNeutralBackground2,
    },
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  },
  floatingArrow: {
    position: 'fixed',
    right: '32px',
    bottom: '32px',
    zIndex: 100,
    background: 'rgba(128,128,128,0.85)',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: tokens.shadow16,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  filterButtonMobile: {
    display: 'none',
    '@media (max-width: 600px)': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: tokens.colorPaletteRedBackground1,
      color: tokens.colorNeutralForegroundOnBrand,
      borderRadius: '8px',
      border: 'none',
      padding: '8px',
      boxShadow: tokens.shadow4,
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'background 0.2s',
      ':hover': {
        background: tokens.colorPaletteRedBackground2,
      },
    },
  },
  drawerFilterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
  },
  filterItem: {
    minWidth: '200px',
    maxWidth: '300px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      maxWidth: '100%',
      marginBottom: '0.5rem',
    },
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    ...shorthands.gap('1rem'),
    width: '100%',
    margin: '0',
    padding: '0',
    '@media (min-width: 576px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    },
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    },
    '@media (min-width: 992px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    },
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    },
    '@media (min-width: 1600px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
  card: {
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  cardCheckbox: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    zIndex: 10,
    padding: '0.25rem',
    transition: 'all 0.2s ease-in-out',
    transform: 'scale(1.2)',
    ':hover': {
      transform: 'scale(1.25)',
    },
  },
  pdfButton: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardHeader: {
    marginBottom: '.5rem',
  },
  preview: {
    minHeight: '150px',
    maxHeight: '220px',
    objectFit: 'cover',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    '@media (min-width: 1600px)': {
      minHeight: '180px',
      maxHeight: '250px',
    },
    '@media (max-width: 768px)': {
      minHeight: '140px',
      maxHeight: '200px',
    },
    '@media (max-width: 480px)': {
      minHeight: '130px',
      maxHeight: '180px',
    },
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('.15rem'),
    ...shorthands.padding('0.35rem'),
    flexGrow: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontWeight: '600',
    color: tokens.colorNeutralForeground3,
  },
  detailValue: {
    textAlign: 'right',
    fontWeight: '400',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem',
  },
  errorContainer: {
    ...shorthands.padding('1rem'),
    color: tokens.colorPaletteRedForeground1,
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginBottom: '1rem',
  },
  appliedFiltersContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap('0.5rem'),
    marginBottom: '1rem',
  },
  filterTag: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('0.25rem'),
    ...shorthands.padding('0.25rem', '0.5rem'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground3,
    maxWidth: '300px',
  },
  filterTagText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  filterTagIcon: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.25rem',
    ':hover': {
      color: tokens.colorPaletteRedForeground1,
    }
  }
});

export const JewelryGalleryPage = () => {
  // ...existing code...
  const [showArrow, setShowArrow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const styles = useStyles();
  const [designs, setDesigns] = useState<aks_designmasters[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<aks_designmasters[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<Set<string>>(new Set());
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfSuccessDialogOpen, setPdfSuccessDialogOpen] = useState(false);
  const [pdfGeneratedCount, setPdfGeneratedCount] = useState(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Image popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState<string | null>(null);
  const [popupDesignNo, setPopupDesignNo] = useState<string | null>(null);
  const handleImageClick = (imgUrl: string | null, designNo?: string | null) => {
    if (imgUrl) {
      setPopupImageUrl(imgUrl);
      setPopupDesignNo(designNo || null);
      setPopupOpen(true);
    }
  };
  const handlePopupClose = () => {
    setPopupOpen(false);
    setPopupImageUrl(null);
    setPopupDesignNo(null);
  };

  // Get unique categories for filter dropdown

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await aks_designmastersService.getAll({
          select: [
            'aks_designmasterid',
            'aks_designno',
            'aks_supplierid',
            'aks_supplieridname',
            'aks_parentdesign',
            'aks_itemname',
            'aks_designcode',
            'aks_designimage_url'
          ]
        });
        
        if (response.data) {
          setDesigns(response.data);
          setFilteredDesigns(response.data);
        } else if (response.error) {
          setError(response.error.message);
        } else {
          setError('No designs found');
        }
      } catch (err) {
        console.error('Error fetching designs:', err);
        setError('Failed to load design masters');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  // Apply filters when filter values change
  useEffect(() => {
    let result = designs;
    
    if (categoryFilter) {
      result = result.filter(design => design.aks_itemname === categoryFilter);
    }
    
    if (supplierFilter) {
      result = result.filter(design => design.aks_supplieridname === supplierFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(design => 
        design.aks_designno?.toLowerCase().includes(query) ||
        design.aks_parentdesign?.toLowerCase().includes(query) ||
        design.aks_designcode?.toLowerCase().includes(query)
      );
    }
    
    setFilteredDesigns(result);
  }, [categoryFilter, searchQuery, supplierFilter, designs]);

  const handleClearFilters = () => {
    setCategoryFilter('');
    setSearchQuery('');
    setSupplierFilter('');
  };

  const handleRemoveCategoryFilter = () => {
    setCategoryFilter('');
  };

  const handleRemoveSupplierFilter = () => {
    setSupplierFilter('');
  };

  const handleRemoveSearchFilter = () => {
    setSearchQuery('');
  };

  const toggleDesignSelection = (designId: string) => {
    setSelectedDesigns(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(designId)) {
        newSelected.delete(designId);
      } else {
        newSelected.add(designId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedDesigns.size === filteredDesigns.length) {
      // Deselect all if all are currently selected
      setSelectedDesigns(new Set());
    } else {
      // Select all filtered designs
      const allIds = filteredDesigns.map(design => design.aks_designmasterid).filter(Boolean) as string[];
      setSelectedDesigns(new Set(allIds));
    }
  };

  const generatePDF = async () => {
    if (selectedDesigns.size === 0) {
      alert('Please select at least one design');
      return;
    }

    setGeneratingPdf(true);

    try {
      // Create new PDF document - using portrait orientation
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Filter designs to only include selected ones
      const selectedDesignsArray = filteredDesigns.filter(
        design => design.aks_designmasterid && selectedDesigns.has(design.aks_designmasterid)
      );

      // Define layout dimensions for two-column format
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;
      const colWidth = (pageWidth - margin * 3) / 2; // Width of each column
      
      // Fixed layout to always fit 6 designs per page (3 per column)
      const footerSpace = 15; // Space for footer from bottom of page
      const availableHeight = pageHeight - margin - footerSpace; // Available height for content
      const cardVerticalSpacing = 5; // Reduced spacing between cards vertically
      
      // Calculate card height to fit exactly 3 cards per column with spacing
      const designHeight = (availableHeight - (2 * cardVerticalSpacing)) / 3;
      
      const cardPadding = 4; // Internal padding of each card
      
      // Always 6 designs per page (3 designs per column, 2 columns)
      const designsPerPage = 6;
      
      // Generate pages with 6 designs per page
      const totalPages = Math.ceil(selectedDesignsArray.length / designsPerPage);
      
      // Add a light gray background fill function
      const drawCardBackground = (x: number, y: number, width: number, height: number, radius: number) => {
        // Draw rounded rectangle with border
        pdf.setDrawColor(180, 180, 180); // Light gray border
        pdf.setFillColor(252, 252, 252); // Very light gray background
        pdf.setLineWidth(0.5);
        
        // Draw rounded rectangle
        pdf.roundedRect(x, y, width, height, radius, radius, 'FD'); // Fill and Draw
      };
      
      // Draw divider line
      const drawDividerLine = (x: number, y: number, width: number) => {
        pdf.setDrawColor(220, 220, 220); // Light gray line
        pdf.setLineWidth(0.2);
        pdf.line(x, y, x + width, y);
      };

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        // Only add a new page after the first page
        if (pageIndex > 0) {
          pdf.addPage();
        }
        
        // Process designs for this page - always 6 designs per page
        for (let i = 0; i < designsPerPage; i++) {
          const designIndex = pageIndex * designsPerPage + i;
          
          // Break if we've processed all designs
          if (designIndex >= selectedDesignsArray.length) break;
          
          const design = selectedDesignsArray[designIndex];
          
          // Determine position (left or right column)
          const isRightColumn = i >= 3; // Fixed value since we always have 3 designs per column
          const xPos = isRightColumn ? margin * 2 + colWidth : margin;
          
          // Calculate vertical position with more space between cards
          // and ensure it doesn't get too close to the bottom margin
          const yPos = margin + (i % 3) * (designHeight + cardVerticalSpacing); // Use consistent spacing between cards (3 per column)
          
          // Draw the card background with rounded corners
          drawCardBackground(xPos, yPos, colWidth, designHeight, 3);
          
          // Design details - top section header
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(50, 50, 50); // Dark gray for titles
          pdf.text(`Design: ${design.aks_designno || 'Unknown'}`, xPos + cardPadding, yPos + cardPadding + 4);
          
          // Draw divider after the header - extend across the whole card width for cleaner look
          drawDividerLine(xPos + 2, yPos + cardPadding + 6, colWidth - 4);
          
          // Set up for the design info section
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(80, 80, 80); // Medium gray for regular text
          
          // Calculate image area - optimize for smaller card height
          const imageAreaX = xPos + cardPadding;
          const imageAreaY = yPos + cardPadding + 10; // Below header
          const imageAreaWidth = colWidth - (cardPadding * 2);
          const imageAreaHeight = designHeight - 40; // Dynamically calculate image area based on card height
          
          // If there's an image URL, try to add it to the PDF
          if (design.aks_designimage_url) {
            try {
              // Create an image element to load the image
              const img = new Image();
              img.crossOrigin = "Anonymous";  // Handle CORS if needed
              
              // Wait for the image to load
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = design.aks_designimage_url || '';
              });

              // Calculate dimensions to fit the image in the image area
              let imgWidth = imageAreaWidth;
              let imgHeight = (img.height * imgWidth) / img.width;
              
              // If height exceeds max, scale down further
              if (imgHeight > imageAreaHeight) {
                imgHeight = imageAreaHeight;
                imgWidth = (img.width * imgHeight) / img.height;
              }
              
              // Center the image in the image area
              const imgX = imageAreaX + (imageAreaWidth - imgWidth) / 2;
              const imgY = imageAreaY + (imageAreaHeight - imgHeight) / 2;
              
              // Add the image to the PDF
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL('image/jpeg');
              
              pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            } catch (error) {
              console.error('Error loading image for PDF:', error);
              pdf.text('Image could not be loaded', imageAreaX, imageAreaY + 10);
            }
          } else {
            pdf.text('No image available', imageAreaX, imageAreaY + 10);
          }
          
          // Draw divider after the image - extend across the whole card width
          drawDividerLine(xPos + 2, imageAreaY + imageAreaHeight + 2, colWidth - 4);
          
          // Design details section (below image)
          const detailsY = imageAreaY + imageAreaHeight + 6; // Position below image + divider
          
          // Two-column layout for details (similar to the sample image)
          const labelX = xPos + cardPadding + 2;
          const valueX = labelX + 40; // Position values directly after labels
          
          // Design specification rows
          const addDetailRow = (label: string, value: string, rowIndex: number) => {
            // Label in regular weight, aligned left
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(90, 90, 90); // Darker gray for labels
            pdf.text(label, labelX, detailsY + (rowIndex * 5));
            
            // Value in regular weight, aligned left after label
            pdf.setTextColor(0, 0, 0); // Black for values
            pdf.text(value, valueX, detailsY + (rowIndex * 5));
          };
          
          addDetailRow('Category:', design.aks_itemname || 'Unknown', 0);
          addDetailRow('Design Code:', design.aks_designcode || 'Unknown', 1);
          addDetailRow('Supplier:', design.aks_supplieridname || 'Unknown', 2);
        }
        
        // Add footer to each page with clear separation from content
        const today = new Date().toLocaleDateString();
        
        // Add a more visible separator line above the footer
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.3);
        pdf.line(margin, pageHeight - footerSpace + 2, pageWidth - margin, pageHeight - footerSpace + 2);
        
        // Add footer text below the line
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80); // Darker gray for better visibility
        pdf.text(`Generated on: ${today} | Total designs: ${selectedDesignsArray.length}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save PDF
      pdf.save(`jewelry-designs-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
      
      // Show success dialog with the count of designs
      setPdfGeneratedCount(selectedDesignsArray.length);
      setPdfSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Text size={400}>Loading designs...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Text weight="semibold">Error</Text>
          <Text>{error}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Subtitle2 block as="h2">Jewelry Design Gallery</Subtitle2>
      <Divider />
      
      {/* Modern filter button (desktop & mobile) */}
      <button className={styles.modernFilterButton} onClick={() => setFilterDrawerOpen(true)}>
        <FilterRegular style={{ fontSize: 22, marginRight: 8 }} />
        Filter
      </button>
  {/* Desktop fixed sidebar (visible on large screens) */}
  <div className={styles.layoutWrapper}>
  <aside className={styles.sidebar} aria-label="Filters">
        <div style={{ padding: '1rem' }}>
          <Text weight="semibold" size={400}>Filters</Text>
          <div className={styles.drawerFilterContainer} style={{ marginTop: 12 }}>
            <Label>Metal</Label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input type="number" min={0} max={100000} placeholder="0" style={{ width: 80 }} />
              <Input type="number" min={0} max={100000} placeholder="100000" style={{ width: 80 }} />
            </div>
            <Label>Diamond</Label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input type="number" min={0} max={100000} placeholder="0" style={{ width: 80 }} />
              <Input type="number" min={0} max={100000} placeholder="100000" style={{ width: 80 }} />
            </div>
            <Button appearance="primary" style={{ width: 120, marginBottom: 16 }}>FILTER</Button>
            <Label style={{ marginTop: 16, fontWeight: 600 }}>Category</Label>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Array.from(new Set(designs.map((d: aks_designmasters) => d.aks_itemname))).map((category) => {
                if (!category) return null;
                const count = designs.filter((d: aks_designmasters) => d.aks_itemname === category).length;
                const isSelected = categoryFilter === category;
                return (
                  <li key={category} style={{ marginBottom: 4 }}>
                    <Button
                      appearance={isSelected ? 'primary' : 'secondary'}
                      onClick={() => setCategoryFilter(isSelected ? '' : category)}
                      style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', fontWeight: isSelected ? 700 : 400 }}
                    >
                      <span>{category}</span>
                      <span style={{ color: '#888' }}>({count})</span>
                    </Button>
                  </li>
                );
              })}
            </ul>

            <Label style={{ marginTop: 16, fontWeight: 600 }}>Supplier</Label>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Array.from(new Set(designs.map((d: aks_designmasters) => d.aks_supplieridname).filter(Boolean))).map((supplier) => {
                if (!supplier) return null;
                const count = designs.filter((d: aks_designmasters) => d.aks_supplieridname === supplier).length;
                const isSelected = supplierFilter === supplier;
                return (
                  <li key={supplier as string} style={{ marginBottom: 4 }}>
                    <Button
                      appearance={isSelected ? 'primary' : 'secondary'}
                      onClick={() => setSupplierFilter(isSelected ? '' : supplier as string)}
                      style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', fontWeight: isSelected ? 700 : 400 }}
                    >
                      <span>{supplier as string}</span>
                      <span style={{ color: '#888' }}>({count})</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>

    {/* Main content (keeps Drawer inside for mobile) */}
    <div className={styles.mainContent}>
    {/* Modern filter drawer/modal (used on mobile/tablet) */}
    <Drawer open={filterDrawerOpen} position="start" onOpenChange={(_e, data) => setFilterDrawerOpen(data.open)}>
        <DrawerHeader>
          <Text weight="semibold" size={400}>Filters</Text>
        </DrawerHeader>
        <DrawerBody>
          <div className={styles.drawerFilterContainer}>
            {/* Metal and Diamond Range Inputs */}
            <Label>Metal</Label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input type="number" min={0} max={100000} placeholder="0" style={{ width: 80 }} />
              <Input type="number" min={0} max={100000} placeholder="100000" style={{ width: 80 }} />
            </div>
            <Label>Diamond</Label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Input type="number" min={0} max={100000} placeholder="0" style={{ width: 80 }} />
              <Input type="number" min={0} max={100000} placeholder="100000" style={{ width: 80 }} />
            </div>
            <Button appearance="primary" style={{ width: 120, marginBottom: 16 }}>FILTER</Button>
            {/* Category Section */}
            <Label style={{ marginTop: 16, fontWeight: 600 }}>Category</Label>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Array.from(new Set(designs.map((d: aks_designmasters) => d.aks_itemname))).map((category) => {
                if (!category) return null;
                const count = designs.filter((d: aks_designmasters) => d.aks_itemname === category).length;
                const isSelected = categoryFilter === category;
                return (
                  <li key={category} style={{ marginBottom: 4 }}>
                    <Button
                      appearance={isSelected ? 'primary' : 'secondary'}
                      onClick={() => setCategoryFilter(isSelected ? '' : category)}
                      style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', fontWeight: isSelected ? 700 : 400 }}
                    >
                      <span>{category}</span>
                      <span style={{ color: '#888' }}>({count})</span>
                    </Button>
                  </li>
                );
              })}
            </ul>

            {/* Supplier Section */}
            <Label style={{ marginTop: 16, fontWeight: 600 }}>Supplier</Label>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Array.from(new Set(designs.map((d: aks_designmasters) => d.aks_supplieridname).filter(Boolean))).map((supplier) => {
                if (!supplier) return null;
                const count = designs.filter((d: aks_designmasters) => d.aks_supplieridname === supplier).length;
                const isSelected = supplierFilter === supplier;
                return (
                  <li key={supplier as string} style={{ marginBottom: 4 }}>
                    <Button
                      appearance={isSelected ? 'primary' : 'secondary'}
                      onClick={() => setSupplierFilter(isSelected ? '' : supplier as string)}
                      style={{ width: '100%', justifyContent: 'space-between', display: 'flex', alignItems: 'center', fontWeight: isSelected ? 700 : 400 }}
                    >
                      <span>{supplier as string}</span>
                      <span style={{ color: '#888' }}>({count})</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="secondary" onClick={handleClearFilters} style={{ marginRight: 8 }}>
            Clear Filters
          </Button>
          <Button appearance="primary" onClick={() => setFilterDrawerOpen(false)}>
            Apply
          </Button>
        </DrawerFooter>
      </Drawer>
      {/* Floating scroll-to-top arrow */}
      {showArrow && (
        <Tooltip content="Go to top" relationship="label">
          <div className={styles.floatingArrow} onClick={scrollToTop} aria-label="Scroll to top">
            <ArrowUpRegular style={{ fontSize: 32, color: '#fff' }} />
          </div>
        </Tooltip>
      )}

      {/* Applied filters tags */}
      {(categoryFilter || supplierFilter || searchQuery) && (
        <div className={styles.appliedFiltersContainer}>
          <Text>Applied filters:</Text>
          
          {categoryFilter && (
            <Tooltip content="Remove category filter" relationship="label">
              <div className={styles.filterTag}>
                <Text className={styles.filterTagText}>Category: {categoryFilter}</Text>
                <span className={styles.filterTagIcon} onClick={handleRemoveCategoryFilter}>
                  <DismissRegular />
                </span>
              </div>
            </Tooltip>
          )}
          
          {supplierFilter && (
            <Tooltip content="Remove supplier filter" relationship="label">
              <div className={styles.filterTag}>
                <Text className={styles.filterTagText}>Supplier: {supplierFilter}</Text>
                <span className={styles.filterTagIcon} onClick={handleRemoveSupplierFilter}>
                  <DismissRegular />
                </span>
              </div>
            </Tooltip>
          )}
          
          {searchQuery && (
            <Tooltip content="Remove search filter" relationship="label">
              <div className={styles.filterTag}>
                <Text className={styles.filterTagText}>Search: {searchQuery}</Text>
                <span className={styles.filterTagIcon} onClick={handleRemoveSearchFilter}>
                  <DismissRegular />
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      )}
      
      {/* Actions and Selection Container */}
      <div className={styles.actionsContainer}>
        <Body1 block>
          Showing {filteredDesigns.length} of {designs.length} designs
        </Body1>
        
        <div>
          <Button 
            appearance="primary" 
            onClick={handleSelectAll}
          >
            Select All
          </Button>
          
          {selectedDesigns.size > 0 && (
            <Button 
              appearance="secondary" 
              onClick={() => setSelectedDesigns(new Set())}
              style={{ marginLeft: '8px' }}
            >
              Deselect All
            </Button>
          )}
          
          <Tooltip content="Generate PDF of selected designs" relationship="label">
            <Button 
              appearance="primary" 
              className={styles.pdfButton} 
              onClick={generatePDF}
              disabled={selectedDesigns.size === 0 || generatingPdf}
              style={{ marginLeft: '8px' }}
            >
              {generatingPdf ? "Generating..." : `Generate PDF (${selectedDesigns.size})`}
            </Button>
          </Tooltip>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className={styles.scrollableContent}>
        {/* Card Grid */}
        <div className={`${styles.gridContainer} gridContainer`} ref={pdfContainerRef}>
          {filteredDesigns.length === 0 ? (
            <Text>No designs found matching your filters</Text>
          ) : (
            filteredDesigns.map((design) => (
              <Card key={design.aks_designmasterid} className={styles.card}>
                {/* Selection Checkbox */}
                <div className={styles.cardCheckbox}>
                  <Checkbox 
                    checked={design.aks_designmasterid ? selectedDesigns.has(design.aks_designmasterid) : false}
                    onChange={() => design.aks_designmasterid && toggleDesignSelection(design.aks_designmasterid)}
                    aria-label={`Select ${design.aks_designno}`}
                    className="jewelry-design-checkbox"
                  />
                </div>
                
                <CardHeader 
                  className={styles.cardHeader}
                  header={<Text weight="semibold">{design.aks_designno}</Text>} 
                  description={<Caption1>{design.aks_itemname}</Caption1>}
                />
                
                <CardPreview className={styles.preview}>
                  {design.aks_designimage_url ? (
                    <img 
                      src={design.aks_designimage_url} 
                      alt={`${design.aks_designno} design`}
                      className={styles.imageStyle}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(design.aks_designimage_url ?? null, design.aks_designno ?? null)}
                    />
                  ) : (
                    <Text>No Image Available</Text>
                  )}
                </CardPreview>
                
                {/* Only show Design No and Product Name above image; no extra metadata here */}
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* PDF Success Dialog */}
      <Dialog 
        open={pdfSuccessDialogOpen} 
        onOpenChange={(_e, data) => setPdfSuccessDialogOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              PDF Generated Successfully
            </DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <CheckmarkCircleFilled style={{ color: tokens.colorPaletteGreenForeground1, fontSize: '24px' }} />
                <Text size={400} weight="semibold">Your PDF has been downloaded successfully!</Text>
              </div>
              <Text>
                A total of <strong>{pdfGeneratedCount}</strong> design{pdfGeneratedCount !== 1 ? 's' : ''} {pdfGeneratedCount !== 1 ? 'have' : 'has'} been included in the PDF.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={() => setPdfSuccessDialogOpen(false)}>
                OK
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Image Popup Dialog */}
      <Dialog open={popupOpen} onOpenChange={(_e, data) => { if (!data.open) handlePopupClose(); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{popupDesignNo ? popupDesignNo : "Design Image"}</DialogTitle>
            <DialogContent>
              {popupImageUrl && (
                <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                  <img src={popupImageUrl} alt="Design" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              )}
              {/* Show full metadata below image in popup */}
              {popupDesignNo && (
                (() => {
                  const design = designs.find(d => d.aks_designno === popupDesignNo);
                  if (!design) return null;
                  return (
                    <div style={{ marginTop: 8 }}>
                      <div><Text weight="semibold">Product Name:</Text> <Text>{design.aks_itemname || '-'}</Text></div>
                      <div><Text weight="semibold">Design Code:</Text> <Text>{design.aks_designcode || '-'}</Text></div>
                      <div><Text weight="semibold">Supplier:</Text> <Text>{design.aks_supplieridname || '-'}</Text></div>
                      <div><Text weight="semibold">Parent Design:</Text> <Text>{design.aks_parentdesign || '-'}</Text></div>
                    </div>
                  );
                })()
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={handlePopupClose}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
    </div>
    </div>
  );
};
