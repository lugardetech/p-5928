import { ProfileCard } from "../components/ProfileCard";
import { ProfileForm } from "../components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <ProfileCard />
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border p-8">
              <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}