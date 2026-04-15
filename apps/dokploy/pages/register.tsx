import { IS_CLOUD, isAdminPresent, validateRequest } from "@dokploy/server";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { type ReactElement } from "react";
import { OnboardingLayout } from "@/components/layouts/onboarding-layout";
import { SignInWithGoogle } from "@/components/proprietary/auth/sign-in-with-google";
import { Logo } from "@/components/shared/logo";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useWhitelabelingPublic } from "@/utils/hooks/use-whitelabeling";

const Register = () => {
	const { config: whitelabeling } = useWhitelabelingPublic();

	return (
		<div className="">
			<div className="flex w-full items-center justify-center">
				<div className="flex flex-col items-center gap-4 w-full">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<Link href="/" className="flex flex-row items-center gap-2">
							<Logo
								className="size-12"
								logoUrl={
									whitelabeling?.loginLogoUrl ||
									whitelabeling?.logoUrl ||
									undefined
								}
							/>
						</Link>
						Setup the server
					</CardTitle>
					<CardDescription>
						Sign in with your Google account to setup the server
					</CardDescription>
					<div className="mx-auto w-full max-w-lg bg-transparent">
						<CardContent className="p-0">
							<SignInWithGoogle />
							<div className="mt-4 text-center text-sm flex flex-row justify-center gap-2 text-muted-foreground">
								Need help?
								<Link
									className="underline"
									href="https://dokploy.com"
									target="_blank"
								>
									Contact us
								</Link>
							</div>
						</CardContent>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;

Register.getLayout = (page: ReactElement) => {
	return <OnboardingLayout>{page}</OnboardingLayout>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	if (IS_CLOUD) {
		const { user } = await validateRequest(context.req);

		if (user) {
			return {
				redirect: {
					permanent: true,
					destination: "/dashboard/projects",
				},
			};
		}
		return {
			props: {},
		};
	}
	const hasAdmin = await isAdminPresent();

	if (hasAdmin) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};
	}
	return {
		props: {},
	};
}
