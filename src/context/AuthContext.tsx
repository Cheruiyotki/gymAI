import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    saveProfile: (
        profile: Omit<UserProfile, "userId" | "updatedAt">,
    ) => Promise<void>;
    generatePlan: ( ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({children} : {children: ReactNode}) {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const [isLoading, setisLoading] = useState(true);
    const isRefreshingRef = useRef(false);
    

    useEffect(() =>  {
        async function  loadUSer() {
        try {
            const result = await authClient.getSession();
            if (result && result.data?.user) {
                setNeonUser(result.data.user);
            } else {
                setNeonUser(null);
            } 

        } catch (err) {
           setNeonUser(null);
        } finally {
                setisLoading(false)
              }
    }  

    loadUSer();
    }, [])

 

    // refreshData memoize the function to avoid unnecessary re-renders
     const refreshData = useCallback(async () => {
        if (!neonUser || isRefreshingRef.current) return;

        isRefreshingRef.current = true;

        try {
          //Fetch profile data from the API
          // const profile data

          //feth plam
         const planData = await api.getCurrentPlan(neonUser.id).catch(() => null)
         if (planData) {

         }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        } finally {
            isRefreshingRef.current = false;
        }
     })
    async function saveProfile(profileData: Omit<UserProfile, 'userId' | 'updatedAt'>) {
        if (!neonUser) {
            throw new Error ("User must be authenticated to save profile");
        }
 
    await api.saveProfile(neonUser.id, profileData);
       
  
    }

    
    async function  generatePlan( ) {
        if (!neonUser) {
            throw new Error ("User must be authenticated to generate plan");
        }
 
    await api.generatePlan(neonUser.id);
       
  
    }


    return <AuthContext.Provider value={{user: neonUser, isLoading, saveProfile, generatePlan}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}