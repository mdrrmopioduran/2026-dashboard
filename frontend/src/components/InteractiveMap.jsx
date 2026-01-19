import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl, useMapEvents } from 'react-leaflet';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2,
  Navigation,
  Ruler,
  Pencil,
  MapPin,
  Circle,
  Square,
  Trash2,
  Download,
  Upload,
  Layers,
  Search,
  Target,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Pio Duran, Albay, Philippines coordinates
const PIO_DURAN_CENTER = [13.0667, 123.4667];
const DEFAULT_ZOOM = 13;

// Map Controls Component
const MapControls = ({ 
  isFullscreen, 
  onToggleFullscreen, 
  onLocate,
  activeTool,
  onToolSelect,
  isDarkMode,
  onClearAll,
  onExport,
  onImport
}) => {
  const tools = [
    { id: 'marker', icon: MapPin, label: 'Add Marker', gradient: 'from-blue-500 to-blue-600' },
    { id: 'polyline', icon: Pencil, label: 'Draw Line', gradient: 'from-green-500 to-green-600' },
    { id: 'polygon', icon: Square, label: 'Draw Polygon', gradient: 'from-purple-500 to-purple-600' },
    { id: 'circle', icon: Circle, label: 'Draw Circle', gradient: 'from-pink-500 to-pink-600' },
    { id: 'ruler', icon: Ruler, label: 'Measure', gradient: 'from-orange-500 to-orange-600' },
  ];

  return (
    <>
      {/* Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start gap-4">
        {/* Left Controls */}
        <div className="flex gap-2">
          {/* Drawing Tools */}
          <div className="glass-effect rounded-2xl p-2 shadow-2xl border border-white/20">
            <div className="flex gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={`group relative p-3 rounded-xl transition-all duration-300 ${
                      activeTool === tool.id
                        ? `bg-gradient-to-br ${tool.gradient} text-white shadow-lg scale-105`
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70'
                    }`}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Tools */}
          <div className="glass-effect rounded-2xl p-2 shadow-2xl border border-white/20">
            <div className="flex gap-2">
              <button
                onClick={onClearAll}
                className="group relative p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-red-500 hover:text-white transition-all duration-300"
                title="Clear All"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onExport}
                className="group relative p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-green-500 hover:text-white transition-all duration-300"
                title="Export Map"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onImport}
                className="group relative p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-blue-500 hover:text-white transition-all duration-300"
                title="Import Data"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex gap-2">
          {/* Location Control */}
          <button
            onClick={onLocate}
            className="glass-effect rounded-xl p-3 shadow-2xl border border-white/20 bg-white/50 dark:bg-gray-800/50 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-cyan-600 hover:text-white transition-all duration-300"
            title="Find My Location"
          >
            <Target className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="glass-effect rounded-xl p-3 shadow-2xl border border-white/20 bg-white/50 dark:bg-gray-800/50 hover:bg-gradient-to-br hover:from-purple-500 hover:to-purple-600 hover:text-white transition-all duration-300"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
};

// Coordinate Display Component
const CoordinateDisplay = () => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    mousemove: (e) => {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <div className="absolute bottom-4 left-4 z-[1000] glass-effect rounded-xl px-4 py-2 shadow-xl border border-white/20">
      <div className="flex items-center gap-3 text-sm">
        <Info className="w-4 h-4 text-cyan-500" />
        <span className="font-mono">
          Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        </span>
      </div>
    </div>
  ) : null;
};

// Drawing Layer Component
const DrawingLayer = ({ activeTool, onDrawn }) => {
  const map = useMap();
  const drawnItemsRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Initialize FeatureGroup for drawn items
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    const drawnItems = drawnItemsRef.current;

    // Remove existing draw controls
    map.eachLayer((layer) => {
      if (layer instanceof L.Control.Draw) {
        map.removeControl(layer);
      }
    });

    // Add draw control based on active tool
    if (activeTool) {
      const drawOptions = {
        position: 'topright',
        draw: {
          polyline: activeTool === 'polyline' ? {
            shapeOptions: {
              color: '#3b82f6',
              weight: 4
            }
          } : false,
          polygon: activeTool === 'polygon' ? {
            shapeOptions: {
              color: '#8b5cf6',
              fillOpacity: 0.3
            }
          } : false,
          circle: activeTool === 'circle' ? {
            shapeOptions: {
              color: '#ec4899',
              fillOpacity: 0.3
            }
          } : false,
          rectangle: activeTool === 'rectangle' ? {
            shapeOptions: {
              color: '#f59e0b',
              fillOpacity: 0.3
            }
          } : false,
          marker: activeTool === 'marker' ? true : false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true
        }
      };

      const drawControl = new L.Control.Draw(drawOptions);
      map.addControl(drawControl);
    }

    // Event handlers
    const onDrawCreated = (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      
      // Calculate area or length if applicable
      if (e.layerType === 'polygon') {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const areaInSqMeters = area.toFixed(2);
        const areaInHectares = (area / 10000).toFixed(4);
        layer.bindPopup(`Area: ${areaInSqMeters} m² (${areaInHectares} hectares)`);
        toast.success(`Polygon drawn! Area: ${areaInSqMeters} m²`);
      } else if (e.layerType === 'polyline') {
        const latlngs = layer.getLatLngs();
        let distance = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          distance += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        const distanceInMeters = distance.toFixed(2);
        const distanceInKm = (distance / 1000).toFixed(2);
        layer.bindPopup(`Distance: ${distanceInMeters} m (${distanceInKm} km)`);
        toast.success(`Line drawn! Distance: ${distanceInKm} km`);
      } else if (e.layerType === 'circle') {
        const radius = layer.getRadius();
        const area = Math.PI * radius * radius;
        layer.bindPopup(`Radius: ${radius.toFixed(2)} m\nArea: ${area.toFixed(2)} m²`);
        toast.success(`Circle drawn! Radius: ${radius.toFixed(2)} m`);
      }
      
      onDrawn?.(e);
    };

    const onDrawDeleted = (e) => {
      toast.info('Shapes deleted');
    };

    map.on(L.Draw.Event.CREATED, onDrawCreated);
    map.on(L.Draw.Event.DELETED, onDrawDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated);
      map.off(L.Draw.Event.DELETED, onDrawDeleted);
    };
  }, [map, activeTool, onDrawn]);

  return null;
};

// Search Control Component
const SearchControl = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        onSearch({ lat: parseFloat(result.lat), lng: parseFloat(result.lon), name: result.display_name });
        toast.success(`Found: ${result.display_name}`);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="absolute top-20 left-4 right-4 z-[1000] max-w-md">
      <form onSubmit={handleSearch} className="glass-effect rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center p-2 gap-2">
          <Search className="w-5 h-5 text-gray-500 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location (e.g., Pio Duran, Albay)..."
            className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-sm"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Map Movement Handler
const MapMovementHandler = ({ searchResult }) => {
  const map = useMap();

  useEffect(() => {
    if (searchResult) {
      map.setView([searchResult.lat, searchResult.lng], 15, {
        animate: true,
        duration: 1
      });
    }
  }, [searchResult, map]);

  return null;
};

// Main Interactive Map Component
export const InteractiveMap = ({ onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.dismiss();
          setSearchResult({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Location'
          });
          toast.success('Location found!');
        },
        (error) => {
          toast.dismiss();
          toast.error('Could not get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleToolSelect = (toolId) => {
    setActiveTool(activeTool === toolId ? null : toolId);
    if (activeTool !== toolId) {
      toast.info(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} tool activated`);
    }
  };

  const handleClearAll = () => {
    toast.success('All drawings cleared');
    window.location.reload(); // Simple way to clear, can be improved
  };

  const handleExport = () => {
    toast.success('Exporting map data...');
    // Implement export functionality
  };

  const handleImport = () => {
    toast.info('Import functionality coming soon');
    // Implement import functionality
  };

  const handleSearch = (result) => {
    setSearchResult(result);
  };

  return (
    <div 
      ref={mapContainerRef}
      className="relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1001] glass-effect-dark border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Interactive Map</h1>
              <p className="text-sm text-white/70">Pio Duran, Albay - Advanced Mapping Tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-effect rounded-xl px-4 py-2 border border-white/20">
              <span className="text-sm text-white font-medium">OpenStreetMap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 pt-[72px]">
        <MapContainer
          center={PIO_DURAN_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Topographic">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Drawing Layer */}
          <DrawingLayer activeTool={activeTool} />

          {/* Coordinate Display */}
          <CoordinateDisplay />

          {/* Map Movement Handler */}
          <MapMovementHandler searchResult={searchResult} />

          {/* Search Result Marker */}
          {searchResult && (
            <Marker position={[searchResult.lat, searchResult.lng]}>
              <Popup>{searchResult.name}</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Controls */}
        <MapControls
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onLocate={handleLocate}
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          isDarkMode={isDarkMode}
          onClearAll={handleClearAll}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* Search Control */}
        <SearchControl onSearch={handleSearch} />

        {/* Legend/Info Panel */}
        <div className="absolute bottom-4 right-4 z-[1000] glass-effect rounded-2xl p-4 shadow-2xl border border-white/20 max-w-xs">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500" />
            Map Tools Guide
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <span>Marker - Add location pins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
              <span>Line - Draw paths & measure distance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <span>Polygon - Draw areas & measure size</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600"></div>
              <span>Circle - Draw circular regions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <span>Ruler - Measure distances</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
