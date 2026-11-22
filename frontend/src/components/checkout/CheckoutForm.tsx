'use client';

import React, { useState } from 'react';
import { CustomerInfo, DeliveryAddress } from '@/types';

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export interface CheckoutFormData {
  customer: CustomerInfo;
  deliveryAddress: DeliveryAddress;
  notes?: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading?: boolean;
  account: CustomerInfo;
}

export function CheckoutForm({ onSubmit, isLoading = false, account }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer: {
      name: account.name,
      email: account.email,
      phone: account.phone,
    },
    deliveryAddress: {
      line1: '',
      line2: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
    },
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Customer validation
    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = 'Full name is required';
    }

    if (!formData.customer.email.trim()) {
      newErrors['customer.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email.trim())) {
      newErrors['customer.email'] = 'Please enter a valid email address';
    }

    const cleanPhone = formData.customer.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors['customer.phone'] = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors['customer.phone'] = 'Enter a valid 10-digit mobile number';
    }

    // Address validation
    if (!formData.deliveryAddress.line1.trim()) {
      newErrors['deliveryAddress.line1'] = 'Address is required';
    }

    if (!formData.deliveryAddress.city.trim()) {
      newErrors['deliveryAddress.city'] = 'City is required';
    }

    if (!formData.deliveryAddress.state) {
      newErrors['deliveryAddress.state'] = 'State is required';
    }

    const cleanPincode = formData.deliveryAddress.pincode.replace(/\D/g, '');
    if (!cleanPincode) {
      newErrors['deliveryAddress.pincode'] = 'PIN code is required';
    } else if (cleanPincode.length !== 6) {
      newErrors['deliveryAddress.pincode'] = 'Enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ─── Contact Information ─── */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs flex items-center justify-center font-bold">
            1
          </span>
          Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.customer.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer: { ...formData.customer, name: e.target.value },
                })
              }
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors['customer.name'] && (
              <p className="mt-1 text-xs text-red-500">{errors['customer.name']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              readOnly
              value={formData.customer.email}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600"
            />
            {errors['customer.email'] && (
              <p className="mt-1 text-xs text-red-500">{errors['customer.email']}</p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">Orders are saved to this account</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-neutral-400 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.customer.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer: {
                      ...formData.customer,
                      phone: e.target.value.replace(/\D/g, ''),
                    },
                  })
                }
                placeholder="9876543210"
                className="w-full pl-12 pr-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {errors['customer.phone'] && (
              <p className="mt-1 text-xs text-red-500">{errors['customer.phone']}</p>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">For delivery updates & courier</p>
          </div>
        </div>
      </div>

      {/* ─── Delivery Address ─── */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 text-xs flex items-center justify-center font-bold">
            2
          </span>
          Delivery Address
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Flat, House no., Building, Apartment <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.deliveryAddress.line1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryAddress: { ...formData.deliveryAddress, line1: e.target.value },
                })
              }
              placeholder="e.g. Flat 402, Sunshine Heights"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors['deliveryAddress.line1'] && (
              <p className="mt-1 text-xs text-red-500">{errors['deliveryAddress.line1']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Area, Street, Sector, Village <span className="text-neutral-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.deliveryAddress.line2 || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryAddress: { ...formData.deliveryAddress, line2: e.target.value },
                })
              }
              placeholder="e.g. Near City Center, MG Road"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.deliveryAddress.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryAddress: { ...formData.deliveryAddress, city: e.target.value },
                  })
                }
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors['deliveryAddress.city'] && (
                <p className="mt-1 text-xs text-red-500">{errors['deliveryAddress.city']}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.deliveryAddress.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryAddress: { ...formData.deliveryAddress, state: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors['deliveryAddress.state'] && (
                <p className="mt-1 text-xs text-red-500">{errors['deliveryAddress.state']}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.deliveryAddress.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryAddress: {
                      ...formData.deliveryAddress,
                      pincode: e.target.value.replace(/\D/g, ''),
                    },
                  })
                }
                placeholder="400001"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors['deliveryAddress.pincode'] && (
                <p className="mt-1 text-xs text-red-500">{errors['deliveryAddress.pincode']}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Order Notes / Delivery Instructions <span className="text-neutral-400">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Ring the bell twice or leave with security."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-md disabled:opacity-50 text-base"
      >
        {isLoading ? 'Opening secure payment...' : 'Pay with Razorpay'}
      </button>
    </form>
  );
}

