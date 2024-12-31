import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const credentialsSchema = z.object({
  client_id: z.string().min(1, "Client ID é obrigatório"),
  client_secret: z.string().min(1, "Client Secret é obrigatório"),
  redirect_uri: z.string().url("URL de redirecionamento inválida").min(1, "URL de redirecionamento é obrigatória"),
});

type CredentialsForm = z.infer<typeof credentialsSchema>;

interface CredentialsFormFieldsProps {
  form: UseFormReturn<CredentialsForm>;
}

export const CredentialsFormFields = ({ form }: CredentialsFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client ID</FormLabel>
            <FormControl>
              <Input placeholder="Insira seu Client ID" {...field} />
            </FormControl>
            <FormDescription>
              O Client ID fornecido pelo Mercado Livre
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_secret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Secret</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Insira seu Client Secret" {...field} />
            </FormControl>
            <FormDescription>
              O Client Secret fornecido pelo Mercado Livre
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="redirect_uri"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL de Redirecionamento</FormLabel>
            <FormControl>
              <Input placeholder="URL de redirecionamento" {...field} />
            </FormControl>
            <FormDescription>
              URL para onde o Mercado Livre redirecionará após a autenticação
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export { credentialsSchema };
export type { CredentialsForm };