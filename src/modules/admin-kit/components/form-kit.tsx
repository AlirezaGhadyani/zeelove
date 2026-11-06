'use client';

import React, { useState } from 'react';
import type { AdminFormField } from '../define-admin-resource';
import { Input } from '@/shared/ui/primitives/input';
import { Textarea } from '@/shared/ui/primitives/textarea';
import { Switch } from '@/shared/ui/primitives/switch';
import { Label } from '@/shared/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import { SaveBar } from './save-bar';

export interface FormKitProps {
  fields: AdminFormField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel?: () => void;
  title?: string;
  isSubmitting?: boolean;
}

export function FormKit({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  title,
  isSubmitting = false,
}: FormKitProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const data: Record<string, unknown> = { ...initialValues };
    fields.forEach((field) => {
      if (data[field.name] === undefined && field.defaultValue !== undefined) {
        data[field.name] = field.defaultValue;
      }
    });
    return data;
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setIsDirty(false);
  };

  const handleReset = () => {
    setFormData(initialValues);
    setIsDirty(false);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {title && <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => {
          const value = formData[field.name];

          if (field.type === 'switch') {
            return (
              <div
                key={field.name}
                className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={field.name} className="font-medium text-foreground cursor-pointer">
                    {field.label}
                  </Label>
                  {field.placeholder && (
                    <p className="text-xs text-muted-foreground">{field.placeholder}</p>
                  )}
                </div>
                <Switch
                  id={field.name}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => handleChange(field.name, checked)}
                />
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="md:col-span-2 space-y-2">
                <Label htmlFor={field.name} className="font-medium text-foreground">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={String(value ?? '')}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={4}
                />
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="font-medium text-foreground">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Select
                  value={String(value ?? '')}
                  onValueChange={(val) => handleChange(field.name, val)}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue placeholder={field.placeholder || 'انتخاب کنید...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="font-medium text-foreground">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type === 'number' ? 'number' : 'text'}
                value={value !== undefined ? String(value) : ''}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.type === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <SaveBar
        isDirty={isDirty}
        loading={isSubmitting}
        onSave={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        onReset={handleReset}
      />
    </form>
  );
}
