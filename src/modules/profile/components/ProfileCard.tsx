import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        console.log("Buscando perfil para usuário:", user.id);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao carregar perfil:", error);
          setLoading(false);
          return;
        }

        setProfile({
          ...data,
          email: user.email,
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>Perfil não encontrado</CardTitle>
            <p className="text-sm text-muted-foreground">
              Por favor, atualize suas informações
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url || undefined} alt={initials} />
          <AvatarFallback>{initials || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>
            {profile.first_name || profile.last_name 
              ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
              : "Sem nome"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Adicione mais informações do perfil aqui se necessário */}
      </CardContent>
    </Card>
  );
}