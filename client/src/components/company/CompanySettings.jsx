import { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Code, 
  Save,
  Copy,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Lock
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { generateEmbedCode } from '../../lib/utils';

export default function CompanySettings() {
  const { user } = useAuth();
  
  const notify = (title, message, isError = false) => {
    toast(
      <div>
        <div className={`font-semibold ${isError ? "text-red-600" : "text-green-600"}`}>
          {title}
        </div>
        <div className="text-sm text-gray-700">{message}</div>
      </div>
    );
  };

  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState(null);
  const [embedKeyCopied, setEmbedKeyCopied] = useState(false);
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);
  const [showEmbedKey, setShowEmbedKey] = useState(false);
  
  const [formData, setFormData] = useState({
    botName: '',
    welcomeMessage: '',
    themeColor: '#3b82f6',
    position: 'right'
  });

  const colorPresets = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/companies/${user.companyId}`);
      setCompany(data.company);
      
      if (data.company.settings) {
        setFormData({
          botName: data.company.settings.botName || '',
          welcomeMessage: data.company.settings.welcomeMessage || '',
          themeColor: data.company.settings.themeColor || '#3b82f6',
          position: data.company.settings.position || 'right'
        });
      }
    } catch (error) {
      notify("Error", "Failed to fetch company settings", true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      await api.put(`/companies/${user.companyId}`, {
        settings: formData
      });

      notify("Success", "Settings saved successfully");

      // Refresh company data
      fetchCompanySettings();
    } catch (error) {
      notify("Error", error.response?.data?.message || "Failed to save settings", true);

    } finally {
      setSaving(false);
    }
  };

  const handleCopyEmbedKey = () => {
    if (company?.embedKey) {
      navigator.clipboard.writeText(company.embedKey);
      setEmbedKeyCopied(true);
      notify("Copied!", "Embed key copied to clipboard");
      setTimeout(() => setEmbedKeyCopied(false), 2000);
    }
  };

  const handleCopyEmbedCode = () => {
    if (company?.embedKey) {
      const code = generateEmbedCode(company.embedKey);
      navigator.clipboard.writeText(code);
      setEmbedCodeCopied(true);
      notify("Copied!", "Embed code copied to clipboard");
      setTimeout(() => setEmbedCodeCopied(false), 2000);
    }
  };

  const handleRegenerateKey = async () => {
    if (!confirm('Are you sure you want to regenerate the embed key? This will break existing widget installations.')) {
      return;
    }

    try {
      await api.post(`/companies/${user.companyId}/regenerate-key`);
      notify("Success", "Embed key regenerated successfully");
      fetchCompanySettings();
    } catch (error) {
      notify("Error", "Failed to regenerate embed key", true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const embedCode = company?.embedKey ? generateEmbedCode(company.embedKey) : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Customize your chatbot appearance and behavior
        </p>
      </div>

      {/* Chatbot Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Chatbot Customization
          </CardTitle>
          <CardDescription>
            Personalize how your chatbot looks and greets users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bot Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Bot Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Support Bot"
              value={formData.botName}
              onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              This name will appear in the chat header
            </p>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Welcome Message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              placeholder="e.g., Hi! How can I help you today?"
              value={formData.welcomeMessage}
              onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              The first message users see when opening the chat
            </p>
          </div>

          {/* Theme Color */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Theme Color
            </label>
            
            {/* Color Presets */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, themeColor: preset.value })}
                  className={`group relative w-full aspect-square rounded-lg border-2 transition-all ${
                    formData.themeColor === preset.value
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                >
                  {formData.themeColor === preset.value && (
                    <CheckCircle className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={formData.themeColor}
                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.themeColor}
                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Choose a preset or enter a custom hex color code
            </p>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Widget Position
            </label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData({ ...formData, position: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Bottom Right</SelectItem>
                <SelectItem value="left">Bottom Left</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Where the chat widget appears on your website
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Preview
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              <div className="max-w-md mx-auto">
                {/* Mock Widget Button */}
                <div className="flex items-end justify-end mb-4">
                  <button
                    className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: formData.themeColor }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>

                {/* Mock Chat Window */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div 
                    className="px-4 py-3 text-white font-medium"
                    style={{ backgroundColor: formData.themeColor }}
                  >
                    {formData.botName || 'Bot Name'}
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-sm text-gray-700">
                        {formData.welcomeMessage || 'Welcome message will appear here'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </CardTitle>
          <CardDescription>
            Add this code to your website to display the chatbot widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Embed Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                Embed Key
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmbedKey(!showEmbedKey)}
                className="text-xs"
              >
                {showEmbedKey ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type={showEmbedKey ? 'text' : 'password'}
                value={company?.embedKey || ''}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={handleCopyEmbedKey}
                className="shrink-0"
              >
                {embedKeyCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Keep this key secure. Anyone with this key can embed your chatbot.
            </p>
          </div>

          {/* Regenerate Key */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Regenerate Embed Key
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This will invalidate the current key and break existing installations
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRegenerateKey}
              className="shrink-0 border-yellow-300 text-yellow-900 hover:bg-yellow-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>

          {/* Full Embed Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Installation Code
            </label>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {embedCode}
              </pre>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyEmbedCode}
                className="absolute top-2 right-2"
              >
                {embedCodeCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Paste this code before the closing &lt;/body&gt; tag on your website
            </p>
          </div>

          {/* Installation Steps */}
          <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Installation Steps:
            </p>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Copy the embed code above</li>
              <li>Open your website's HTML file</li>
              <li>Paste the code before the closing &lt;/body&gt; tag</li>
              <li>Save and deploy your website</li>
              <li>The chatbot widget will appear on your site</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Your company details (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Company Name
              </label>
              <p className="text-sm font-medium text-gray-900">
                {company?.name}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Email
              </label>
              <p className="text-sm font-medium text-gray-900">
                {company?.email}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Status
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                company?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {company?.status}
              </span>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">
                Created
              </label>
              <p className="text-sm font-medium text-gray-900">
                {company?.createdAt && new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}