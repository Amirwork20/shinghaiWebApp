import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2 } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose, sizeGuide }) => {
  const [measurementUnit, setMeasurementUnit] = useState('CM');
  const [loading, setLoading] = useState(false);
  const [guideData, setGuideData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSize, setActiveSize] = useState(null);

  useEffect(() => {
    // Reset state when modal is opened
    if (isOpen) {
      setLoading(false);
      setError(null);
      setGuideData(null);
      
      // If no size guide is provided, set an error
      if (!sizeGuide) {
        setError('No size guide available for this product');
        return;
      }

      // If we have the full sizeGuide object already, use it directly
      if (sizeGuide && sizeGuide.name && sizeGuide.measurements) {
        setGuideData(sizeGuide);
        return;
      }

      // If we only have the ID, fetch the data from the API
      const fetchSizeGuide = async () => {
        try {
          setLoading(true);
          
          // Get the ID, whether sizeGuide is an object with _id or just the ID string
          const guideId = sizeGuide._id || sizeGuide;
          
          if (!guideId) {
            setError('Invalid size guide reference');
            setLoading(false);
            return;
          }
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/size-guides/${guideId}`);
          const result = await response.json();
          
          if (result.success) {
            setGuideData(result.data);
          } else {
            setError(result.error || 'Failed to load size guide');
          }
        } catch (err) {
          console.error('Error fetching size guide:', err);
          setError('Failed to load size guide data');
        } finally {
          setLoading(false);
        }
      };

      fetchSizeGuide();
    }
  }, [sizeGuide, isOpen]);

  // If no data or loading, show loading state
  if (!guideData && !error && loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl mx-auto p-4 sm:p-6 bg-white">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-500">Loading size guide...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If error occurred
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl mx-auto p-4 sm:p-6 bg-white">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <p className="text-red-500 mb-2">Error</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If no data available after loading
  if (!guideData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl mx-auto p-4 sm:p-6 bg-white">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <p className="text-gray-600">No size guide data available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Convert CM to inches
  const convertToInches = (cm) => {
    if (!cm) return '';
    
    // Check if value is already a number or needs parsing
    const value = typeof cm === 'number' ? cm : parseFloat(cm);
    
    if (isNaN(value)) return '';
    
    // Convert to inches with appropriate precision
    return (value * 0.393701).toFixed(1);
  };

  // Helper to format displayed values
  const formatDisplayValue = (value, unit) => {
    if (!value && value !== 0) return '';
    
    if (unit === 'IN') {
      // For inches, ensure we have a string with proper formatting
      return `${value}"`;
    }
    
    // For CM, we can return the value as is
    return value;
  };

  // Get available sizes
  const availableSizes = guideData.measurements && guideData.measurements.length > 0 
    ? ['xs', 's', 'm', 'l', 'xl', 'xxl'].filter(size => 
        guideData.measurements.some(m => m.values[size])
      )
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900">
            {guideData.name}
          </DialogTitle>
          {guideData.description && (
            <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
              {guideData.description}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Measurement Toggle */}
          <div className="flex justify-center sm:justify-end border-b border-gray-200 pb-3">
            <div className="inline-flex rounded-lg p-0.5 sm:p-1 bg-indigo-50">
              <button 
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-all duration-200 ${
                  measurementUnit === 'CM' 
                    ? 'bg-indigo-600 shadow-sm text-white' 
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                onClick={() => setMeasurementUnit('CM')}
              >
                CM
              </button>
              <button 
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-all duration-200 ${
                  measurementUnit === 'IN'
                    ? 'bg-indigo-600 shadow-sm text-white'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                onClick={() => setMeasurementUnit('IN')}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Size selection for mobile */}
          <div className="sm:hidden">
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Size
                </label>
                <select
                  id="size-select"
                  value={activeSize || availableSizes[0]}
                  onChange={(e) => setActiveSize(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Size Table - Desktop Version */}
          {guideData.measurements && guideData.measurements.length > 0 ? (
            <div className="hidden sm:block overflow-x-auto rounded-lg border border-indigo-100 shadow-sm">
              <table className="w-full divide-y divide-indigo-200 table-fixed">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/4">Measurements</th>
                    {availableSizes.includes('xs') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">XS</th>
                    )}
                    {availableSizes.includes('s') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">S</th>
                    )}
                    {availableSizes.includes('m') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">M</th>
                    )}
                    {availableSizes.includes('l') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">L</th>
                    )}
                    {availableSizes.includes('xl') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">XL</th>
                    )}
                    {availableSizes.includes('xxl') && (
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/8">XXL</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                  {guideData.measurements.map((measurement, index) => (
                    <tr key={index} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">{measurement.label}</td>
                      {availableSizes.includes('xs') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.xs : convertToInches(measurement.values.xs),
                            measurementUnit
                          )}
                        </td>
                      )}
                      {availableSizes.includes('s') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.s : convertToInches(measurement.values.s),
                            measurementUnit
                          )}
                        </td>
                      )}
                      {availableSizes.includes('m') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.m : convertToInches(measurement.values.m),
                            measurementUnit
                          )}
                        </td>
                      )}
                      {availableSizes.includes('l') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.l : convertToInches(measurement.values.l),
                            measurementUnit
                          )}
                        </td>
                      )}
                      {availableSizes.includes('xl') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.xl : convertToInches(measurement.values.xl),
                            measurementUnit
                          )}
                        </td>
                      )}
                      {availableSizes.includes('xxl') && (
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-indigo-600 tabular-nums">
                          {formatDisplayValue(
                            measurementUnit === 'CM' ? measurement.values.xxl : convertToInches(measurement.values.xxl),
                            measurementUnit
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600">No measurement data available.</p>
          )}

          {/* Mobile Size Table View */}
          {guideData.measurements && guideData.measurements.length > 0 && (
            <div className="sm:hidden rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
              <div className="bg-indigo-50 px-4 py-3">
                <h3 className="text-sm font-medium text-indigo-700 uppercase">
                  {activeSize ? activeSize.toUpperCase() : availableSizes[0].toUpperCase()} Measurements
                </h3>
              </div>
              <div className="divide-y divide-indigo-100">
                {guideData.measurements.map((measurement, index) => {
                  const sizeKey = activeSize || availableSizes[0];
                  const value = measurement.values[sizeKey];
                  
                  return (
                    <div key={index} className="px-4 py-3 flex justify-between items-center hover:bg-indigo-50">
                      <span className="text-sm font-medium text-gray-900 mr-4">{measurement.label}</span>
                      <span className="text-sm text-indigo-600 tabular-nums">
                        {formatDisplayValue(
                          measurementUnit === 'CM' ? value : convertToInches(value),
                          measurementUnit
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size guide help text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Measurements may vary slightly due to manufacturing processes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal; 