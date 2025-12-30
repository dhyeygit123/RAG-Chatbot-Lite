// ============= src/components/company/QAManagement.jsx =============
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function QAManagement() {
  const [qas, setQas] = useState([]);
  const [filteredQas, setFilteredQas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQA, setEditingQA] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qaToDelete, setQaToDelete] = useState(null);

  

  const categories = ['General', 'Support', 'Billing', 'Pricing', 'Technical', 'Other'];

  useEffect(() => {
    fetchQAs();
  }, []);

  useEffect(() => {
    filterQAs();
  }, [qas, searchQuery, categoryFilter]);

  const fetchQAs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/qa');
      setQas(data.qas || []);
    } catch (error) {
      notify("Error", "Failed to fetch Q&As", true);
    } finally {
      setLoading(false);
    }
  };

  const filterQAs = () => {
    let filtered = [...qas];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(qa =>
        qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(qa => qa.category === categoryFilter);
    }

    setFilteredQas(filtered);
  };

  const handleOpenDialog = (qa = null) => {
    if (qa) {
      setEditingQA(qa);
      setFormData({
        question: qa.question,
        answer: qa.answer,
        category: qa.category
      });
    } else {
      setEditingQA(null);
      setFormData({
        question: '',
        answer: '',
        category: 'General'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQA(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      notify("Validation Error", "Question and answer are required", true);

      return;
    }

    try {
      if (editingQA) {
        // Update existing Q&A
        await api.put(`/qa/${editingQA._id}`, formData);
        notify("Success", "Q&A updated successfully");
      } else {
        // Create new Q&A
        await api.post('/qa', formData);
        notify("Success", "Q&A created successfully");

      }
      
      handleCloseDialog();
      fetchQAs();
    } catch (error) {
      notify("Error", error.response?.data?.message || "Failed to save Q&A", true);

    }
  };

  const handleDeleteClick = (qa) => {
    setQaToDelete(qa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/qa/${qaToDelete._id}`);
      notify("Success", "Q&A deleted successfully");

      setDeleteDialogOpen(false);
      setQaToDelete(null);
      fetchQAs();
    } catch (error) {
      notify("Error", "Failed to delete Q&A", true);
    }
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return qas.length;
    return qas.filter(qa => qa.category === category).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Q&A Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your chatbot's knowledge base with questions and answers
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Q&A
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Q&As</CardDescription>
            <CardTitle className="text-3xl">{qas.length}</CardTitle>
          </CardHeader>
        </Card>
        {categories.slice(0, 3).map(cat => (
          <Card key={cat}>
            <CardHeader className="pb-2">
              <CardDescription>{cat}</CardDescription>
              <CardTitle className="text-3xl">{getCategoryCount(cat)}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search questions and answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories ({qas.length})</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat} ({getCategoryCount(cat)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredQas.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {qas.length === 0 ? 'No Q&As yet' : 'No results found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {qas.length === 0
                  ? 'Start building your chatbot knowledge base by adding Q&As'
                  : 'Try adjusting your search or filters'}
              </p>
              {qas.length === 0 && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Q&A
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Question</TableHead>
                    <TableHead className="w-[40%]">Answer</TableHead>
                    <TableHead className="w-[15%]">Category</TableHead>
                    <TableHead className="w-[15%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQas.map((qa) => (
                    <TableRow key={qa._id}>
                      <TableCell className="font-medium">
                        <div className="line-clamp-2">{qa.question}</div>
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2 text-gray-600">{qa.answer}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {qa.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(qa)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(qa)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingQA ? 'Edit Q&A' : 'Add New Q&A'}
              </DialogTitle>
              <DialogDescription>
                {editingQA
                  ? 'Update the question and answer for your chatbot'
                  : 'Add a new question and answer to your chatbot knowledge base'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Question */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input
                  type="text"
                  placeholder="e.g., What are your business hours?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="e.g., We are open Monday to Friday, 9 AM to 5 PM EST."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQA ? 'Update Q&A' : 'Create Q&A'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Q&A</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Q&A? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {qaToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-medium text-sm">Question:</p>
              <p className="text-sm text-gray-600">{qaToDelete.question}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Note: You'll need to create the missing UI components if they don't exist yet.
// Missing import fix:
import { MessageSquare } from 'lucide-react';

const notify = (title, message, isError = false) => {
  toast(
    <div>
      <div className={`font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`}>
        {title}
      </div>
      <div className="text-sm text-gray-700">{message}</div>
    </div>
  );
};
