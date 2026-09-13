"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArchiveRestore, ChevronDownIcon, Loader, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  date: z.iso.datetime(),
  duration: z.int(),
  note: z.string(),
});

type Values = z.infer<typeof schema>;

interface AddProps {
  action: (value: Values) => Promise<void>;
}

export const Add = (props: AddProps) => {
  const formId = React.useId();

  const submit = useMutation({
    mutationFn: async (value: Values) => {
      await props.action(value);
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
      date: new Date().toISOString(),
      duration: 8,
      note: "",
    },
    onSubmit: async ({ value }) => {
      await submit.mutateAsync(value);
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime Add</CardTitle>
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
            <form.Field name="date">
              {(field) => {
                const date = field.state.value
                  ? new Date(field.state.value)
                  : void 0;

                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground justify-between text-left font-normal"
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            field.handleChange(date?.toISOString() || "");
                          }}
                          defaultMonth={date}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="duration">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Duration</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");

                        field.handleChange(value ? Number.parseInt(value) : 0);
                      }}
                      onBlur={field.handleBlur}
                      name={field.name}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="note">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Note</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        placeholder="I'm having an issue with the login button on mobile."
                        rows={6}
                        className="min-h-24 resize-none"
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                        name={field.name}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          99/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-3">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                form={formId}
                disabled={!canSubmit}
                type="submit"
                className="uppercase"
              >
                {isSubmitting ? <Loader className="animate-spin" /> : <Save />}
                save
              </Button>
            )}
          </form.Subscribe>
          <Button variant={"outline"} className="uppercase">
            <ArchiveRestore />
            reset
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
