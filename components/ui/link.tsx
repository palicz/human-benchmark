"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useLoading } from "@/hooks/use-loading";
import { usePathname } from "next/navigation";

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function Link({ children, href, ...props }: LinkProps) {
  const { setIsLoading } = useLoading();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname !== href) {
      setIsLoading(true);
    }
  };

  return (
    <NextLink href={href} {...props} onClick={handleClick}>
      {children}
    </NextLink>
  );
}