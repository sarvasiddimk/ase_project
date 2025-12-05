'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, Mail, Phone, MapPin, Save, Camera, Shield, CreditCard, Bell, Settings, Globe, Loader2, UploadCloud } from 'lucide-react';
import { API_URL } from '../../lib/api';
import Toast, { ToastType } from '../_components/Toast';

interface BusinessProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    logo: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<BusinessProfile>({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        logo: '',
    });
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
    };

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/business-profile`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            showToast('Failed to load profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/business-profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                showToast('Settings saved successfully', 'success');
            } else {
                console.error('Save failed:', res.status, res.statusText);
                const errorText = await res.text();
                console.error('Error details:', errorText);
                showToast(`Failed to save settings: ${res.status} ${res.statusText}`, 'error');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Error saving settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size must be less than 5MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 pb-12">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 pt-8 px-4 lg:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your business profile and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-0">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden sticky top-8">
                            <nav className="p-2 space-y-1">
                                <TabButton
                                    active={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                    icon={<Building2 className="w-4 h-4" />}
                                    label="Business Profile"
                                />
                                <TabButton
                                    active={activeTab === 'notifications'}
                                    onClick={() => setActiveTab('notifications')}
                                    icon={<Bell className="w-4 h-4" />}
                                    label="Notifications"
                                />
                                <TabButton
                                    active={activeTab === 'security'}
                                    onClick={() => setActiveTab('security')}
                                    icon={<Shield className="w-4 h-4" />}
                                    label="Security"
                                />
                                <TabButton
                                    active={activeTab === 'billing'}
                                    onClick={() => setActiveTab('billing')}
                                    icon={<CreditCard className="w-4 h-4" />}
                                    label="Billing"
                                />
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Business Info Card */}
                                <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 dark:border-slate-800">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Information</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Visible to your customers on invoices and communications.</p>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        {/* Logo Upload */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="relative w-24 h-24 flex-shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center group cursor-pointer overflow-hidden transition-all hover:border-blue-500 hover:shadow-md"
                                            >
                                                {profile.logo ? (
                                                    <img src={profile.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm transition-opacity">
                                                        Change
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">Business Logo</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Upload your business logo to appear on invoices and reports.
                                                    <br />
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">Recommended: 512x512px, Max 5MB. JPG, PNG, SVG.</span>
                                                </p>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5"
                                                >
                                                    <UploadCloud className="w-4 h-4" />
                                                    Upload New Logo
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputField
                                                label="Business Name"
                                                value={profile.name}
                                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                icon={<Building2 />}
                                                placeholder="e.g. Red Panther Auto"
                                            />
                                            <InputField
                                                label="Email Address"
                                                value={profile.email}
                                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                icon={<Mail />}
                                                placeholder="e.g. contact@business.com"
                                            />
                                            <InputField
                                                label="Phone Number"
                                                value={profile.phone}
                                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                icon={<Phone />}
                                                placeholder="e.g. (555) 123-4567"
                                            />
                                            <InputField
                                                label="Website"
                                                value={profile.website}
                                                onChange={e => setProfile({ ...profile, website: e.target.value })}
                                                icon={<Globe />}
                                                placeholder="https://"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                                                <textarea
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[100px] resize-y transition-all bg-gray-50/30 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                                                    value={profile.address}
                                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                                    placeholder="Enter your full business address..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>

                                {/* Preferences Card */}
                                <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 dark:border-slate-800">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Customize your workspace.</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 transition-colors group cursor-pointer">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Dark Mode</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes.</div>
                                            </div>
                                            <Toggle />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 transition-colors group cursor-pointer">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Email Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Receive daily summaries of job activities.</div>
                                            </div>
                                            <Toggle defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'profile' && (
                            <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Coming Soon</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">This section is currently under development.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-gray-200'
                }
            `}
        >
            {icon}
            {label}
        </button>
    );
}

function InputField({ label, value, onChange, placeholder, icon }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; icon?: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{label}</label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-colors group-focus-within:text-blue-500">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/30 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 dark:text-white
                        ${icon ? 'pl-10 pr-4' : 'px-4'}
                    `}
                />
            </div>
        </div>
    );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <button
            onClick={() => setChecked(!checked)}
            className={`
                relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}
            `}
        >
            <span
                className={`
                    absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}
            />
        </button>
    );
}
