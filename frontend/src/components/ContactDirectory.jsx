import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Phone, Mail, User, Briefcase, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { Header } from './Header';

import { BackgroundBlobs } from './BackgroundBlobs';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ContactDirectory = ({ onBack }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    phone: '',
    email: 'N/A'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/contact/items`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setIsEditMode(true);
      setCurrentContact(contact);
      setFormData({
        name: contact.name,
        position: contact.position,
        department: contact.department,
        phone: contact.phone,
        email: contact.email || 'N/A'
      });
    } else {
      setIsEditMode(false);
      setCurrentContact(null);
      setFormData({
        name: '',
        position: '',
        department: '',
        phone: '',
        email: 'N/A'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentContact(null);
    setFormData({
      name: '',
      position: '',
      department: '',
      phone: '',
      email: 'N/A'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.department || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`${BACKEND_URL}/api/contact/items/${currentContact.row_index}`, formData);
        toast.success('Contact updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/contact/items`, formData);
        toast.success('Contact added successfully');
      }
      
      handleCloseDialog();
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} contact`);
    }
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/contact/items/${contact.row_index}`);
        toast.success('Contact deleted successfully');
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
      }
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Contact Directory
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your contact information
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                    data-testid="search-contacts-input"
                  />
                </div>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                  data-testid="add-contact-btn"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>

              {/* Contacts Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading contacts...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No contacts found matching your search' : 'No contacts yet. Add your first contact!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="contacts-grid">
                  {filteredContacts.map((contact) => (
                    <Card 
                      key={contact.row_index} 
                      className="group hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-card/50"
                      data-testid={`contact-card-${contact.row_index}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{contact.position}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(contact)}
                              data-testid={`edit-contact-${contact.row_index}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(contact)}
                              data-testid={`delete-contact-${contact.row_index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{contact.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.email && contact.email !== 'N/A' && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
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
        <DialogContent className="sm:max-w-[500px]" data-testid="contact-dialog">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Contact' : 'Add New Contact'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                data-testid="contact-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Punong Barangay, SB Member"
                required
                data-testid="contact-position-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Brgy. Council - Agol"
                required
                data-testid="contact-department-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 9361562854"
                required
                data-testid="contact-phone-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                data-testid="contact-email-input"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-testid="cancel-contact-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                data-testid="save-contact-btn"
              >
                {isEditMode ? 'Update' : 'Add'} Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactDirectory;
