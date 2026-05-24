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
import { uploadDocuments } from "@/lib/upload-client";

const MAX_DOCUMENTS = 5;

const formSchema = z.object({
  documents: z
    .array(z.instanceof(File))
    .min(1, "É obrigatório enviar pelo menos um documento.")
    .max(MAX_DOCUMENTS, "Podes enviar no máximo 5 documentos."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SandboxPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const result = await uploadDocuments(data.documents);
      toast({
        title: "Upload concluído",
        description: result.message,
      });
      form.reset({ documents: [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: message,
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
            Componente + react-hook-form + API{" "}
            <code className="text-xs">/api/upload</code>
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
                      files={field.value}
                      maxSize={10}
                      maxFiles={MAX_DOCUMENTS}
                      acceptedFormats={["PDF", "JPG", "PNG"]}
                      isLoading={isSubmitting}
                      showUploadButton={false}
                      onFileSelect={field.onChange}
                      onReset={() => field.onChange([])}
                    />
                  </FormControl>
                  <FormDescription>
                    Faz o upload do teu CC ou Passaporte (Máx 10MB, até 5
                    ficheiros). Os ficheiros são guardados em{" "}
                    <code className="text-xs">public/uploads</code>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "A enviar..." : "Enviar para API"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
