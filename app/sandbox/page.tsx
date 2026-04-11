"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

// 1. Nosso contrato de dados (Zod Schema)
const formSchema = z.object({
  documents: z
    .array(z.instanceof(File))
    .min(1, "É obrigatório enviar pelo menos um documento.")
    .max(5, "Podes enviar no máximo 5 documentos."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SandboxPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 2. Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // 1. Monta o pacote de dados real para envio HTTP
      const formData = new FormData();
      data.documents.forEach((file) => {
        formData.append("documents", file); // "documents" é a chave que a API procura
      });

      // 2. Dispara o POST para o nosso próprio Back-end
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // 3. Valida a resposta REST
      if (!response.ok) {
        throw new Error(result.error || "Falha ao contactar a API.");
      }

      // 4. Sucesso! Mostra o resultado do Back-end na tela
      console.log("Resposta do Servidor:", result);
      toast({
        title: "Sucesso Absoluto!",
        description: result.message,
      });

      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Playground de Upload
          </h1>
          <p className="text-muted-foreground">
            Testa o componente de upload num ambiente de formulário real.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentos Pessoais</FormLabel>
                  <FormControl>
                    <FileUpload
                      className="border-primary/20"
                      maxSize={10}
                      acceptedFormats={["PDF", "JPG", "PNG"]}
                      isLoading={isSubmitting}
                      onFileSelect={(files) => field.onChange(files)}
                      onReset={() => field.onChange([])}
                    />
                  </FormControl>
                  <FormDescription>
                    Faz o upload do teu CC ou Passaporte (Máx 10MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "A processar..." : "Salvar e Enviar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
