'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/modules/admin-kit/components/data-table/data-table';
import { StatusBadge } from '@/modules/admin-kit/components/status-badge';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import {
  listUsersAction,
  updateUserRoleAction,
} from '@/modules/identity-access/presentation/actions/user-management-actions';
import type { Role } from '@/modules/identity-access';

interface UserRow {
  id: string;
  mobile: string;
  name: string;
  role: Role;
  status: string;
  createdAt: string;
}

const ROLES_LIST: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SUPPORT', 'CUSTOMER'];

export function UsersTable({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const loadUsers = () => {
    startTransition(async () => {
      try {
        const res = await listUsersAction({ page, limit: 10, search });
        setUsers(res.items as UserRow[]);
        setTotal(res.total);
      } catch (err: unknown) {
        console.error(err);
      }
    });
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleRoleChange = async (targetUserId: string, newRole: Role) => {
    try {
      const res = await updateUserRoleAction({ targetUserId, newRole });
      if (!res.ok) {
        toast.error(res.error || 'خطا در تغییر نقش');
        return;
      }
      toast.success('نقش کاربر با موفقیت بروزرسانی شد.');
      loadUsers();
    } catch {
      toast.error('خطای غیرمنتظره در ارتباط با سرور.');
    }
  };

  const columns = [
    {
      key: 'mobile',
      header: 'شماره موبایل',
      render: (u: UserRow) => (
        <span className="font-mono text-xs">{toPersianDigits(u.mobile)}</span>
      ),
    },
    {
      key: 'name',
      header: 'نام',
      render: (u: UserRow) => <span>{u.name || 'بدون نام'}</span>,
    },
    {
      key: 'status',
      header: 'وضعیت',
      render: (u: UserRow) => <StatusBadge status={u.status} />,
    },
    {
      key: 'role',
      header: 'نقش کاربری',
      render: (u: UserRow) => (
        <select
          value={u.role}
          disabled={u.id === currentUserId}
          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
          className="text-xs bg-muted/50 border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ROLES_LIST.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-sm">مدیریت کاربران و دسترسی‌ها</h3>
        <span className="text-xs text-muted-foreground">
          تعداد کل: {toPersianDigits(total)}
        </span>
      </div>
      <DataTable
        columns={columns}
        data={users}
        total={total}
        page={page}
        perPage={10}
        onPageChange={setPage}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="جستجو بر اساس نام یا شماره موبایل..."
        loading={isPending}
      />
    </div>
  );
}
