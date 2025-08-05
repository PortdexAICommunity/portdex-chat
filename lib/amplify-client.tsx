"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
// eslint-disable-next-line import/no-unresolved
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs, {
	ssr: true,
});

export default function ConfigureAmplifyClientSide({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Authenticator.Provider>{children}</Authenticator.Provider>;
}
