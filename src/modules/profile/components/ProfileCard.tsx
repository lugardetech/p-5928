import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("first_name, last_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            ...data,
            email: user.email,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }

    loadProfile();
  }, []);

  if (!profile) return null;

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url || undefined} alt={initials} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>
            {profile.first_name} {profile.last_name}
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