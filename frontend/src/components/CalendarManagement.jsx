import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Header } from './Header';
import { BackgroundBlobs } from './BackgroundBlobs';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const STATUS_OPTIONS = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_COLORS = {
  'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const CalendarManagement = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventTask: '',
    date: '',
    time: '',
    location: '',
    status: 'Upcoming'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/event/items`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (event = null) => {
    if (event) {
      setIsEditMode(true);
      setCurrentEvent(event);
      setFormData({
        eventTask: event.eventTask,
        date: event.date,
        time: event.time,
        location: event.location,
        status: event.status || 'Upcoming'
      });
    } else {
      setIsEditMode(false);
      setCurrentEvent(null);
      setFormData({
        eventTask: '',
        date: '',
        time: '',
        location: '',
        status: 'Upcoming'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEvent(null);
    setFormData({
      eventTask: '',
      date: '',
      time: '',
      location: '',
      status: 'Upcoming'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.eventTask || !formData.date || !formData.time || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`${BACKEND_URL}/api/event/items/${currentEvent.row_index}`, formData);
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/event/items`, formData);
        toast.success('Event added successfully');
      }
      
      handleCloseDialog();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} event`);
    }
  };

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.eventTask}"?`)) {
      try {
        await axios.delete(`${BACKEND_URL}/api/event/items/${event.row_index}`);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.eventTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || event.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                    Calendar Management
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your events and schedules
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                    data-testid="search-events-input"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]" data-testid="filter-status-select">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600"
                  data-testid="add-event-btn"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              {/* Events List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              ) : sortedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'All' ? 'No events found matching your filters' : 'No events yet. Add your first event!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4" data-testid="events-list">
                  {sortedEvents.map((event) => (
                    <Card 
                      key={event.row_index} 
                      className="group hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-card/50"
                      data-testid={`event-card-${event.row_index}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{event.eventTask}</h3>
                                <Badge className={STATUS_COLORS[event.status] || STATUS_COLORS['Upcoming']}>
                                  {event.status}
                                </Badge>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleOpenDialog(event)}
                                  data-testid={`edit-event-${event.row_index}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(event)}
                                  data-testid={`delete-event-${event.row_index}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
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
        <DialogContent className="sm:max-w-[500px]" data-testid="event-dialog">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventTask">Event/Task *</Label>
              <Input
                id="eventTask"
                name="eventTask"
                value={formData.eventTask}
                onChange={handleInputChange}
                placeholder="e.g., Earthquake Drill"
                required
                data-testid="event-name-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  data-testid="event-date-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  data-testid="event-time-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Municipal Hall Grounds"
                required
                data-testid="event-location-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger data-testid="event-status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-testid="cancel-event-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600"
                data-testid="save-event-btn"
              >
                {isEditMode ? 'Update' : 'Add'} Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarManagement;
