'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/primitives/card';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { requestOtpAction, verifyOtpAction } from '../actions/auth-actions';
import { MobileStepForm } from './mobile-step-form';
import { CodeStepForm } from './code-step-form';

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [step, setStep] = useState<'mobile' | 'code'>('mobile');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestOtpAction(mobile);
      if (!res.ok) {
        toast.error(res.error || 'خطا در ارسال کد');
        return;
      }
      setStep('code');
      setCountdown(res.resendInSeconds || 60);
      if (res.devCode) {
        setDevCode(res.devCode);
        toast.info(`حالت توسعه: کد ورود آزمایشی شما ${toPersianDigits(res.devCode)} است`, {
          duration: 15000,
        });
      } else {
        toast.success('کد ورود به شماره موبایل شما ارسال شد');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('لطفاً کد ۶ رقمی را به صورت کامل وارد کنید');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtpAction(mobile, code);
      if (!res.ok || !res.user) {
        toast.error(res.error || 'کد وارد شده معتبر نمی‌باشد');
        return;
      }
      toast.success(`خوش آمدید، ${res.user.name || res.user.mobile}`);
      router.push(redirectUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <Wordmark size="md" />
        </div>
        <CardTitle className="text-xl font-bold">ورود به زیلاو</CardTitle>
        <CardDescription>
          {step === 'mobile'
            ? 'برای ورود یا ثبت‌نام شماره موبایل خود را وارد کنید'
            : `کد ۶ رقمی ارسال‌شده به ${toPersianDigits(mobile)} را وارد کنید`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {devCode && step === 'code' && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm text-center">
            <span className="font-bold">حالت آزمایشی:</span> کد ورود شما{' '}
            <span
              data-testid="dev-code-value"
              data-dev-code={devCode}
              className="font-mono text-base font-extrabold px-1 tracking-wider"
            >
              {toPersianDigits(devCode)}
            </span>{' '}
            است
          </div>
        )}

        {step === 'mobile' ? (
          <MobileStepForm
            mobile={mobile}
            onMobileChange={setMobile}
            onSubmit={handleRequestOtp}
            loading={loading}
          />
        ) : (
          <CodeStepForm
            code={code}
            onCodeChange={setCode}
            onSubmit={handleVerifyOtp}
            loading={loading}
            countdown={countdown}
            onResend={handleRequestOtp}
            onBackToMobile={() => {
              setStep('mobile');
              setCode('');
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
