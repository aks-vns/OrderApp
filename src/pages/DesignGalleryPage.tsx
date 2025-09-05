import { useEffect, useState } from 'react';
import type { aks_designmasters } from '../generated/models/aks_designmastersModel';
import { aks_designmastersService } from '../generated/services/aks_designmastersService';

export const DesignGalleryPage = () => {
    const [designs, setDesigns] = useState<aks_designmasters[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        'aks_designcode'
                    ]
                });
                
                if (response.data) {
                    setDesigns(response.data);
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

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading designs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Design Masters ({designs.length} designs found)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Design No</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Supplier ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Parent Design</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Item Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Design Code</th>
                    </tr>
                </thead>
                <tbody>
                    {designs.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                No designs found
                            </td>
                        </tr>
                    ) : (
                        designs.map((design) => (
                            <tr key={design.aks_designmasterid} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {design.aks_designno || '-'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {design.aks_supplieridname || design.aks_supplierid || '-'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {design.aks_parentdesign || '-'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {design.aks_itemname || '-'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {design.aks_designcode || '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
