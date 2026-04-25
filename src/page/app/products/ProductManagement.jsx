import React, { useState, useEffect } from 'react';
import { authAxios } from "../../../config/axios-config";
import api from '../../../api';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaBoxOpen, 
  FaUser, 
  FaArrowRight,
  FaEdit,
  FaSave as FaRegSave,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Modal, Form, Input } from 'semantic-ui-react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY,
  });

  const [mapCenter, setMapCenter] = useState({ lat: 25.185, lng: 55.2651 });
  const [mapZoom, setMapZoom] = useState(10);

  // Form state for location update
  const [locationForm, setLocationForm] = useState({
    address: '',
    phone: '',
    lat: '',
    lng: '',
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await authAxios.get(api.app.admin.searchProducts(searchQuery));
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search products');
    } finally {
      setSearching(false);
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearchResults([]);
    setSearchQuery('');
    
    // Pre-fill form with existing location data if available
    const loc = product.listedProducts?.location || {};
    const lat = parseFloat(loc.lat) || 25.185;
    const lng = parseFloat(loc.lng) || 55.2651;
    
    setLocationForm({
      address: loc.address || '',
      phone: loc.phone || '',
      lat: loc.lat || '',
      lng: loc.lng || '',
    });

    setMapCenter({ lat, lng });
    setMapZoom(loc.lat ? 14 : 10);
  };

  const handleUpdateLocation = async () => {
    setLoading(true);
    try {
      const payload = {
        address: locationForm.address,
        phone: locationForm.phone,
        lat: parseFloat(locationForm.lat) || 0,
        lng: parseFloat(locationForm.lng) || 0,
      };

      const response = await authAxios.patch(api.app.admin.updateProductLocation(selectedProduct.id), payload);
      
      if (response.data.success) {
        toast.success('Product location and contact details updated successfully');
        
        // Update local state
        setSelectedProduct(prev => ({
          ...prev,
          listedProducts: {
            ...prev.listedProducts,
            location: response.data.data
          }
        }));
        
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update product details');
    } finally {
      setLoading(false);
    }
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocationForm(prev => ({ ...prev, lat, lng }));
    
    // Reverse Geocode to get address automatically
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocationForm(prev => ({ ...prev, address: results[0].formatted_address }));
        }
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl animate-in fade-in duration-500 bg-[#1e293b] min-h-screen rounded-3xl shadow-2xl overflow-hidden mt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-[#38bdf8] rounded-full shadow-[0_0_15px_rgba(56,189,248,0.4)]" />
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Product <span className="text-[#38bdf8]">Management</span></h1>
          </div>
          <p className="text-gray-300 font-medium text-sm ml-5">Assign locations and contact details to company-listed products.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-[450px] group">
          <input
            type="text"
            placeholder="Search by Title, Description or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-24 py-4 rounded-2xl border-2 border-white/10 focus:border-[#38bdf8] focus:ring-8 focus:ring-[#38bdf8]/5 outline-none transition-all bg-[#0f172a] text-white placeholder:text-gray-400 shadow-2xl group-hover:border-white/20"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/40 group-focus-within:text-[#38bdf8] transition-colors text-xl" />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0ea5e9] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0284c7] transition-all shadow-lg active:scale-95"
          >
            {searching ? '...' : (
              <span className="flex items-center gap-2">
                Search <FaArrowRight className="text-[10px] text-white" />
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
          {searchResults.map((product) => (
            <div 
              key={product.id}
              onClick={() => selectProduct(product)}
              className="flex items-center gap-5 p-5 bg-[#0f172a] rounded-2xl border-2 border-white/5 shadow-xl hover:shadow-2xl hover:border-[#38bdf8]/30 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 -mr-10 -mt-10 rounded-full group-hover:bg-[#38bdf8]/5 transition-colors" />
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1e293b] flex-shrink-0 border-2 border-white/5 shadow-inner">
                {product.images?.[0] ? (
                  <img src={product.images[0].imageLink} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <FaBoxOpen size={30} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 relative">
                <h3 className="font-black text-[#38bdf8] truncate group-hover:text-white transition-colors text-lg uppercase tracking-tight">{product.title}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2 font-bold uppercase tracking-wider">
                  <FaUser className="text-[#38bdf8]" /> <span className="text-blue-100/70">{product.user?.userName || 'Anonymous'}</span>
                </p>
                <p className="text-[10px] text-blue-200/40 font-mono mt-1 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/10 italic">ID: #{product.id}</p>
              </div>
              <FaArrowRight className="text-gray-500 group-hover:text-[#38bdf8] group-hover:translate-x-1 transition-all text-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Selected Product Details Area */}
      {selectedProduct ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden mb-12">
            <div className="p-8 md:p-10 bg-[#0ea5e9]/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/10 -mr-32 -mt-32 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-8 relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500 isolate">
                   <img src={selectedProduct.images?.[0]?.imageLink} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">{selectedProduct.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] px-3 py-1 bg-[#0ea5e9] text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-sky-500/20">
                      ID #{selectedProduct.id}
                    </span>
                    <span className="text-sm text-gray-300 font-bold flex items-center gap-2">
                       <FaUser className="text-[#38bdf8]" /> {selectedProduct.user?.userName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 isolate">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all border border-white/10 shadow-lg"
                >
                  Change Product
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl transition-all shadow-xl shadow-sky-500/20 flex items-center gap-2 group"
                >
                  <FaEdit className="group-hover:scale-110 transition-transform" /> Edit Details
                </button>
              </div>
            </div>

            {/* Display Current Information */}
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Location Card */}
              <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-[#38bdf8]/10 group-hover:text-[#38bdf8]/20 transition-colors">
                  <FaMapMarkerAlt size={100} />
                </div>
                <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/20 flex items-center justify-center text-[#38bdf8]">
                    <FaMapMarkerAlt />
                  </div>
                  Location Info
                </h3>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[#38bdf8] text-[10px] font-black uppercase tracking-widest mb-1">Company Address</p>
                    <p className="text-white text-lg font-medium leading-relaxed">
                      {selectedProduct.listedProducts?.location?.address || 'No specific address assigned'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[#38bdf8] text-[10px] font-black uppercase tracking-widest mb-1">Latitude</p>
                      <p className="text-white font-mono text-sm">{selectedProduct.listedProducts?.location?.lat || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[#38bdf8] text-[10px] font-black uppercase tracking-widest mb-1">Longitude</p>
                      <p className="text-white font-mono text-sm">{selectedProduct.listedProducts?.location?.lng || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-[#38bdf8]/10 group-hover:text-[#38bdf8]/20 transition-colors">
                  <FaPhoneAlt size={100} />
                </div>
                <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c084fc]/20 flex items-center justify-center text-[#c084fc]">
                    <FaPhoneAlt />
                  </div>
                  Contact Details
                </h3>

                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[#c084fc] text-[10px] font-black uppercase tracking-widest mb-1">Assigned Mobile Number</p>
                    <p className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                       {selectedProduct.listedProducts?.location?.phone || 'Not Assigned'}
                       {selectedProduct.listedProducts?.location?.phone && (
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       )}
                    </p>
                    <p className="text-blue-100/40 text-[10px] mt-2 font-medium">This number will be used for customer WhatsApp and call inquiries.</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-blue-100/40 text-[10px] font-black uppercase tracking-widest mb-1">Original Seller Account Number</p>
                    <p className="text-white/60 text-sm font-bold">{selectedProduct.user?.phone || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !searching && searchQuery === '' && (
        <div className="flex flex-col items-center justify-center py-40 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-[#38bdf8]/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="w-48 h-48 bg-[#0f172a] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#38bdf8] relative border-4 border-white/10 isolate overflow-hidden group backdrop-blur-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:scale-110 transition-transform duration-700" />
               <FaBoxOpen size={80} className="animate-bounce-slow relative z-10 text-[#38bdf8]" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter text-center">Ready to <span className="text-[#38bdf8]">Scale</span> Company Sales?</h2>
          <p className="text-blue-100/40 text-center max-w-lg mt-6 leading-relaxed font-medium text-lg">
            Update product locations and contact details to facilitate customer-company interactions.
          </p>
        </div>
      )}

      {/* Edit Details Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="small"
        className="!rounded-[2.5rem] overflow-hidden !bg-[#0f172a] border-2 border-white/10 shadow-3xl"
      >
        <div className="bg-[#0ea5e9] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -mr-32 -mt-32 rounded-full blur-2xl" />
          <h2 className="text-3xl font-black text-white uppercase tracking-tight relative z-10">Edit Product <span className="text-sky-900/50">Context</span></h2>
          <p className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1 relative z-10">Product ID: #{selectedProduct?.id}</p>
        </div>
        
        <div className="p-8 md:p-10 !bg-[#0f172a]">
          <Form className="inverted">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Form.Field className="col-span-2">
                <label className="!text-[#38bdf8] !font-black !uppercase !tracking-widest !text-[10px] mb-3 block">Display Address (Customer Facing)</label>
                <Input 
                   fluid 
                   placeholder="e.g. Alletre HQ, Downtown Branch..."
                   value={locationForm.address}
                   onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                   className="custom-input"
                />
              </Form.Field>
              <Form.Field className="col-span-2">
                <label className="!text-[#c084fc] !font-black !uppercase !tracking-widest !text-[10px] mb-3 block">Customer Inquiry Mobile</label>
                <div className="relative">
                  <Input 
                    fluid 
                    placeholder="+971 50 XXXXXXX"
                    value={locationForm.phone}
                    onChange={(e) => setLocationForm({...locationForm, phone: e.target.value})}
                    className="custom-input pl-10"
                  />
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </Form.Field>
              
              <Form.Field className="col-span-2">
                <label className="!text-gray-400 !font-black !uppercase !tracking-widest !text-[10px] mb-3 block">Pin Location on Map</label>
                <div className="w-full rounded-2xl overflow-hidden border-2 border-white/5 h-[300px] relative">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      zoom={mapZoom}
                      center={mapCenter}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        styles: darkMapStyles, // Optional: Dark mode map
                      }}
                      onClick={onMapClick}
                    >
                      {locationForm.lat && locationForm.lng && (
                        <Marker 
                          position={{ lat: parseFloat(locationForm.lat), lng: parseFloat(locationForm.lng) }} 
                          animation={window.google?.maps.Animation.DROP}
                        />
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-white/5 text-gray-500 animate-pulse">
                      Loading Map Interface...
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-4 text-[10px] text-blue-100/30 font-mono">
                   <span>LAT: {locationForm.lat || 'Unset'}</span>
                   <span>LNG: {locationForm.lng || 'Unset'}</span>
                </div>
              </Form.Field>
            </div>

            <div className="flex gap-4 pt-10 border-t border-white/5 mt-10">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-blue-100/40 hover:bg-white/5 transition-all border-2 border-white/5"
              >
                Cancel Changes
              </button>
              <button 
                type="button"
                onClick={handleUpdateLocation}
                disabled={loading}
                className={`flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white flex items-center justify-center gap-3 transition-all ${
                  loading ? 'bg-gray-700' : 'bg-[#0ea5e9] hover:bg-[#0284c7] shadow-xl shadow-sky-500/20 active:scale-95'
                }`}
              >
                {loading ? 'Processing...' : <><FaRegSave size={16} /> Save Product Context</>}
              </button>
            </div>
          </Form>
        </div>
      </Modal>

      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .custom-input input {
           background: transparent !important;
           border: 2px solid rgba(255, 255, 255, 0.05) !important;
           border-radius: 1rem !important;
           color: white !important;
           padding: 1rem 1.5rem !important;
           transition: all 0.3s ease !important;
        }
        .custom-input input:focus {
           border-color: #38bdf8 !important;
           background: rgba(255, 255, 255, 0.02) !important;
           box-shadow: 0 0 15px rgba(56, 189, 248, 0.1) !important;
        }
        .custom-input.pl-10 input {
           padding-left: 3rem !important;
        }
      `}</style>
    </div>
  );
};

// Optional: Dark mode styles for the map to match the UI
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b9" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default ProductManagement;
