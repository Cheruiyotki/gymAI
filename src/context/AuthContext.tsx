import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { TrainingPlan, User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    saveProfile: (profile: Omit<UserProfile, "userId" | "updatedAt">) => Promise<void>;
    generatePlan: () => Promise<void>;
    plan: TrainingPlan | null;
    refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isRefreshingRef = useRef(false);

    // refreshData updates plan state from the backend
    const refreshData = useCallback(async (currentUser = neonUser) => {
        if (!currentUser || isRefreshingRef.current) return;

        isRefreshingRef.current = true;
        try {
            const planData = await api.getCurrentPlan(currentUser.id).catch(() => null);
            if (planData) {
                setPlan({
                    id: planData.id,
                    userId: planData.userId,
                    overview: planData.planJson.overview,
                    weeklySchedule: planData.planJson.weeklySchedule,
                    progression: planData.planJson.progression,
                    version: planData.version,
                    createdAt: planData.createdAt,
                });
            } else {
                setPlan(null);
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [neonUser?.id]);

    // Combined initialization loop to prevent layout shifts
    useEffect(() => {
        async function initializeAuth() {
            try {
                const result = await authClient.getSession();
                if (result?.data?.user) {
                    const user = result.data.user;
                    setNeonUser(user);
                    
                    // Fetch the plan directly inside the loading phase before setting isLoading to false
                    const planData = await api.getCurrentPlan(user.id).catch(() => null);
                    if (planData) {
                        setPlan({
                            id: planData.id,
                            userId: planData.userId,
                            overview: planData.planJson.overview,
                            weeklySchedule: planData.planJson.weeklySchedule,
                            progression: planData.planJson.progression,
                            version: planData.version,
                            createdAt: planData.createdAt,
                        });
                    }
                } else {
                    setNeonUser(null);
                    setPlan(null);
                }
            } catch (err) {
                setNeonUser(null);
                setPlan(null);
            } finally {
                setIsLoading(false);
            }
        }

        initializeAuth();
    }, []);

    async function saveProfile(profileData: Omit<UserProfile, 'userId' | 'updatedAt'>) {
        if (!neonUser) {
            throw new Error("User must be authenticated to save profile");
        }
        await api.saveProfile(neonUser.id, profileData);
        await refreshData();
    }

    async function generatePlan() {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate plan");
        }
        setIsLoading(true); // Put layout back into loading mode while generating raw plan
        try {
            await api.generatePlan(neonUser.id);
            await refreshData();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile, generatePlan, refreshData, plan }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}