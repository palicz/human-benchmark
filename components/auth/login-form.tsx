"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

import { LoginSchema } from "@/schemas";
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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Ez az email cím már használatban van másik szolgáltatóval."
        : "";

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setIsPending(true);

        try {
            const result = await signIn("credentials", {
                ...values,
                redirect: false,
            });

            if (result?.error) {
                setError("Érvénytelen bejelentkezési adatok!");
            } else {
                router.push(DEFAULT_LOGIN_REDIRECT);
            }
        } catch (error) {
            setError("Hoppá! Valami hiba történt!");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <CardWrapper
        headerLabel="Bejelentkezés"
        backButtonLabel="Még nincs fiókod?"
        backButtonHref="/auth/register"
        showSocial>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
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
                                    Jelszó
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="******" type="password"/>
                                </FormControl>
                                <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                        <Link href="/auth/reset">
                                            Elfelejtetted a jelszavadat?
                                        </Link>
                                    </Button>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} typeof="submit" className="w-full">
                        Bejelentkezés
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}