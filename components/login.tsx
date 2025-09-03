'use client';

import {
  Authenticator,
  Button,
  Heading,
  type Theme,
  ThemeProvider,
  useAuthenticator,
  useTheme,
  View,
} from '@aws-amplify/ui-react';
// import { signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
    },
  },
  signUp: {
    email: {
      placeholder: 'Enter your email',
      label: 'Email',
      order: 1,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      order: 2,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      order: 3,
    },
  },
};

const components = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <>
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Sign in to your account
          </Heading>
        </>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();

      return (
        <>
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toForgotPassword}
              size="small"
              variation="link"
            >
              Reset Password
            </Button>
          </View>
          <span className="text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Portdex. All rights reserved.
          </span>
        </>
      );
    },
  },
  SignUp: {
    Header() {
      return (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your account to join us</p>
        </div>
      );
    },
    Footer() {
      return (
        <>
          <span className="text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Portdex. All rights reserved.
          </span>
        </>
      );
    },
  },
};

function AuthenticatedApp() {
  const { user, signOut } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return null;
}

function Login() {
  const { tokens } = useTheme();
  const theme: Theme = {
    name: 'Portdex Chat Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            // Using a reference to the shadows token for consistency
            boxShadow: '{shadows.large}',
            borderWidth: '0',
          },
          form: {
            // Using a reference to the space token
            padding: '{space.xl}',
          },
        },
        button: {
          primary: {
            // This token references a very dark neutral color, similar to #1f1f1f
            backgroundColor: '{colors.neutral.100}',
            _hover: {
              backgroundColor: '{colors.neutral.90}',
            },
          },
          link: {
            // This token references a purple color from the color palette
            color: '{colors.purple.80}',
          },
        },
        fieldcontrol: {
          _focus: {
            // Composing a box shadow string using a color token reference
            boxShadow: '0 0 0 2px {colors.purple.60}',
          },
        },
        tabs: {
          item: {
            color: '{colors.neutral.80}',
            _active: {
              borderColor: '{colors.neutral.100}',
              color: '{colors.purple.100}',
            },
          },
        },
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Authenticator
            formFields={formFields}
            components={components}
            hideSignUp={false}
            variation="modal"
          >
            <AuthenticatedApp />
          </Authenticator>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
