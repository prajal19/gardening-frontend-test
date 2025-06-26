'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Palette, Mail, CreditCard, Tool, Save, UploadCloud, ToggleLeft, ToggleRight } from 'lucide-react';

// Placeholder initial settings - in a real app, fetch these from an API
const initialGlobalSettings = {
  platformName: 'GardeningWeb SaaS Platform',
  defaultLanguage: 'en-US',
  defaultTimezone: 'UTC',
  platformLogoUrl: '', // URL to current logo
  platformFaviconUrl: '', // URL to current favicon
  primaryColor: '#34D399', // Default to a green shade
  smtpHost: 'smtp.example.com',
  smtpPort: '587',
  smtpUser: 'noreply@example.com',
  smtpSecure: true,
  paymentGatewayApiKey: 'sk_test_********************abcd',
  paymentGatewayMode: 'test',
  maintenanceMode: false,
};

const SettingSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <div className="flex items-center mb-6">
      {Icon && <Icon size={24} className="mr-3 text-green-500" />}
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, disabled = false, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input 
      type={type} 
      name={name} 
      id={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${disabled ? 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'}`}
    />
    {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <select 
      name={name} 
      id={name} 
      value={value} 
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
  </div>
);

const FileUploadField = ({ label, name, currentFileUrl, onFileChange, accept, helpText }) => {
  const [preview, setPreview] = useState(currentFileUrl);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(e);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="mt-1 flex items-center space-x-4">
        {preview && <img src={preview} alt={`${label} preview`} className="h-12 w-12 rounded-md object-contain bg-gray-100 dark:bg-gray-600 p-0.5" />}
        <label htmlFor={name} className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-md shadow-sm inline-flex items-center text-sm transition-colors">
          <UploadCloud size={16} className="mr-2" /> Upload File
        </label>
        <input id={name} name={name} type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
        {fileName && <span className="text-xs text-gray-500 dark:text-gray-400">{fileName}</span>}
      </div>
      {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
};

const ToggleField = ({ label, name, checked, onChange, helpText }) => (
  <div className="flex items-center justify-between">
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        {helpText && <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
    <button
      type="button"
      name={name}
      id={name}
      onClick={() => onChange({ target: { name, value: !checked } })}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-green-500 ${checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState(initialGlobalSettings);
  const [loading, setLoading] = useState(false); // For API calls

  // In a real app, fetch settings on mount
  // useEffect(() => { /* API call to fetch settings */ }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' || type === 'button' ? checked : value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setSettings(prev => ({ ...prev, [fieldName]: file }));
      // Note: For actual upload, you'd handle this in handleSave
    }
  };

  const handleSaveSection = async (sectionName) => {
    setLoading(true);
    // Placeholder for API call to save specific section settings
    console.log(`Saving ${sectionName} settings:`, settings);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLoading(false);
    alert(`${sectionName} settings saved successfully! (Placeholder)`);
    // Potentially refetch settings or update UI based on response
  };

  return (
    <div className="space-y-8 p-2 sm:p-4 md:p-6 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Global Settings</h1>

      <SettingSection title="General Platform Settings" icon={Settings}>
        <InputField label="Platform Name" name="platformName" value={settings.platformName} onChange={handleInputChange} />
        <SelectField 
          label="Default Language" 
          name="defaultLanguage" 
          value={settings.defaultLanguage} 
          onChange={handleInputChange} 
          options={[{value: 'en-US', label: 'English (US)'}, {value: 'es-ES', label: 'Español (España)'}, {value: 'fr-FR', label: 'Français (France)'}]} 
        />
        <SelectField 
          label="Default Timezone" 
          name="defaultTimezone" 
          value={settings.defaultTimezone} 
          onChange={handleInputChange} 
          options={[{value: 'UTC', label: 'UTC'}, {value: 'America/New_York', label: 'America/New_York (ET)'}, {value: 'Europe/London', label: 'Europe/London (GMT)'}]} 
        />
        <button onClick={() => handleSaveSection('General')} disabled={loading} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
          <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save General Settings'}
        </button>
      </SettingSection>

      <SettingSection title="Branding" icon={Palette}>
        <FileUploadField label="Platform Logo" name="platformLogo" currentFileUrl={settings.platformLogoUrl} onFileChange={(e) => handleFileChange(e, 'newPlatformLogo')} accept=".png, .jpg, .svg" helpText="Recommended: SVG or PNG, max 2MB."/>
        <FileUploadField label="Platform Favicon" name="platformFavicon" currentFileUrl={settings.platformFaviconUrl} onFileChange={(e) => handleFileChange(e, 'newPlatformFavicon')} accept=".ico, .png, .svg" helpText="Recommended: ICO or PNG (32x32px)."/>
        <InputField label="Primary Platform Color" name="primaryColor" type="color" value={settings.primaryColor} onChange={handleInputChange} helpText="This color will be used for main UI elements."/>
        <button onClick={() => handleSaveSection('Branding')} disabled={loading} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
          <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save Branding Settings'}
        </button>
      </SettingSection>

      <SettingSection title="Email Configuration" icon={Mail}>
        <InputField label="SMTP Host" name="smtpHost" value={settings.smtpHost} onChange={handleInputChange} placeholder="e.g., smtp.mailservice.com"/>
        <InputField label="SMTP Port" name="smtpPort" type="number" value={settings.smtpPort} onChange={handleInputChange} placeholder="e.g., 587 or 465"/>
        <InputField label="SMTP Username/Email" name="smtpUser" value={settings.smtpUser} onChange={handleInputChange} placeholder="e.g., noreply@yourplatform.com"/>
        <InputField label="SMTP Password" name="smtpPassword" type="password" onChange={handleInputChange} placeholder="Enter new password or leave blank" helpText="Leave blank to keep current password."/>
        <ToggleField label="Use Secure Connection (TLS/SSL)" name="smtpSecure" checked={settings.smtpSecure} onChange={handleInputChange} />
        <button onClick={() => handleSaveSection('Email')} disabled={loading} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
          <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save Email Settings'}
        </button>
      </SettingSection>

      <SettingSection title="Payment Gateway" icon={CreditCard}>
        <SelectField 
          label="Gateway Provider" 
          name="paymentGatewayProvider" 
          value={settings.paymentGatewayProvider || 'stripe'} 
          onChange={handleInputChange} 
          options={[{value: 'stripe', label: 'Stripe'}, {value: 'paypal', label: 'PayPal (Coming Soon)', disabled: true}]} 
        />
        <InputField label="API Key (Secret)" name="paymentGatewayApiKey" value={settings.paymentGatewayApiKey} onChange={handleInputChange} placeholder="sk_test_xxxxxxxxxxxx" helpText="Existing key shown for reference only. Enter new key to update."/>
        <SelectField 
          label="Gateway Mode" 
          name="paymentGatewayMode" 
          value={settings.paymentGatewayMode} 
          onChange={handleInputChange} 
          options={[{value: 'test', label: 'Test/Sandbox Mode'}, {value: 'live', label: 'Live Mode'}]} 
        />
        <button onClick={() => handleSaveSection('Payment')} disabled={loading} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
          <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save Payment Settings'}
        </button>
      </SettingSection>

      <SettingSection title="Maintenance Mode" icon={Tool}>
        <ToggleField 
            label="Enable Maintenance Mode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleInputChange}
            helpText="When enabled, tenants and users will see a maintenance page. Super Admins can still access the system."
        />
        <button onClick={() => handleSaveSection('Maintenance')} disabled={loading} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
          <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Save Maintenance Status'}
        </button>
      </SettingSection>

    </div>
  );
}
