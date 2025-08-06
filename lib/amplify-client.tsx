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
	// return null;
}

// "use client";

// import React from "react";
// import { Amplify } from "aws-amplify";
// import config from "@/amplify_outputs.json";

// Amplify.configure(config, { ssr: true });

// const Auth = ({ children }: { children: React.ReactNode }) => {
// 	return children;
// };

// export default Auth;
