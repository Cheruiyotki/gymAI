import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, isLoading, plan } = useAuth();

    // 1. Wait for Neon Auth to finish checking the session status
    if (isLoading) {
        return  null;
    }

    // 2. Now that loading is FALSE, if no user exists, redirect to sign-in
    if (!user) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    // 3. If user exists but hasn't created a workout plan yet, route to onboarding
    if (!plan) {
        return <Navigate to="/onboarding" replace />;
    }


    function formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString("en-KE", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        
      });
    }

    return (
      <div className="min-h-screen pt-24 pb-12 px-16"> 
         <div className="max-w-4xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="tetx-3xl font-bold mb-1"> Your Training Plan</h1>
                <p className="text-[var(--color-muted)]">Version {plan.version}. Created
                  {formatDate(plan.createdAt)}
                </p>
            </div>
           </div>
         </div>
      </div>
    );
}