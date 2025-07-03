"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "../../components/Layout"
import { UserIcon, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from "lucide-react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from '../../lib/store';
import { updateProfile, fetchProfile } from '../../lib/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? {
      street: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    dateOfBirth: user?.dateOfBirth ?? "",
  })
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [addressErrors, setAddressErrors] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Other",
  ];
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    } else {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? {
          street: "",
          landmark: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
        dateOfBirth: user.dateOfBirth ?? "",
      });
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [key]: value,
        },
      });
    }
  };

  const handleSave = async () => {
    // Address validation
    const errors: typeof addressErrors = {
      street: formData.address.street.trim() ? '' : 'Street is required',
      landmark: formData.address.landmark.trim() ? '' : 'Landmark is required',
      city: formData.address.city.trim() ? '' : 'City is required',
      state: formData.address.state.trim() ? '' : 'State is required',
      country: formData.address.country.trim() ? '' : 'Country is required',
      pincode: /^[0-9]{6}$/.test(formData.address.pincode.trim()) ? '' : 'Pincode must be 6 digits',
    };
    setAddressErrors(errors);
    const hasAddressError = Object.values(errors).some(Boolean);

    // Phone validation (10 digits)
    const phoneError = formData.phone.trim() && !/^\d{10}$/.test(formData.phone.trim()) ? 'Phone must be 10 digits' : '';
    // Email validation (basic)
    const emailError = formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim()) ? 'Invalid email format' : '';
    setFieldErrors({
      email: emailError,
      phone: phoneError,
      dateOfBirth: '',
    });
    const hasFieldError = [emailError, phoneError].some(Boolean);

    if (hasAddressError || hasFieldError) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    try {
      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err || 'Failed to update profile');
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? {
          street: "",
          landmark: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
        dateOfBirth: user.dateOfBirth ?? "",
      })
    }
    setIsEditing(false)
  }

  // Helper to format address
  const formatAddress = (address: typeof formData.address) => {
    if (!address) return "Not provided";
    return [
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.country,
      address.pincode
    ].filter(Boolean).join(", ");
  };

  if (!user) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-200">{user.email}</p>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mt-2">
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-codGray">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-codGray mb-2">
                  <UserIcon className="inline h-4 w-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-codGray">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-codGray mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-codGray">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-codGray mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-codGray">{formData.phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-codGray mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-codGray">
                    {formData.dateOfBirth || "Not provided"}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-codGray mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        Street
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      {addressErrors.street && <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="address.landmark"
                        value={formData.address.landmark}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      {addressErrors.landmark && <p className="text-red-500 text-xs mt-1">{addressErrors.landmark}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      {addressErrors.state && <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        Country
                      </label>
                      <select
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleSelectChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {addressErrors.country && <p className="text-red-500 text-xs mt-1">{addressErrors.country}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-codGray mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                      {addressErrors.pincode && <p className="text-red-500 text-xs mt-1">{addressErrors.pincode}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-codGray">{formatAddress(formData.address)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">0</span>
            </div>
            <h3 className="text-lg font-semibold text-codGray mb-2">Total Orders</h3>
            <p className="text-gray-600">Orders placed</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-brand-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">0</span>
            </div>
            <h3 className="text-lg font-semibold text-codGray mb-2">Wishlist Items</h3>
            <p className="text-gray-600">Saved products</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-mountbattenPink rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">$0</span>
            </div>
            <h3 className="text-lg font-semibold text-codGray mb-2">Total Spent</h3>
            <p className="text-gray-600">Lifetime value</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
