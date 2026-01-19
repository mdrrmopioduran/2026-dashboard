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
  Circle as CircleIcon,
  Square as SquareIcon,
  Trash2,
  Download,
  Upload,
  Layers,
  Search,
  Target,
  Info,
  Settings,
  Menu
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
    { id: 'marker', icon: MapPin, label: 'Marker', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'polyline', icon: Pencil, label: 'Line', gradient: 'from-emerald-500 to-green-500' },
    { id: 'polygon', icon: SquareIcon, label: 'Polygon', gradient: 'from-violet-500 to-purple-500' },
    { id: 'circle', icon: CircleIcon, label: 'Circle', gradient: 'from-pink-500 to-rose-500' },
    { id: 'ruler', icon: Ruler, label: 'Measure', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <>
      {/* Floating Toolbar - Left Side */}
      <div className="absolute top-24 left-4 z-[1000] flex flex-col gap-4">
        {/* Drawing Tools Dock */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/20 flex flex-col gap-2 transition-all duration-300 hover:bg-black/90 hover:border-white/30 hover:scale-105">
          <div className="text-[10px] uppercase text-gray-400 font-bold text-center py-1 border-b border-white/10 mb-1 tracking-wider">
            Tools
          </div>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`group relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? `bg-gradient-to-br ${tool.gradient} text-white shadow-lg ring-2 ring-white/20`
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
                  {tool.label}
                  {/* Arrow */}
                  <div className="absolute top-1/2 right-full -mt-1 -mr-1 border-4 border-transparent border-r-black/90"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Tools */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/20 flex flex-col gap-2">
           <button
            onClick={onClearAll}
            className="group relative p-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
             <div className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
              Clear All
            </div>
          </button>
          <button
            onClick={onExport}
            className="group relative p-3 rounded-xl text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
             <div className="absolute left-full ml-3 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
              Export Data
            </div>
          </button>
        </div>
      </div>

      {/* Floating Toolbar - Right Side */}
      <div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-3">
        {/* Location Control */}
        <button
          onClick={onLocate}
          className="group bg-black/80 backdrop-blur-md rounded-full p-4 shadow-2xl border border-white/20 text-white hover:bg-cyan-600 transition-all duration-300 hover:scale-110"
        >
          <Target className="w-6 h-6" />
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
            My Location
          </div>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="group bg-black/80 backdrop-blur-md rounded-full p-4 shadow-2xl border border-white/20 text-white hover:bg-purple-600 transition-all duration-300 hover:scale-110"
        >
          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </div>
        </button>
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
    <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/20 pointer-events-none">
      <div className="flex items-center gap-3 text-xs text-white/90">
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
        <span className="font-mono tracking-wider">
          {position.lat.toFixed(5)}° N, {position.lng.toFixed(5)}° E
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
              color: '#10b981',
              weight: 4,
              opacity: 0.8
            }
          } : false,
          polygon: activeTool === 'polygon' ? {
            shapeOptions: {
              color: '#8b5cf6',
              fillOpacity: 0.4,
              weight: 2
            }
          } : false,
          circle: activeTool === 'circle' ? {
            shapeOptions: {
              color: '#ec4899',
              fillOpacity: 0.4,
              weight: 2
            }
          } : false,
          rectangle: activeTool === 'rectangle' ? {
            shapeOptions: {
              color: '#f59e0b',
              fillOpacity: 0.4,
              weight: 2
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
        layer.bindPopup(`<div class="p-2"><strong>Area:</strong><br/>${areaInSqMeters} m²<br/>${areaInHectares} hectares</div>`);
        toast.success(`Polygon drawn! Area: ${areaInSqMeters} m²`);
      } else if (e.layerType === 'polyline') {
        const latlngs = layer.getLatLngs();
        let distance = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          distance += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        const distanceInMeters = distance.toFixed(2);
        const distanceInKm = (distance / 1000).toFixed(2);
        layer.bindPopup(`<div class="p-2"><strong>Distance:</strong><br/>${distanceInMeters} m<br/>${distanceInKm} km</div>`);
        toast.success(`Line drawn! Distance: ${distanceInKm} km`);
      } else if (e.layerType === 'circle') {
        const radius = layer.getRadius();
        const area = Math.PI * radius * radius;
        layer.bindPopup(`<div class="p-2"><strong>Circle:</strong><br/>Radius: ${radius.toFixed(2)} m<br/>Area: ${area.toFixed(2)} m²</div>`);
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
    <div className="absolute top-24 right-4 z-[1000] w-72">
      <form onSubmit={handleSearch} className="bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-500/50">
        <div className="flex items-center p-1.5 gap-2">
          <Search className="w-4 h-4 text-cyan-500 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-gray-500"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowLeft className="w-4 h-4 rotate-180" />}
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
      className="relative w-full h-screen bg-gray-900 overflow-hidden"
    >
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1001] bg-gradient-to-b from-black/80 to-transparent p-4 pb-12 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all duration-300 hover:pr-6"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white font-medium opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 overflow-hidden w-0 group-hover:w-auto">Back</span>
            </button>
            <div className="glass-effect-dark px-6 py-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <h1 className="text-xl font-bold text-white tracking-wide">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Interactive</span> Map
              </h1>
              <p className="text-xs text-gray-400 font-mono">Pio Duran, Albay • Geospatial System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-white/80 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={PIO_DURAN_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="bg-gray-900"
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
            <LayersControl.BaseLayer name="Dark Matter">
               <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
              <Popup className="custom-popup">
                <div className="font-semibold">{searchResult.name}</div>
              </Popup>
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
        <div className="absolute bottom-8 right-16 z-[999] bg-black/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 w-48 transition-all duration-300 hover:w-64 group">
          <h3 className="font-bold text-xs text-white mb-3 flex items-center gap-2 uppercase tracking-widest border-b border-white/10 pb-2">
            <Layers className="w-3 h-3 text-cyan-500" />
            Legend
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 group/item">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <span className="text-gray-300 group-hover/item:text-white transition-colors">Markers</span>
            </div>
            <div className="flex items-center gap-3 group/item">
              <div className="w-4 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-gray-300 group-hover/item:text-white transition-colors">Paths</span>
            </div>
            <div className="flex items-center gap-3 group/item">
              <div className="w-3 h-3 border-2 border-violet-500 bg-violet-500/20 rounded-sm"></div>
              <span className="text-gray-300 group-hover/item:text-white transition-colors">Areas</span>
            </div>
            <div className="flex items-center gap-3 group/item">
              <div className="w-3 h-3 border-2 border-pink-500 bg-pink-500/20 rounded-full"></div>
              <span className="text-gray-300 group-hover/item:text-white transition-colors">Zones</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
