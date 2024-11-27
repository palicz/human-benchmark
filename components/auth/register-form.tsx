"use client";

import * as z from "zod";
import { useState, useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
    FormMessage
} from "@/components/ui/form"

import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
        })
    };

    return (
        <CardWrapper
        headerLabel="Register to access our content"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="John Doe" type="text"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="john.doe@email.com" type="email"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="******" type="password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="******" type="password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} typeof="submit" className="w-full">
                        Create account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}