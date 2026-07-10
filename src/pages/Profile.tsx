import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../componets/ui/Button";
import { Calendar, Dumbbell, RefreshCcw, Target, TrendingUp } from "lucide-react";
import { Card } from "../componets/ui/Card";
import { PlanDisplay } from "../componets/plan/planDisplay";

export default function Profile() {
    const { user, isLoading, plan, generatePlan } = useAuth();

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
                <h1 className="text-3xl font-bold mb-1"> Your Training Plan</h1>
                <p className="text-[var(--color-muted)]">Version {plan.version}. Created
                  {formatDate(plan.createdAt)}
                </p>
            </div>

            <Button  variant="secondary" className="gap-2" onClick={async() => await generatePlan( )}> 
               <RefreshCcw className="w-4 h-4"/>
               Regenerate Plan
            </Button>
           </div>
           <div className="grid md:grid-cols-4 gap-4 mb-8">
             <Card variant="bordered" className="flex items-center gap-3">
               <div className="w-10 h-10 flex items-center gap-3">
                  <Target className="w-5 h-5 text-[var(--color-accent)]"/>
               </div>
               <div>
                  <p className="text-xs text-var[var(--color-muuted)]">Goal</p>
                  <p className="font-medium text-sm">{plan.overview.goal}</p>
               </div>
             </Card>
             <Card variant="bordered" className="flex items-center gap-3">
               <div className="w-10 h-10 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-accent)]"/>
               </div>
               <div>
                  <p className="text-xs text-var[var(--color-muuted)]">Frequency</p>
                  <p className="font-medium text-sm">{plan.overview.frequency}</p>
               </div>
             </Card>
             <Card variant="bordered" className="flex items-center gap-3">
               <div className="w-10 h-10 flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-[var(--color-accent)]"/>
               </div>
               <div>
                  <p className="text-xs text-var[var(--color-muuted)]">split</p>
                  <p className="font-medium text-sm">{plan.overview.split}</p>
               </div>
             </Card>
             <Card variant="bordered" className="flex items-center gap-3">
               <div className="w-10 h-10 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[var(--color-accent)]"/>
               </div>
               <div>
                  <p className="text-xs text-var[var(--color-muuted)]">Version</p>
                  <p className="font-medium text-sm">{plan.version}</p>
               </div>
             </Card>
           </div>

           {/* Plan notes */}
           <Card variant="bordered" className="mb-8">
            <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">{plan.overview.notes}</p>
           </Card>

           {/* Weekly Schedule */}
           <h2 className="font-semibold text-lg mb-4">Weekly Schedule</h2>
           <PlanDisplay weeklySchedule={plan.weeklySchedule}/>

           <Card variant="bordered" className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Progression Strategy</h2>
          <p className="text-[var(--color-muted)] text-sm leading-relaxed">
            {plan.progression}
          </p>
        </Card>
         </div>
      </div>
    );
}