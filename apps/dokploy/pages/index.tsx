import { IS_CLOUD, isAdminPresent } from "@dokploy/server";
import { validateRequest } from "@dokploy/server/lib/auth";
import type { GetServerSidePropsContext } from "next";
import { type ReactElement } from "react";
import { OnboardingLayout } from "@/components/layouts/onboarding-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/shared/logo";
import { CardContent } from "@/components/ui/card";
import { useWhitelabelingPublic } from "@/utils/hooks/use-whitelabeling";

export default function Home() {
	const { config: whitelabeling } = useWhitelabelingPublic();

	return (
		<>
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					<div className="flex flex-row items-center justify-center gap-2">
						<Logo
							className="size-12"
							logoUrl={
								whitelabeling?.loginLogoUrl ||
								whitelabeling?.logoUrl ||
								undefined
							}
						/>
						Sign in
					</div>
				</h1>
				<p className="text-sm text-muted-foreground">
					Sign in with your Google account
				</p>
			</div>
			<CardContent className="p-0">
				<SignInForm />
			</CardContent>
		</>
	);
}

Home.getLayout = (page: ReactElement) => {
	return <OnboardingLayout>{page}</OnboardingLayout>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	if (IS_CLOUD) {
		try {
			const { user } = await validateRequest(context.req);
			if (user) {
				return {
					redirect: {
						permanent: true,
						destination: "/dashboard/projects",
					},
				};
			}
		} catch {}

		return {
			props: {},
		};
	}
	const hasAdmin = await isAdminPresent();

	if (!hasAdmin) {
		return {
			redirect: {
				permanent: true,
				destination: "/register",
			},
		};
	}

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
