"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  accessToken: z.string().nonempty(),
});

interface CredentialsProps {
  saveAction: (value: string) => Promise<void>;
}

export const Credentials = (props: CredentialsProps) => {
  const { saveAction } = props;

  const formId = React.useId();

  const submit = useMutation({
    mutationFn: async (accessToken: string) => {
      await saveAction(accessToken);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Successfully!");
    },
  });

  const form = useForm({
    defaultValues: {
      accessToken: "",
    },
    onSubmit: async ({ value }) => {
      await submit.mutateAsync(value.accessToken);
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          onReset={() => {
            form.reset();
          }}
          noValidate
        >
          <FieldGroup>
            <form.Field name="accessToken">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
                    <ButtonGroup>
                      <Input
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        name={field.name}
                        type="text"
                        placeholder="Type to search..."
                      />
                      <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting]}
                      >
                        {([canSubmit, isSubmitting]) => (
                          <Button
                            form={formId}
                            disabled={!canSubmit}
                            type="submit"
                            variant="outline"
                          >
                            {isSubmitting ? (
                              <Loader className="animate-spin" />
                            ) : (
                              <Save />
                            )}
                            Save
                          </Button>
                        )}
                      </form.Subscribe>
                    </ButtonGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <Field>
              <Button
                onClick={() => {
                  form.setFieldValue("accessToken", crypto.randomUUID());
                }}
                type="button"
                variant={"ghost"}
              >
                Auto generate
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
