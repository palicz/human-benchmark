
import { CardWrapper } from "@/components/auth/card-wrapper";
import { TriangleAlert } from "lucide-react";

export const ErrorCard = () => {
    return (
        <CardWrapper
        headerLabel="Hoppá! Sajnos hiba történt!"
        backButtonHref="/auth/login"
        backButtonLabel="Vissza a bejelentkezéshez"
        >
            <div className="w-full flex justify-center items-center">
                <TriangleAlert className="text-destructive"/>
            </div>
        </CardWrapper>
    )
}