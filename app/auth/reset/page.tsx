import { ResetForm } from "@/components/auth/reset-form";
import Link from "next/link";

const ResetPage = () => {
    return (
        <>
            <div className="absolute left-4 top-4">
            <Link href="/" legacyBehavior>
                <a className="text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </a>
            </Link>
        </div>
        <ResetForm />
        </>
     );
}
 
export default ResetPage;