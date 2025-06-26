'use client';
import { useState, useEffect } from 'react';
import { useDashboard } from '../../../contexts/DashboardContext';
import Container from '../../../components/ui/Container';

import axios from 'axios';

const GalleryManager = () => {
  const { userData } = useDashboard();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch galleries only
const fetchGalleries = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/gallery`);
    console.log('Fetched galleries data:', response.data); // <-- Log data here
    if (response.data.success) {
      setGalleries(response.data.data);
    } else {
      console.error('Failed to fetch galleries');
    }
  } catch (error) {
    console.error('Error fetching galleries:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchGalleries();
  }, [userData]);

  return (
    <Container>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Gallery Items</h2>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No galleries found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {gallery.images[0] && (
                  <img
                    src={gallery.images[0].url}
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{gallery.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(gallery.projectDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default GalleryManager;
