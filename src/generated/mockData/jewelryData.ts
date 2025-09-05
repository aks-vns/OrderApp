import type { aks_designmasters } from '../models/aks_designmastersModel';

// Common base properties for all records
const baseDesignMaster = {
  createdbyyominame: 'System User',
  createdonbehalfbyyominame: 'System User',
  modifiedbyyominame: 'System User',
  modifiedonbehalfbyyominame: 'System User',
  ownerid: 'owner-001',
  owneridname: 'System Owner',
  owneridtype: 'systemuser',
  owneridyominame: 'System Owner',
  owningbusinessunitname: 'Default Business Unit',
  statecode: 'active',
  importsequencenumber: 0,  // This is a number type
  versionnumber: 0          // This is a number type
};

// Mock images for jewelry items
const jewelryImages = {
  gentsRing: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&h=400&fit=crop',
  ],
  ladiesRing: [
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616075278439-f57d12a0285f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586878341958-7b613ceb1a54?w=400&h=400&fit=crop',
  ],
  necklace: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586878341958-7b613ceb1a54?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563204424-10735e33ce76?w=400&h=400&fit=crop',
  ],
  earring: [
    'https://images.unsplash.com/photo-1635767798638-3665c3a49269?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583484370773-c1a7ece9d7e4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587367755089-99662e1f6858?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1625820178840-590371432af4?w=400&h=400&fit=crop',
  ],
  bangle: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&h=400&fit=crop',
  ],
  bracelet: [
    'https://images.unsplash.com/photo-1615147442741-7d35a9cd90d5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573405201557-d7a746a7685f?w=400&h=400&fit=crop',
  ]
};

// Create a collection of mock data
export const jewelryMockData: aks_designmasters[] = [
  // Gents Rings
  {
    ...baseDesignMaster,
    aks_designmasterid: '1',
    aks_autonumber: 'AUTO-001',
    aks_designno: 'GR0001',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'GR1',
    aks_itemname: 'Gents Ring',
    aks_designcode: 'GR-AAA-001',
    aks_designimage_url: jewelryImages.gentsRing[0],
    aks_prefix: 'GR',
    importsequencenumber: 1,  // Number type
    aks_itemnameformulabased: 'Gents Ring - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '2',
    aks_autonumber: 'AUTO-002',
    aks_designno: 'GR0002',
    aks_supplierid: 'SUP002',
    aks_supplieridname: 'BBB Gems',
    aks_parentdesign: 'GR1',
    aks_itemname: 'Gents Ring',
    aks_designcode: 'GR-BBB-002',
    aks_designimage_url: jewelryImages.gentsRing[1],
    aks_prefix: 'GR',
    importsequencenumber: 2,  // Number type
    aks_itemnameformulabased: 'Gents Ring - Gold',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '3',
    aks_autonumber: 'AUTO-003',
    aks_designno: 'GR0003',
    aks_supplierid: 'SUP003',
    aks_supplieridname: 'CCC Diamonds',
    aks_parentdesign: 'GR2',
    aks_itemname: 'Gents Ring',
    aks_designcode: 'GR-CCC-003',
    aks_designimage_url: jewelryImages.gentsRing[2],
    aks_prefix: 'GR',
    importsequencenumber: 3,  // Number type
    aks_itemnameformulabased: 'Gents Ring - Platinum',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '4',
    aks_autonumber: 'AUTO-004',
    aks_designno: 'GR0004',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'GR2',
    aks_itemname: 'Gents Ring',
    aks_designcode: 'GR-AAA-004',
    aks_designimage_url: jewelryImages.gentsRing[3],
    aks_prefix: 'GR',
    importsequencenumber: 4,  // Number type
    aks_itemnameformulabased: 'Gents Ring - Silver',
    versionnumber: 1       // Number type
  },
  
  // Ladies Rings
  {
    ...baseDesignMaster,
    aks_designmasterid: '5',
    aks_autonumber: 'AUTO-005',
    aks_designno: 'LR0001',
    aks_supplierid: 'SUP002',
    aks_supplieridname: 'BBB Gems',
    aks_parentdesign: 'LR1',
    aks_itemname: 'Ladies Ring',
    aks_designcode: 'LR-BBB-001',
    aks_designimage_url: jewelryImages.ladiesRing[0],
    aks_prefix: 'LR',
    importsequencenumber: 5,  // Number type
    aks_itemnameformulabased: 'Ladies Ring - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '6',
    aks_autonumber: 'AUTO-006',
    aks_designno: 'LR0002',
    aks_supplierid: 'SUP003',
    aks_supplieridname: 'CCC Diamonds',
    aks_parentdesign: 'LR1',
    aks_itemname: 'Ladies Ring',
    aks_designcode: 'LR-CCC-002',
    aks_designimage_url: jewelryImages.ladiesRing[1],
    aks_prefix: 'LR',
    importsequencenumber: 6,  // Number type
    aks_itemnameformulabased: 'Ladies Ring - Gold',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '7',
    aks_autonumber: 'AUTO-007',
    aks_designno: 'LR0003',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'LR2',
    aks_itemname: 'Ladies Ring',
    aks_designcode: 'LR-AAA-003',
    aks_designimage_url: jewelryImages.ladiesRing[2],
    aks_prefix: 'LR',
    importsequencenumber: 7,  // Number type
    aks_itemnameformulabased: 'Ladies Ring - Ruby',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '8',
    aks_autonumber: 'AUTO-008',
    aks_designno: 'LR0004',
    aks_supplierid: 'SUP002',
    aks_supplieridname: 'BBB Gems',
    aks_parentdesign: 'LR2',
    aks_itemname: 'Ladies Ring',
    aks_designcode: 'LR-BBB-004',
    aks_designimage_url: jewelryImages.ladiesRing[3],
    aks_prefix: 'LR',
    importsequencenumber: 8,  // Number type
    aks_itemnameformulabased: 'Ladies Ring - Sapphire',
    versionnumber: 1       // Number type
  },

  // Necklaces
  {
    ...baseDesignMaster,
    aks_designmasterid: '9',
    aks_autonumber: 'AUTO-009',
    aks_designno: 'NC0001',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'NC1',
    aks_itemname: 'Necklace',
    aks_designcode: 'NC-AAA-001',
    aks_designimage_url: jewelryImages.necklace[0],
    aks_prefix: 'NC',
    importsequencenumber: 9,  // Number type
    aks_itemnameformulabased: 'Necklace - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '10',
    aks_autonumber: 'AUTO-010',
    aks_designno: 'NC0002',
    aks_supplierid: 'SUP003',
    aks_supplieridname: 'CCC Diamonds',
    aks_parentdesign: 'NC1',
    aks_itemname: 'Necklace',
    aks_designcode: 'NC-CCC-002',
    aks_designimage_url: jewelryImages.necklace[1],
    aks_prefix: 'NC',
    importsequencenumber: 10,  // Number type
    aks_itemnameformulabased: 'Necklace - Gold',
    versionnumber: 1       // Number type
  },
  
  // Earrings
  {
    ...baseDesignMaster,
    aks_designmasterid: '11',
    aks_autonumber: 'AUTO-011',
    aks_designno: 'ER0001',
    aks_supplierid: 'SUP002',
    aks_supplieridname: 'BBB Gems',
    aks_parentdesign: 'ER1',
    aks_itemname: 'Earring',
    aks_designcode: 'ER-BBB-001',
    aks_designimage_url: jewelryImages.earring[0],
    aks_prefix: 'ER',
    importsequencenumber: 11,  // Number type
    aks_itemnameformulabased: 'Earring - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '12',
    aks_autonumber: 'AUTO-012',
    aks_designno: 'ER0002',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'ER1',
    aks_itemname: 'Earring',
    aks_designcode: 'ER-AAA-002',
    aks_designimage_url: jewelryImages.earring[1],
    aks_prefix: 'ER',
    importsequencenumber: 12,  // Number type
    aks_itemnameformulabased: 'Earring - Gold',
    versionnumber: 1       // Number type
  },
  
  // Bangles
  {
    ...baseDesignMaster,
    aks_designmasterid: '13',
    aks_autonumber: 'AUTO-013',
    aks_designno: 'BG0001',
    aks_supplierid: 'SUP003',
    aks_supplieridname: 'CCC Diamonds',
    aks_parentdesign: 'BG1',
    aks_itemname: 'Bangle',
    aks_designcode: 'BG-CCC-001',
    aks_designimage_url: jewelryImages.bangle[0],
    aks_prefix: 'BG',
    importsequencenumber: 13,  // Number type
    aks_itemnameformulabased: 'Bangle - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '14',
    aks_autonumber: 'AUTO-014',
    aks_designno: 'BG0002',
    aks_supplierid: 'SUP002',
    aks_supplieridname: 'BBB Gems',
    aks_parentdesign: 'BG1',
    aks_itemname: 'Bangle',
    aks_designcode: 'BG-BBB-002',
    aks_designimage_url: jewelryImages.bangle[1],
    aks_prefix: 'BG',
    importsequencenumber: 14,  // Number type
    aks_itemnameformulabased: 'Bangle - Gold',
    versionnumber: 1       // Number type
  },
  
  // Bracelets
  {
    ...baseDesignMaster,
    aks_designmasterid: '15',
    aks_autonumber: 'AUTO-015',
    aks_designno: 'BR0001',
    aks_supplierid: 'SUP001',
    aks_supplieridname: 'AAA Jewels',
    aks_parentdesign: 'BR1',
    aks_itemname: 'Bracelet',
    aks_designcode: 'BR-AAA-001',
    aks_designimage_url: jewelryImages.bracelet[0],
    aks_prefix: 'BR',
    importsequencenumber: 15,  // Number type
    aks_itemnameformulabased: 'Bracelet - Diamond',
    versionnumber: 1       // Number type
  },
  {
    ...baseDesignMaster,
    aks_designmasterid: '16',
    aks_autonumber: 'AUTO-016',
    aks_designno: 'BR0002',
    aks_supplierid: 'SUP003',
    aks_supplieridname: 'CCC Diamonds',
    aks_parentdesign: 'BR1',
    aks_itemname: 'Bracelet',
    aks_designcode: 'BR-CCC-002',
    aks_designimage_url: jewelryImages.bracelet[1],
    aks_prefix: 'BR',
    importsequencenumber: 16,  // Number type
    aks_itemnameformulabased: 'Bracelet - Gold',
    versionnumber: 1       // Number type
  },
];
