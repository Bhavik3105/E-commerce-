import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/account/ResetPasswordForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-24 flex justify-center">
          <LoadingSpinner size="lg" label="Loading password reset..." />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
