import { Suspense } from 'react';
import { LoginForm } from '@/components/account/LoginForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-24 flex justify-center">
          <LoadingSpinner size="lg" label="Loading sign in..." />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
