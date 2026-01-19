import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Package, MapPin, Hash, Tags } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Header } from './Header';
import { BackgroundBlobs } from './BackgroundBlobs';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const SupplyInventory = ({ onBack }) => {
  const [supplies, setSupplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Office-Supplies',
    quantity: '',
    unit: 'Pieces',
    location: 'B1',
    status: 'active'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/supply/items`);
      setSupplies(response.data);
      toast.success(`Loaded ${response.data.length} items successfully!`);
    } catch (error) {
      console.error('Error fetching supplies:', error);
      toast.error('Failed to load supply items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (supply = null) => {
    if (supply) {
      setIsEditMode(true);
      setCurrentSupply(supply);
      setFormData({
        itemName: supply.itemName,
        category: supply.category,
        quantity: supply.quantity,
        unit: supply.unit,
        location: supply.location,
        status: supply.status || 'active'
      });
    } else {
      setIsEditMode(false);
      setCurrentSupply(null);
      setFormData({
        itemName: '',
        category: 'Office-Supplies',
        quantity: '',
        unit: 'Pieces',
        location: 'B1',
        status: 'active'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentSupply(null);
    setFormData({
      itemName: '',
      category: 'Office-Supplies',
      quantity: '',
      unit: 'Pieces',
      location: 'B1',
      status: 'active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`${BACKEND_URL}/api/supply/items/${currentSupply.row_index}`, formData);
        toast.success('Supply item updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/supply/items`, formData);
        toast.success('Supply item added successfully');
      }
      
      handleCloseDialog();
      fetchSupplies();
    } catch (error) {
      console.error('Error saving supply:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} supply item`);
    }
  };

  const handleDelete = async (supply) => {
    if (window.confirm(`Are you sure you want to delete ${supply.itemName}?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/supply/items/${supply.row_index}`);
        toast.success('Supply item deleted successfully');
        fetchSupplies();
      } catch (error) {
        console.error('Error deleting supply:', error);
        toast.error('Failed to delete supply item');
      }
    }
  };

  const filteredSupplies = supplies.filter(supply =>
    supply.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supply.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supply.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (quantity) => {
    const qty = parseInt(quantity);
    if (qty === 0) return 'from-red-400 to-red-500';
    if (qty < 5) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  // Get status text
  const getStatusText = (quantity) => {
    const qty = parseInt(quantity);
    if (qty === 0) return 'Out of Stock';
    if (qty < 5) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <BackgroundBlobs />
      <div className="relative z-10 min-h-screen flex">
        <div className="flex-1 flex flex-col">
          <Header 
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  onClick={onBack}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  data-testid="back-to-dashboard-btn"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Supply Inventory
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage supplies and inventory
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search supplies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                    data-testid="search-supplies-input"
                  />
                </div>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                  data-testid="add-supply-btn"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supply
                </Button>
              </div>

              {/* Supplies Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading supplies...</p>
                </div>
              ) : filteredSupplies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No supplies found matching your search' : 'No supplies yet. Add your first supply item!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="supplies-grid">
                  {filteredSupplies.map((supply) => (
                    <Card 
                      key={supply.row_index} 
                      className="group hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-card/50"
                      data-testid={`supply-card-${supply.row_index}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${getStatusColor(supply.quantity)} flex items-center justify-center text-white font-bold text-lg`}>
                              <Package className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{supply.itemName}</CardTitle>
                              <p className="text-sm text-muted-foreground">{supply.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(supply)}
                              data-testid={`edit-supply-${supply.row_index}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(supply)}
                              data-testid={`delete-supply-${supply.row_index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-lg">{supply.quantity}</span>
                            <span className="text-muted-foreground">{supply.unit}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor(supply.quantity)} text-white font-medium`}>
                            {getStatusText(supply.quantity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location: {supply.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Tags className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{supply.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" data-testid="supply-dialog">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Supply Item' : 'Add New Supply Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                  data-testid="input-itemName"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office-Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Safety">Safety Equipment</SelectItem>
                    <SelectItem value="Medical">Medical Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    data-testid="input-quantity"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => handleSelectChange('unit', value)}
                  >
                    <SelectTrigger data-testid="select-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pieces">Pieces</SelectItem>
                      <SelectItem value="Boxes">Boxes</SelectItem>
                      <SelectItem value="Packs">Packs</SelectItem>
                      <SelectItem value="Sets">Sets</SelectItem>
                      <SelectItem value="Units">Units</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., B1, Warehouse A"
                  data-testid="input-location"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseDialog}
                data-testid="cancel-btn"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                data-testid="submit-btn"
              >
                {isEditMode ? 'Update' : 'Add'} Supply
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplyInventory;
